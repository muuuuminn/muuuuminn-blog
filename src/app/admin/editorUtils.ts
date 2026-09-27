import { MASTER_CATEGORIES } from "@/features/category/constants";
import type { CmsPostInput, CmsPostStatus } from "@/libs/cms/types";
import type { EditorPost, FieldErrors } from "./editorTypes";

export const createEmptyPost = (): EditorPost => ({
  slug: "",
  title: "",
  description: "",
  publishedAt: new Date().toISOString(),
  coverImage: "",
  ogImageUrl: "",
  category: MASTER_CATEGORIES[0]?.id ?? "",
  tags: [],
  body: "",
  status: "draft",
});

function editablePost(post: EditorPost): CmsPostInput {
  return {
    slug: post.slug,
    title: post.title,
    description: post.description,
    publishedAt: post.publishedAt,
    coverImage: post.coverImage,
    ogImageUrl: post.ogImageUrl,
    category: post.category,
    tags: post.tags,
    body: post.body,
    status: post.status,
  };
}

export function createPostSnapshot(post: EditorPost): string {
  return JSON.stringify(editablePost(post));
}

export function toDateTimeLocal(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const offset = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

export function formatUpdatedAt(value?: string): string {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("ja-JP", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function slugify(value: string): string {
  return value
    .normalize("NFKD")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

export function validatePost(
  post: EditorPost,
  status: CmsPostStatus,
): FieldErrors {
  const errors: FieldErrors = {};
  if (!post.title.trim()) errors.title = "タイトルを入力してください。";
  if (!post.slug.trim()) {
    errors.slug = "スラッグを入力してください。";
  } else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(post.slug)) {
    errors.slug = "半角英小文字・数字・ハイフンのみ使えます。";
  }
  if (!post.description.trim()) errors.description = "概要を入力してください。";
  if (!post.body.trim()) errors.body = "本文を入力してください。";
  if (Number.isNaN(Date.parse(post.publishedAt))) {
    errors.publishedAt = "公開日時を入力してください。";
  }
  if (!post.category) errors.category = "カテゴリを選択してください。";
  if (status === "published" && !post.coverImage.trim()) {
    errors.coverImage = "公開するにはカバー画像が必要です。";
  }
  return errors;
}
