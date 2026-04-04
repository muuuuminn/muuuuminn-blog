import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import matter from "gray-matter";

const require = createRequire(import.meta.url);
const zennMarkdownHtmlModule = require("zenn-markdown-html");
const markdownHtml =
  typeof zennMarkdownHtmlModule === "function"
    ? zennMarkdownHtmlModule
    : typeof zennMarkdownHtmlModule.default === "function"
      ? zennMarkdownHtmlModule.default
      : null;

if (markdownHtml === null) {
  console.log(zennMarkdownHtmlModule);
  throw new Error("zenn-markdown-html export shape is unsupported");
}

const POSTS_DIRECTORY_NAME = "src/muuuuminn-blog/posts";
const OUTPUT_FILE_PATH = "src/libs/markdown/posts.generated.json";

function getPostDirectories(postsDirectory) {
  return fs
    .readdirSync(postsDirectory, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);
}

function normalizeString(value) {
  return typeof value === "string" ? value : "";
}

function normalizeTags(value) {
  if (typeof value !== "string") {
    return [];
  }

  return [...new Set(value.split(",").map((tag) => tag.trim()).filter(Boolean))];
}

async function readMarkdownFile(slug, postsDirectory) {
  const fullPath = path.join(postsDirectory, slug, "index.md");
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  return {
    slug,
    title: normalizeString(data.title),
    date: normalizeString(data.date),
    ogImageUrl: normalizeString(data.ogImageUrl),
    coverImage: normalizeString(data.coverImage),
    description: normalizeString(data.description),
    category: normalizeString(data.category),
    tags: normalizeTags(data.tags),
    html: await markdownHtml(content),
  };
}

function sortPostsDesc(posts) {
  return [...posts].sort((a, b) => {
    if (a.date === b.date) {
      return a.slug.localeCompare(b.slug);
    }

    return a.date > b.date ? -1 : 1;
  });
}

function ensureOutputDirectory(outputPath) {
  const outputDirectory = path.dirname(outputPath);
  fs.mkdirSync(outputDirectory, { recursive: true });
}

async function main() {
  const postsDirectory = path.join(process.cwd(), POSTS_DIRECTORY_NAME);

  if (!fs.existsSync(postsDirectory)) {
    throw new Error(`Posts directory not found: ${postsDirectory}`);
  }

  const slugs = getPostDirectories(postsDirectory);
  const posts = await Promise.all(
    slugs.map((slug) => readMarkdownFile(slug, postsDirectory)),
  );
  const sortedPosts = sortPostsDesc(posts);

  const outputPath = path.join(process.cwd(), OUTPUT_FILE_PATH);
  ensureOutputDirectory(outputPath);
  fs.writeFileSync(outputPath, JSON.stringify(sortedPosts, null, 2), "utf8");

  console.log(`Generated ${sortedPosts.length} posts: ${OUTPUT_FILE_PATH}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
