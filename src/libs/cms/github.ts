import "server-only";

import { getCloudflareContext } from "@opennextjs/cloudflare";
import matter from "gray-matter";
import type { CmsPostInput, CmsPostRecord, CmsPostStatus } from "./types";

const POSTS_DIRECTORY = "src/muuuuminn-blog/posts";

type GithubEnv = CloudflareEnv & {
  GITHUB_TOKEN?: string;
  GITHUB_OWNER?: string;
  GITHUB_REPO?: string;
  GITHUB_BRANCH?: string;
};

type GithubConfig = {
  token: string;
  owner: string;
  repo: string;
  branch: string;
};

type GithubContentEntry = {
  name: string;
  path: string;
  sha: string;
  type: "file" | "dir";
  content?: string;
  encoding?: string;
};

type GithubCommitResponse = {
  commit?: { html_url?: string; sha?: string };
};

type GithubPost = CmsPostRecord & { sha: string; source: "github" };

const POST_CACHE_TTL_SECONDS = 300;

type CloudflareCacheStorage = CacheStorage & { readonly default: Cache };

function getDefaultCache(): Cache {
  return (caches as CloudflareCacheStorage).default;
}

export class GithubCmsError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
  }
}

async function getConfig(): Promise<GithubConfig> {
  const context = await getCloudflareContext({ async: true });
  const env = context.env as GithubEnv;
  const token = env.GITHUB_TOKEN || "";
  const owner = env.GITHUB_OWNER || "muuuuminn";
  const repo = env.GITHUB_REPO || "muuuuminn-blog";
  const branch = env.GITHUB_BRANCH || "main";

  if (!token) {
    throw new GithubCmsError("GITHUB_TOKEN is not configured", 503);
  }

  return { token, owner, repo, branch };
}

async function githubFetch<T>(
  config: GithubConfig,
  path: string,
  init?: RequestInit,
): Promise<T> {
  const response = await fetch(`https://api.github.com${path}`, {
    ...init,
    cache: "no-store",
    headers: {
      accept: "application/vnd.github+json",
      authorization: `Bearer ${config.token}`,
      "user-agent": "muuuuminn-blog-cms",
      "x-github-api-version": "2022-11-28",
      ...init?.headers,
    },
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new GithubCmsError(
      `GitHub API request failed (${response.status}): ${detail}`,
      response.status,
    );
  }

  return (await response.json()) as T;
}

function decodeContent(value: string): string {
  return Buffer.from(value.replace(/\n/g, ""), "base64").toString("utf8");
}

function normalizeString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function normalizeTags(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter((tag): tag is string => typeof tag === "string");
  }
  if (typeof value === "string") {
    return [
      ...new Set(
        value
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
      ),
    ];
  }
  return [];
}

function normalizeStatus(value: unknown): CmsPostStatus {
  if (value === undefined || value === null || value === "") return "published";
  if (value === "published" || value === "archived") return value;
  return "draft";
}

function parsePost(
  slug: string,
  markdown: string,
  sha: string,
): CmsPostRecord & { sha: string; source: "github" } {
  const { data, content } = matter(markdown);
  const publishedAt = normalizeString(data.date);

  return {
    slug,
    title: normalizeString(data.title),
    description: normalizeString(data.description),
    publishedAt,
    coverImage: normalizeString(data.coverImage),
    ogImageUrl: normalizeString(data.ogImageUrl),
    category: normalizeString(data.category),
    tags: normalizeTags(data.tags),
    body: content.trimStart(),
    status: normalizeStatus(data.status),
    createdAt: normalizeString(data.createdAt) || publishedAt,
    updatedAt: normalizeString(data.updatedAt) || publishedAt,
    sha,
    source: "github",
  };
}

function serializePost(input: CmsPostInput, createdAt: string): string {
  const updatedAt = new Date().toISOString();
  return matter.stringify(input.body.trimStart(), {
    title: input.title,
    description: input.description,
    date: input.publishedAt,
    coverImage: input.coverImage,
    ogImageUrl: input.ogImageUrl,
    category: input.category,
    tags: input.tags.join(","),
    status: input.status,
    createdAt,
    updatedAt,
  });
}

function postCacheKey(config: GithubConfig, slug: string): Request {
  const scope = [config.owner, config.repo, config.branch, slug]
    .map(encodeURIComponent)
    .join("/");
  return new Request(`https://cms-cache.invalid/v1/posts/${scope}`);
}

async function readCachedPost(
  config: GithubConfig,
  slug: string,
): Promise<GithubPost | null> {
  try {
    const response = await getDefaultCache().match(postCacheKey(config, slug));
    return response ? ((await response.json()) as GithubPost) : null;
  } catch {
    return null;
  }
}

async function writeCachedPost(
  config: GithubConfig,
  post: GithubPost,
): Promise<void> {
  try {
    await getDefaultCache().put(
      postCacheKey(config, post.slug),
      new Response(JSON.stringify(post), {
        headers: {
          "cache-control": `public, max-age=${POST_CACHE_TTL_SECONDS}`,
          "content-type": "application/json; charset=utf-8",
        },
      }),
    );
  } catch {
    // Cache API is an optimization and may be unavailable in local Node.js.
  }
}

async function deleteCachedPost(
  config: GithubConfig,
  slug: string,
): Promise<void> {
  try {
    await getDefaultCache().delete(postCacheKey(config, slug));
  } catch {
    // A cache miss or an unavailable local Cache API must not block a save.
  }
}

async function getContentEntry(
  config: GithubConfig,
  path: string,
): Promise<GithubContentEntry> {
  return githubFetch<GithubContentEntry>(
    config,
    `/repos/${config.owner}/${config.repo}/contents/${path}?ref=${encodeURIComponent(config.branch)}`,
  );
}

export async function getGithubPost(
  slug: string,
  options: { skipCache?: boolean } = {},
) {
  const config = await getConfig();
  if (!options.skipCache) {
    const cached = await readCachedPost(config, slug);
    if (cached) return cached;
  }

  try {
    const file = await getContentEntry(
      config,
      `${POSTS_DIRECTORY}/${slug}/index.md`,
    );
    if (!file.content) {
      throw new GithubCmsError(`Content is missing: ${file.path}`, 502);
    }
    const post = parsePost(slug, decodeContent(file.content), file.sha);
    await writeCachedPost(config, post);
    return post;
  } catch (error) {
    if (error instanceof GithubCmsError && error.status === 404) return null;
    throw error;
  }
}

export async function saveGithubPost(
  input: CmsPostInput,
  mode: "create" | "update" = "update",
): Promise<{ commitUrl: string | null }> {
  const config = await getConfig();
  const existing = await getGithubPost(input.slug, { skipCache: true });
  if (mode === "create" && existing) {
    throw new GithubCmsError("同じスラッグの記事がすでに存在します。", 409);
  }
  if (mode === "update" && !existing) {
    throw new GithubCmsError("更新対象の記事が存在しません。", 404);
  }
  const createdAt = existing?.createdAt || new Date().toISOString();
  const markdown = serializePost(input, createdAt);
  const path = `${POSTS_DIRECTORY}/${input.slug}/index.md`;
  const result = await githubFetch<GithubCommitResponse>(
    config,
    `/repos/${config.owner}/${config.repo}/contents/${path}`,
    {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        message: `content: ${input.status} ${input.slug}`,
        content: Buffer.from(markdown, "utf8").toString("base64"),
        branch: config.branch,
        ...(existing ? { sha: existing.sha } : {}),
      }),
    },
  );

  await deleteCachedPost(config, input.slug);

  return { commitUrl: result.commit?.html_url || null };
}
