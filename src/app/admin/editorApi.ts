import type { CmsPostStatus } from "@/libs/cms/types";
import type { EditorPost } from "./editorTypes";

type CommitResponse = {
  commitUrl?: string | null;
};

type ErrorResponse = {
  error?: string;
};

async function requestJson<T>(
  url: string,
  init: RequestInit,
  fallbackError: string,
): Promise<T> {
  const response = await fetch(url, init);
  const data = (await response.json()) as T & ErrorResponse;
  if (!response.ok) {
    throw new Error(data.error || fallbackError);
  }
  return data;
}

export async function fetchPosts(): Promise<EditorPost[]> {
  const data = await requestJson<{ posts: EditorPost[] }>(
    "/api/admin/posts",
    { cache: "no-store" },
    "記事を読み込めませんでした。",
  );
  return data.posts;
}

export async function savePost(
  post: EditorPost,
  status: CmsPostStatus,
  originalSlug: string | null,
): Promise<{ post: EditorPost; commitUrl: string | null }> {
  const postToSave = { ...post, status };
  const url = originalSlug
    ? `/api/admin/posts/${encodeURIComponent(originalSlug)}`
    : "/api/admin/posts";
  const data = await requestJson<CommitResponse>(
    url,
    {
      method: originalSlug ? "PUT" : "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(postToSave),
    },
    "保存に失敗しました。",
  );
  return { post: postToSave, commitUrl: data.commitUrl || null };
}

export async function renderPostPreview(body: string): Promise<string> {
  const data = await requestJson<{ html: string }>(
    "/api/admin/preview",
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ body }),
    },
    "プレビューに失敗しました。",
  );
  return data.html;
}

export async function archivePost(slug: string): Promise<string | null> {
  const data = await requestJson<CommitResponse>(
    `/api/admin/posts/${encodeURIComponent(slug)}`,
    { method: "DELETE" },
    "非公開にできませんでした。",
  );
  return data.commitUrl || null;
}

export async function uploadPostImage(
  file: File,
  slug: string,
): Promise<string> {
  const formData = new FormData();
  formData.set("file", file);
  formData.set("slug", slug);
  const data = await requestJson<{ url?: string }>(
    "/api/admin/assets",
    { method: "POST", body: formData },
    "画像をアップロードできませんでした。",
  );
  if (!data.url) throw new Error("画像をアップロードできませんでした。");
  return data.url;
}
