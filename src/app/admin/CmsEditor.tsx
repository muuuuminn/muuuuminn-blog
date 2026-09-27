"use client";

import {
  CheckCircledIcon,
  CopyIcon,
  Cross2Icon,
  EyeOpenIcon,
  MagnifyingGlassIcon,
  Pencil2Icon,
  PlusIcon,
  UploadIcon,
} from "@radix-ui/react-icons";
import {
  type ChangeEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
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

type BusyAction = "save" | "publish" | "preview" | "archive" | "upload";
type FieldErrors = Partial<Record<keyof CmsPostInput, string>>;
type NoticeTone = "neutral" | "success" | "error";

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

function snapshot(post: EditorPost): string {
  return JSON.stringify(editablePost(post));
}

function toDateTimeLocal(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const offset = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

function statusLabel(status: CmsPostStatus): string {
  return { draft: "下書き", published: "公開中", archived: "非公開" }[status];
}

function formatUpdatedAt(value?: string): string {
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

function slugify(value: string): string {
  return value
    .normalize("NFKD")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

function validate(post: EditorPost, status: CmsPostStatus): FieldErrors {
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

export function CmsEditor() {
  const initialPost = useMemo(emptyPost, []);
  const [posts, setPosts] = useState<EditorPost[]>([]);
  const [post, setPost] = useState<EditorPost>(initialPost);
  const [lastSavedSnapshot, setLastSavedSnapshot] = useState(
    snapshot(initialPost),
  );
  const [originalSlug, setOriginalSlug] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [notice, setNotice] = useState({
    message: "記事を読み込んでいます…",
    tone: "neutral" as NoticeTone,
  });
  const [busyAction, setBusyAction] = useState<BusyAction | null>(null);
  const [previewHtml, setPreviewHtml] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [commitUrl, setCommitUrl] = useState<string | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [tagQuery, setTagQuery] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isBusy = busyAction !== null;
  const isDirty = snapshot(post) !== lastSavedSnapshot;

  const setMessage = useCallback(
    (message: string, tone: NoticeTone = "neutral") => {
      setNotice({ message, tone });
    },
    [],
  );

  const loadPosts = useCallback(async () => {
    const response = await fetch("/api/admin/posts", { cache: "no-store" });
    const data = (await response.json()) as {
      posts: EditorPost[];
      error?: string;
    };
    if (!response.ok)
      throw new Error(data.error || "記事を読み込めませんでした。");
    setPosts(data.posts);
    setNotice({
      message: `${data.posts.length}件の記事を読み込みました。`,
      tone: "neutral",
    });
  }, []);

  useEffect(() => {
    loadPosts().catch((error: Error) => setMessage(error.message, "error"));
  }, [loadPosts, setMessage]);

  useEffect(() => {
    const warnBeforeLeave = (event: BeforeUnloadEvent) => {
      if (!isDirty) return;
      event.preventDefault();
    };
    window.addEventListener("beforeunload", warnBeforeLeave);
    return () => window.removeEventListener("beforeunload", warnBeforeLeave);
  }, [isDirty]);

  const filteredPosts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return posts;
    return posts.filter(
      (item) =>
        item.title.toLowerCase().includes(normalizedQuery) ||
        item.slug.toLowerCase().includes(normalizedQuery),
    );
  }, [posts, query]);

  const filteredTags = useMemo(() => {
    const normalizedQuery = tagQuery.trim().toLowerCase();
    if (!normalizedQuery) return MASTER_TAGS;
    return MASTER_TAGS.filter(
      (tag) =>
        tag.name.toLowerCase().includes(normalizedQuery) ||
        tag.id.toLowerCase().includes(normalizedQuery),
    );
  }, [tagQuery]);

  const update = <K extends keyof EditorPost>(key: K, value: EditorPost[K]) => {
    setPost((current) => ({ ...current, [key]: value }));
    setFieldErrors((current) => {
      if (!current[key as keyof CmsPostInput]) return current;
      const next = { ...current };
      delete next[key as keyof CmsPostInput];
      return next;
    });
    setCommitUrl(null);
  };

  const canDiscardChanges = () =>
    !isDirty ||
    window.confirm("未保存の変更があります。破棄して移動しますか？");

  const selectPost = (selected: EditorPost) => {
    if (selected.slug === originalSlug || !canDiscardChanges()) return;
    setPost(selected);
    setLastSavedSnapshot(snapshot(selected));
    setOriginalSlug(selected.slug);
    setPreviewHtml("");
    setShowPreview(false);
    setCommitUrl(null);
    setUploadedImageUrl(null);
    setFieldErrors({});
    setMessage(`「${selected.title || selected.slug}」を編集中です。`);
  };

  const startNew = () => {
    if (!canDiscardChanges()) return;
    const nextPost = emptyPost();
    setPost(nextPost);
    setLastSavedSnapshot(snapshot(nextPost));
    setOriginalSlug(null);
    setPreviewHtml("");
    setShowPreview(false);
    setCommitUrl(null);
    setUploadedImageUrl(null);
    setFieldErrors({});
    setMessage("新しい記事を作成します。");
  };

  const save = useCallback(
    async (status: CmsPostStatus) => {
      const errors = validate(post, status);
      setFieldErrors(errors);
      if (Object.keys(errors).length > 0) {
        setMessage("入力内容を確認してください。", "error");
        requestAnimationFrame(() => {
          document.querySelector<HTMLElement>("[aria-invalid='true']")?.focus();
        });
        return;
      }

      setBusyAction(status === "published" ? "publish" : "save");
      setMessage(
        status === "published" ? "公開しています…" : "保存しています…",
      );

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
        setLastSavedSnapshot(snapshot(payload));
        setOriginalSlug(payload.slug);
        setCommitUrl(data.commitUrl || null);
        await loadPosts();
        setMessage(
          status === "published"
            ? "記事を公開しました。"
            : "下書きを保存しました。",
          "success",
        );
      } catch (error) {
        setMessage(
          error instanceof Error ? error.message : "保存に失敗しました。",
          "error",
        );
      } finally {
        setBusyAction(null);
      }
    },
    [loadPosts, originalSlug, post, setMessage],
  );

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      if (!(event.metaKey || event.ctrlKey)) return;
      if (event.key.toLowerCase() === "s") {
        event.preventDefault();
        if (!isBusy) void save("draft");
      }
    };
    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, [isBusy, save]);

  const preview = async () => {
    if (!post.body.trim()) {
      setFieldErrors((current) => ({
        ...current,
        body: "プレビューする本文を入力してください。",
      }));
      setMessage("本文を入力するとプレビューできます。", "error");
      return;
    }
    setBusyAction("preview");
    setMessage("プレビューを生成しています…");
    try {
      const response = await fetch("/api/admin/preview", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ body: post.body }),
      });
      const data = (await response.json()) as { html: string; error?: string };
      if (!response.ok)
        throw new Error(data.error || "プレビューに失敗しました。");
      setPreviewHtml(data.html);
      setShowPreview(true);
      setMessage("プレビューを更新しました。", "success");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "プレビューに失敗しました。",
        "error",
      );
    } finally {
      setBusyAction(null);
    }
  };

  const archive = async () => {
    if (!originalSlug || !window.confirm("この記事を非公開にしますか？"))
      return;
    setBusyAction("archive");
    setMessage("非公開にしています…");
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
      const archivedPost = { ...post, status: "archived" as const };
      setPost(archivedPost);
      setLastSavedSnapshot(snapshot(archivedPost));
      setCommitUrl(data.commitUrl || null);
      await loadPosts();
      setMessage("記事を非公開にしました。", "success");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "非公開にできませんでした。",
        "error",
      );
    } finally {
      setBusyAction(null);
    }
  };

  const uploadImage = async (file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      setMessage("画像は10MB以下にしてください。", "error");
      return;
    }
    setBusyAction("upload");
    setMessage("画像をアップロードしています…");
    try {
      const formData = new FormData();
      formData.set("file", file);
      formData.set("slug", post.slug);
      const response = await fetch("/api/admin/assets", {
        method: "POST",
        body: formData,
      });
      const data = (await response.json()) as { url?: string; error?: string };
      if (!response.ok || !data.url)
        throw new Error(data.error || "画像をアップロードできませんでした。");
      setUploadedImageUrl(data.url);
      setPost((current) => ({
        ...current,
        coverImage: current.coverImage || data.url || "",
        ogImageUrl: current.ogImageUrl || data.url || "",
      }));
      setMessage("画像をアップロードし、カバー画像に設定しました。", "success");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "画像をアップロードできませんでした。",
        "error",
      );
    } finally {
      setBusyAction(null);
    }
  };

  const onFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) void uploadImage(file);
    event.target.value = "";
  };

  const insertUploadedImage = () => {
    if (!uploadedImageUrl) return;
    update(
      "body",
      `${post.body}${post.body.endsWith("\n") || !post.body ? "" : "\n"}\n![画像の説明](${uploadedImageUrl})\n`,
    );
    setMessage("本文の末尾に画像を挿入しました。", "success");
  };

  const copyUploadedUrl = async () => {
    if (!uploadedImageUrl) return;
    await navigator.clipboard.writeText(uploadedImageUrl);
    setMessage("画像URLをコピーしました。", "success");
  };

  return (
    <div className={styles.workspace}>
      <aside className={styles.sidebar}>
        <button className={styles.newButton} type="button" onClick={startNew}>
          <PlusIcon aria-hidden="true" /> 新しい記事
        </button>
        <label className={styles.searchBox}>
          <MagnifyingGlassIcon aria-hidden="true" />
          <span className={styles.srOnly}>記事を検索</span>
          <input
            type="search"
            placeholder="タイトル・スラッグで検索"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="検索をクリア"
            >
              <Cross2Icon aria-hidden="true" />
            </button>
          )}
        </label>
        <div className={styles.listMeta}>
          <span>記事一覧</span>
          <span>
            {filteredPosts.length} / {posts.length}
          </span>
        </div>
        <div className={styles.postList}>
          {filteredPosts.map((item) => (
            <button
              className={`${styles.postItem} ${originalSlug === item.slug ? styles.selected : ""}`}
              type="button"
              key={item.slug}
              onClick={() => selectPost(item)}
              aria-current={originalSlug === item.slug ? "page" : undefined}
            >
              <span>{item.title || item.slug}</span>
              <small>
                <span
                  className={`${styles.statusBadge} ${styles[item.status]}`}
                >
                  {statusLabel(item.status)}
                </span>
                {formatUpdatedAt(item.updatedAt)}
              </small>
            </button>
          ))}
          {filteredPosts.length === 0 && (
            <div className={styles.emptyList}>
              <p>記事が見つかりません</p>
              <button type="button" onClick={() => setQuery("")}>
                検索をクリア
              </button>
            </div>
          )}
        </div>
      </aside>

      <main className={styles.editor}>
        <div className={styles.editorHeader}>
          <div className={styles.editorTitle}>
            <span className={`${styles.statusBadge} ${styles[post.status]}`}>
              {statusLabel(post.status)}
            </span>
            <h2>{post.title || "無題の記事"}</h2>
            <span className={isDirty ? styles.unsaved : styles.saved}>
              {isDirty ? "未保存の変更" : "保存済み"}
            </span>
          </div>
          <div className={styles.actions}>
            <button type="button" onClick={preview} disabled={isBusy}>
              <EyeOpenIcon aria-hidden="true" />
              {busyAction === "preview" ? "生成中…" : "プレビュー"}
            </button>
            {originalSlug && post.status !== "archived" && (
              <button
                className={styles.dangerButton}
                type="button"
                onClick={archive}
                disabled={isBusy}
              >
                {busyAction === "archive" ? "処理中…" : "非公開"}
              </button>
            )}
            <button
              type="button"
              onClick={() => save("draft")}
              disabled={isBusy || !isDirty}
              title="⌘ / Ctrl + S"
            >
              {busyAction === "save" ? "保存中…" : "下書き保存"}
            </button>
            <button
              className={styles.primaryButton}
              type="button"
              onClick={() => save("published")}
              disabled={isBusy}
            >
              {busyAction === "publish"
                ? "公開中…"
                : post.status === "published"
                  ? "更新を公開"
                  : "公開"}
            </button>
          </div>
        </div>

        <div
          className={`${styles.notice} ${styles[notice.tone]}`}
          role={notice.tone === "error" ? "alert" : "status"}
          aria-live="polite"
        >
          {notice.tone === "success" && <CheckCircledIcon aria-hidden="true" />}
          <span>{notice.message}</span>
          {commitUrl && (
            <a href={commitUrl} target="_blank" rel="noreferrer">
              コミットを見る ↗
            </a>
          )}
        </div>

        <div className={styles.formGrid}>
          <label
            className={`${styles.field} ${styles.wideField}`}
            htmlFor="cms-title"
          >
            <span className={styles.fieldLabel}>
              タイトル <b>必須</b>
            </span>
            <input
              id="cms-title"
              value={post.title}
              onChange={(event) => update("title", event.target.value)}
              aria-invalid={Boolean(fieldErrors.title)}
              aria-describedby={
                fieldErrors.title ? "cms-title-error" : undefined
              }
              placeholder="記事の内容がひと目で伝わるタイトル"
            />
            <span className={styles.fieldFooter}>
              <span id="cms-title-error" className={styles.fieldError}>
                {fieldErrors.title}
              </span>
              <span>{post.title.length}文字</span>
            </span>
          </label>

          <div className={styles.field}>
            <label className={styles.fieldLabel} htmlFor="cms-slug">
              スラッグ <b>必須</b>
            </label>
            <div className={styles.inlineInput}>
              <input
                id="cms-slug"
                value={post.slug}
                disabled={originalSlug !== null}
                onChange={(event) =>
                  update(
                    "slug",
                    event.target.value.toLowerCase().replace(/\s+/g, "-"),
                  )
                }
                placeholder="my-new-post"
                aria-invalid={Boolean(fieldErrors.slug)}
                aria-describedby={
                  fieldErrors.slug ? "cms-slug-error" : "cms-slug-hint"
                }
              />
              {!originalSlug && slugify(post.title) && !post.slug && (
                <button
                  type="button"
                  onClick={() => update("slug", slugify(post.title))}
                >
                  タイトルから生成
                </button>
              )}
            </div>
            <span
              id={fieldErrors.slug ? "cms-slug-error" : "cms-slug-hint"}
              className={fieldErrors.slug ? styles.fieldError : styles.hint}
            >
              {fieldErrors.slug ||
                (originalSlug
                  ? "公開URLのため変更できません。"
                  : "半角英小文字・数字・ハイフン")}
            </span>
          </div>

          <label className={styles.field} htmlFor="cms-date">
            <span className={styles.fieldLabel}>
              公開日時 <b>必須</b>
            </span>
            <input
              id="cms-date"
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
              aria-invalid={Boolean(fieldErrors.publishedAt)}
            />
            {fieldErrors.publishedAt && (
              <span className={styles.fieldError}>
                {fieldErrors.publishedAt}
              </span>
            )}
          </label>

          <label
            className={`${styles.field} ${styles.wideField}`}
            htmlFor="cms-description"
          >
            <span className={styles.fieldLabel}>
              概要 <b>必須</b>
            </span>
            <textarea
              id="cms-description"
              rows={3}
              value={post.description}
              onChange={(event) => update("description", event.target.value)}
              aria-invalid={Boolean(fieldErrors.description)}
              placeholder="検索結果やSNSで表示される、記事の短い説明"
            />
            <span className={styles.fieldFooter}>
              <span className={styles.fieldError}>
                {fieldErrors.description}
              </span>
              <span
                className={
                  post.description.length > 160
                    ? styles.countWarning
                    : undefined
                }
              >
                {post.description.length} / 160文字
              </span>
            </span>
          </label>

          <label className={styles.field} htmlFor="cms-category">
            <span className={styles.fieldLabel}>
              カテゴリ <b>必須</b>
            </span>
            <select
              id="cms-category"
              value={post.category}
              onChange={(event) => update("category", event.target.value)}
              aria-invalid={Boolean(fieldErrors.category)}
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
            {fieldErrors.category && (
              <span className={styles.fieldError}>{fieldErrors.category}</span>
            )}
          </label>

          <fieldset className={`${styles.tags} ${styles.wideField}`}>
            <legend>
              タグ <span>{post.tags.length}件選択</span>
            </legend>
            <label className={styles.tagSearch}>
              <MagnifyingGlassIcon aria-hidden="true" />
              <span className={styles.srOnly}>タグを検索</span>
              <input
                value={tagQuery}
                onChange={(event) => setTagQuery(event.target.value)}
                placeholder="タグを絞り込む"
              />
            </label>
            <div className={styles.tagOptions}>
              {filteredTags.map((tag) => {
                const checked = post.tags.includes(tag.id);
                return (
                  <label
                    key={tag.id}
                    className={checked ? styles.tagSelected : undefined}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
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
                );
              })}
              {post.tags
                .filter((tagId) => !MASTER_TAGS.some((tag) => tag.id === tagId))
                .map((tagId) => (
                  <label key={tagId} className={styles.tagSelected}>
                    <input
                      type="checkbox"
                      checked
                      onChange={() =>
                        update(
                          "tags",
                          post.tags.filter((id) => id !== tagId),
                        )
                      }
                    />
                    Legacy ({tagId})
                  </label>
                ))}
            </div>
          </fieldset>

          <label className={styles.field} htmlFor="cms-cover">
            <span className={styles.fieldLabel}>
              カバー画像URL <span>公開時は必須</span>
            </span>
            <input
              id="cms-cover"
              value={post.coverImage}
              onChange={(event) => update("coverImage", event.target.value)}
              placeholder="https://… または /post/…"
              aria-invalid={Boolean(fieldErrors.coverImage)}
            />
            {fieldErrors.coverImage && (
              <span className={styles.fieldError}>
                {fieldErrors.coverImage}
              </span>
            )}
          </label>

          <label className={styles.field} htmlFor="cms-og">
            <span className={styles.fieldLabel}>
              OGP画像URL <span>任意</span>
            </span>
            <input
              id="cms-og"
              value={post.ogImageUrl}
              onChange={(event) => update("ogImageUrl", event.target.value)}
              placeholder="空欄ならカバー画像を使用"
            />
          </label>

          <div className={`${styles.uploadField} ${styles.wideField}`}>
            <div>
              <UploadIcon aria-hidden="true" />
              <span>
                <strong>
                  {busyAction === "upload"
                    ? "アップロード中…"
                    : "画像をアップロード"}
                </strong>
                <small>JPEG・PNG・WebP・GIF・AVIF / 10MBまで</small>
              </span>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/avif,image/gif,image/jpeg,image/png,image/webp"
              disabled={isBusy || !post.slug}
              onChange={onFileChange}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isBusy || !post.slug}
            >
              ファイルを選択
            </button>
            {!post.slug && (
              <span className={styles.hint}>
                先にスラッグを入力してください。
              </span>
            )}
            {uploadedImageUrl && (
              <div className={styles.uploadResult}>
                <code>{uploadedImageUrl}</code>
                <button type="button" onClick={copyUploadedUrl}>
                  <CopyIcon aria-hidden="true" /> URLをコピー
                </button>
                <button type="button" onClick={insertUploadedImage}>
                  <Pencil2Icon aria-hidden="true" /> 本文へ挿入
                </button>
              </div>
            )}
          </div>

          <label
            className={`${styles.field} ${styles.wideField}`}
            htmlFor="cms-body"
          >
            <span className={styles.fieldLabel}>
              Markdown本文 <b>必須</b>
            </span>
            <textarea
              id="cms-body"
              className={styles.bodyEditor}
              value={post.body}
              onChange={(event) => update("body", event.target.value)}
              spellCheck={false}
              placeholder={"## 見出し\n\n本文を書き始める"}
              aria-invalid={Boolean(fieldErrors.body)}
            />
            <span className={styles.fieldFooter}>
              <span className={styles.fieldError}>{fieldErrors.body}</span>
              <span>{post.body.length.toLocaleString()}文字</span>
            </span>
          </label>
        </div>

        {showPreview && (
          <section className={styles.preview} aria-label="記事プレビュー">
            <div className={styles.previewHeader}>
              <div>
                <p className={styles.eyebrow}>PREVIEW</p>
                <h2>{post.title || "無題の記事"}</h2>
              </div>
              <button type="button" onClick={() => setShowPreview(false)}>
                <Cross2Icon aria-hidden="true" /> 閉じる
              </button>
            </div>
            <div
              className="znc"
              // biome-ignore lint/security/noDangerouslySetInnerHtml: authenticated author preview generated by the server renderer
              dangerouslySetInnerHTML={{ __html: previewHtml }}
            />
          </section>
        )}
      </main>
    </div>
  );
}
