import { CMS_POST_STATUSES, type CmsPostInput } from "./types";

type ValidationResult =
  | { success: true; data: CmsPostInput }
  | { success: false; error: string };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function readString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export function validateCmsPostInput(value: unknown): ValidationResult {
  if (!isRecord(value)) {
    return { success: false, error: "入力形式が正しくありません。" };
  }

  const slug = readString(value.slug);
  const title = readString(value.title);
  const description = readString(value.description);
  const publishedAt = readString(value.publishedAt);
  const coverImage = readString(value.coverImage);
  const ogImageUrl = readString(value.ogImageUrl) || coverImage;
  const category = readString(value.category);
  const body = typeof value.body === "string" ? value.body : "";
  const status = readString(value.status);
  const tags = Array.isArray(value.tags)
    ? [...new Set(value.tags.map(readString).filter(Boolean))]
    : [];

  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    return {
      success: false,
      error: "スラッグは半角英小文字・数字・ハイフンで入力してください。",
    };
  }

  if (!title || !description || !body) {
    return { success: false, error: "タイトル、概要、本文は必須です。" };
  }

  if (Number.isNaN(Date.parse(publishedAt))) {
    return { success: false, error: "公開日時が正しくありません。" };
  }

  if (!/^-?\d+$/.test(category)) {
    return { success: false, error: "カテゴリが正しくありません。" };
  }

  if (tags.some((tag) => !/^\d+$/.test(tag))) {
    return { success: false, error: "タグが正しくありません。" };
  }

  if (!CMS_POST_STATUSES.includes(status as CmsPostInput["status"])) {
    return { success: false, error: "公開状態が正しくありません。" };
  }

  if (status === "published" && !coverImage) {
    return { success: false, error: "公開記事にはカバー画像が必要です。" };
  }

  return {
    success: true,
    data: {
      slug,
      title,
      description,
      publishedAt: new Date(publishedAt).toISOString(),
      coverImage,
      ogImageUrl,
      category,
      tags,
      body,
      status: status as CmsPostInput["status"],
    },
  };
}
