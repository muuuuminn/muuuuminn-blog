"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { MASTER_CATEGORIES } from "@/features/category/constants";
import { MASTER_TAGS } from "@/features/tag/constants";
import type { CmsPostInput, CmsPostStatus } from "@/libs/cms/types";
import styles from "./admin.module.css";

type EditorPost = CmsPostInput & {
  createdAt?: string;
  updatedAt?: string;
  source?: "github";
  sha?: string;
};

const emptyPost = (): EditorPost => ({
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

function toDateTimeLocal(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const offset = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

function statusLabel(status: CmsPostStatus): string {
  return { draft: "下書き", published: "公開中", archived: "非公開" }[status];
}

export function CmsEditor() {
  const [posts, setPosts] = useState<EditorPost[]>([]);
  const [post, setPost] = useState<EditorPost>(emptyPost);
  const [originalSlug, setOriginalSlug] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [message, setMessage] = useState("記事を読み込んでいます…");
  const [busy, setBusy] = useState(false);
  const [previewHtml, setPreviewHtml] = useState("");
  const [commitUrl, setCommitUrl] = useState<string | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);

  const loadPosts = useCallback(async () => {
    const response = await fetch("/api/admin/posts", { cache: "no-store" });
    const data = (await response.json()) as {
      posts: EditorPost[];
      error?: string;
    };
    if (!response.ok) {
      throw new Error(data.error || "記事を読み込めませんでした。");
    }
    setPosts(data.posts);
    setMessage(`${data.posts.length}件の記事`);
  }, []);

  useEffect(() => {
    loadPosts().catch((error: Error) => setMessage(error.message));
  }, [loadPosts]);

  const filteredPosts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return posts;
    return posts.filter(
      (item) =>
        item.title.toLowerCase().includes(normalizedQuery) ||
        item.slug.includes(normalizedQuery),
    );
  }, [posts, query]);

  const update = <K extends keyof EditorPost>(key: K, value: EditorPost[K]) => {
    setPost((current) => ({ ...current, [key]: value }));
  };

  const selectPost = (selected: EditorPost) => {
    setPost(selected);
    setOriginalSlug(selected.slug);
    setPreviewHtml("");
    setCommitUrl(null);
    setUploadedImageUrl(null);
    setMessage("GitHub上の記事を編集中です。");
  };

  const startNew = () => {
    setPost(emptyPost());
    setOriginalSlug(null);
    setPreviewHtml("");
    setCommitUrl(null);
    setUploadedImageUrl(null);
    setMessage("新しい記事を作成します。");
  };

  const save = async (status: CmsPostStatus) => {
    setBusy(true);
    setMessage("保存しています…");

    try {
      const payload = { ...post, status };
      const url = originalSlug
        ? `/api/admin/posts/${encodeURIComponent(originalSlug)}`
        : "/api/admin/posts";
      const response = await fetch(url, {
        method: originalSlug ? "PUT" : "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await response.json()) as {
        error?: string;
        commitUrl?: string | null;
      };
      if (!response.ok) throw new Error(data.error || "保存に失敗しました。");

      setPost(payload);
      setOriginalSlug(payload.slug);
      setCommitUrl(data.commitUrl || null);
      await loadPosts();
      setMessage(
        status === "published" ? "公開しました。" : "下書きを保存しました。",
      );
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "保存に失敗しました。",
      );
    } finally {
      setBusy(false);
    }
  };

  const preview = async () => {
    setBusy(true);
    setMessage("プレビューを生成しています…");
    try {
      const response = await fetch("/api/admin/preview", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ body: post.body }),
      });
      const data = (await response.json()) as {
        html: string;
        error?: string;
      };
      if (!response.ok)
        throw new Error(data.error || "プレビューに失敗しました。");
      setPreviewHtml(data.html);
      setMessage("プレビューを更新しました。");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "プレビューに失敗しました。",
      );
    } finally {
      setBusy(false);
    }
  };

  const archive = async () => {
    if (!originalSlug || !window.confirm("この記事を非公開にしますか？"))
      return;
    setBusy(true);
    try {
      const response = await fetch(
        `/api/admin/posts/${encodeURIComponent(originalSlug)}`,
        { method: "DELETE" },
      );
      const data = (await response.json()) as {
        error?: string;
        commitUrl?: string | null;
      };
      if (!response.ok)
        throw new Error(data.error || "非公開にできませんでした。");
      setPost((current) => ({ ...current, status: "archived" }));
      setCommitUrl(data.commitUrl || null);
      await loadPosts();
      setMessage("記事を非公開にしました。");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "非公開にできませんでした。",
      );
    } finally {
      setBusy(false);
    }
  };

  const uploadImage = async (file: File) => {
    setBusy(true);
    setMessage("画像をR2へアップロードしています…");
    try {
      const formData = new FormData();
      formData.set("file", file);
      formData.set("slug", post.slug);
      const response = await fetch("/api/admin/assets", {
        method: "POST",
        body: formData,
      });
      const data = (await response.json()) as { url?: string; error?: string };
      if (!response.ok || !data.url) {
        throw new Error(data.error || "画像をアップロードできませんでした。");
      }
      setUploadedImageUrl(data.url);
      setPost((current) => ({
        ...current,
        coverImage: current.coverImage || data.url || "",
        ogImageUrl: current.ogImageUrl || data.url || "",
      }));
      setMessage("画像をアップロードしました。カバー画像にも設定しました。");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "画像をアップロードできませんでした。",
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className={styles.workspace}>
      <aside className={styles.sidebar}>
        <button className={styles.newButton} type="button" onClick={startNew}>
          ＋ 新しい記事
        </button>
        <input
          className={styles.search}
          type="search"
          placeholder="タイトル・スラッグで検索"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <div className={styles.postList}>
          {filteredPosts.map((item) => (
            <button
              className={`${styles.postItem} ${originalSlug === item.slug ? styles.selected : ""}`}
              type="button"
              key={item.slug}
              onClick={() => selectPost(item)}
            >
              <span>{item.title || item.slug}</span>
              <small>{statusLabel(item.status)} · GitHub</small>
            </button>
          ))}
        </div>
      </aside>

      <main className={styles.editor}>
        <div className={styles.toolbar}>
          <p aria-live="polite">{message}</p>
          <div className={styles.actions}>
            <button type="button" onClick={preview} disabled={busy}>
              プレビュー
            </button>
            {originalSlug && (
              <button type="button" onClick={archive} disabled={busy}>
                非公開
              </button>
            )}
            <button type="button" onClick={() => save("draft")} disabled={busy}>
              下書き保存
            </button>
            <button
              className={styles.primaryButton}
              type="button"
              onClick={() => save("published")}
              disabled={busy}
            >
              公開
            </button>
          </div>
        </div>
        {commitUrl && (
          <a
            className={styles.commitLink}
            href={commitUrl}
            target="_blank"
            rel="noreferrer"
          >
            GitHubのコミットを確認 ↗
          </a>
        )}

        <div className={styles.formGrid}>
          <label className={styles.wideField}>
            タイトル
            <input
              value={post.title}
              onChange={(event) => update("title", event.target.value)}
            />
          </label>
          <label>
            スラッグ
            <input
              value={post.slug}
              disabled={originalSlug !== null}
              onChange={(event) =>
                update("slug", event.target.value.toLowerCase())
              }
              placeholder="my-new-post"
            />
          </label>
          <label>
            公開日時
            <input
              type="datetime-local"
              value={toDateTimeLocal(post.publishedAt)}
              onChange={(event) =>
                update(
                  "publishedAt",
                  event.target.value
                    ? new Date(event.target.value).toISOString()
                    : "",
                )
              }
            />
          </label>
          <label className={styles.wideField}>
            概要
            <textarea
              rows={2}
              value={post.description}
              onChange={(event) => update("description", event.target.value)}
            />
          </label>
          <label>
            カテゴリ
            <select
              value={post.category}
              onChange={(event) => update("category", event.target.value)}
            >
              {!MASTER_CATEGORIES.some(
                (category) => category.id === post.category,
              ) && (
                <option value={post.category}>Legacy ({post.category})</option>
              )}
              {MASTER_CATEGORIES.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
              <option value="-1">Other</option>
            </select>
          </label>
          <fieldset className={styles.tags}>
            <legend>タグ</legend>
            <div>
              {MASTER_TAGS.map((tag) => (
                <label key={tag.id}>
                  <input
                    type="checkbox"
                    checked={post.tags.includes(tag.id)}
                    onChange={(event) =>
                      update(
                        "tags",
                        event.target.checked
                          ? [...post.tags, tag.id]
                          : post.tags.filter((id) => id !== tag.id),
                      )
                    }
                  />
                  {tag.name}
                </label>
              ))}
              {post.tags
                .filter((tagId) => !MASTER_TAGS.some((tag) => tag.id === tagId))
                .map((tagId) => (
                  <label key={tagId}>
                    <input
                      type="checkbox"
                      checked
                      onChange={(event) => {
                        if (!event.target.checked) {
                          update(
                            "tags",
                            post.tags.filter((id) => id !== tagId),
                          );
                        }
                      }}
                    />
                    Legacy ({tagId})
                  </label>
                ))}
            </div>
          </fieldset>
          <label>
            カバー画像URL
            <input
              value={post.coverImage}
              onChange={(event) => update("coverImage", event.target.value)}
              placeholder="/post/slug/thumbnail.jpeg"
            />
          </label>
          <label>
            OGP画像URL（省略時はカバー画像）
            <input
              value={post.ogImageUrl}
              onChange={(event) => update("ogImageUrl", event.target.value)}
            />
          </label>
          <div className={styles.uploadField}>
            <span>画像アップロード（R2・10MBまで）</span>
            <input
              type="file"
              accept="image/avif,image/gif,image/jpeg,image/png,image/webp"
              disabled={busy || !post.slug}
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) void uploadImage(file);
                event.target.value = "";
              }}
            />
            {uploadedImageUrl && (
              <div className={styles.uploadResult}>
                <code>{uploadedImageUrl}</code>
                <button
                  type="button"
                  onClick={() =>
                    update(
                      "body",
                      `${post.body}${post.body.endsWith("\n") ? "" : "\n"}\n![画像](${uploadedImageUrl})\n`,
                    )
                  }
                >
                  本文へ挿入
                </button>
              </div>
            )}
          </div>
          <label className={styles.wideField}>
            Markdown本文
            <textarea
              className={styles.bodyEditor}
              value={post.body}
              onChange={(event) => update("body", event.target.value)}
              spellCheck={false}
              placeholder="## 見出し"
            />
          </label>
        </div>

        {previewHtml && (
          <section className={styles.preview}>
            <p className={styles.eyebrow}>PREVIEW</p>
            <h2>{post.title || "無題の記事"}</h2>
            <div
              className="znc"
              // biome-ignore lint/security/noDangerouslySetInnerHtml: trusted admin-authored Markdown preview
              dangerouslySetInnerHTML={{ __html: previewHtml }}
            />
          </section>
        )}
      </main>
    </div>
  );
}
