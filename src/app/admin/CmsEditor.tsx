"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { CmsPostInput, CmsPostStatus } from "@/libs/cms/types";
import styles from "./admin.module.css";
import { EditorHeader } from "./components/EditorHeader";
import { EditorNotice } from "./components/EditorNotice";
import { PostForm } from "./components/PostForm";
import { PostPreview } from "./components/PostPreview";
import { PostSidebar } from "./components/PostSidebar";
import type {
  BusyAction,
  EditorPost,
  FieldErrors,
  NoticeTone,
} from "./editorTypes";
import {
  createEmptyPost,
  createPostSnapshot,
  validatePost,
} from "./editorUtils";

export function CmsEditor() {
  const initialPost = useMemo(createEmptyPost, []);
  const [posts, setPosts] = useState<EditorPost[]>([]);
  const [post, setPost] = useState<EditorPost>(initialPost);
  const [lastSavedSnapshot, setLastSavedSnapshot] = useState(
    createPostSnapshot(initialPost),
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

  const isBusy = busyAction !== null;
  const isDirty = createPostSnapshot(post) !== lastSavedSnapshot;

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
    if (!response.ok) {
      throw new Error(data.error || "記事を読み込めませんでした。");
    }
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

  const updatePost = <K extends keyof EditorPost>(
    key: K,
    value: EditorPost[K],
  ) => {
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

  const resetEditorState = (nextPost: EditorPost, slug: string | null) => {
    setPost(nextPost);
    setLastSavedSnapshot(createPostSnapshot(nextPost));
    setOriginalSlug(slug);
    setPreviewHtml("");
    setShowPreview(false);
    setCommitUrl(null);
    setUploadedImageUrl(null);
    setFieldErrors({});
  };

  const selectPost = (selected: EditorPost) => {
    if (selected.slug === originalSlug || !canDiscardChanges()) return;
    resetEditorState(selected, selected.slug);
    setMessage(`「${selected.title || selected.slug}」を編集中です。`);
  };

  const startNew = () => {
    if (!canDiscardChanges()) return;
    resetEditorState(createEmptyPost(), null);
    setMessage("新しい記事を作成します。");
  };

  const save = useCallback(
    async (status: CmsPostStatus) => {
      const errors = validatePost(post, status);
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
        if (!response.ok) {
          throw new Error(data.error || "保存に失敗しました。");
        }

        setPost(payload);
        setLastSavedSnapshot(createPostSnapshot(payload));
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
      if (!response.ok) {
        throw new Error(data.error || "プレビューに失敗しました。");
      }
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
    if (!originalSlug || !window.confirm("この記事を非公開にしますか？")) {
      return;
    }
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
      if (!response.ok) {
        throw new Error(data.error || "非公開にできませんでした。");
      }
      const archivedPost = { ...post, status: "archived" as const };
      setPost(archivedPost);
      setLastSavedSnapshot(createPostSnapshot(archivedPost));
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
      if (!response.ok || !data.url) {
        throw new Error(data.error || "画像をアップロードできませんでした。");
      }
      setUploadedImageUrl(data.url);
      setPost((current) => ({
        ...current,
        coverImage: current.coverImage || data.url || "",
        ogImageUrl: current.ogImageUrl || data.url || "",
      }));
      setFieldErrors((current) => ({ ...current, coverImage: undefined }));
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

  const insertUploadedImage = () => {
    if (!uploadedImageUrl) return;
    updatePost(
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
      <PostSidebar
        posts={filteredPosts}
        totalCount={posts.length}
        selectedSlug={originalSlug}
        query={query}
        onQueryChange={setQuery}
        onSelect={selectPost}
        onCreate={startNew}
      />

      <main className={styles.editor}>
        <EditorHeader
          post={post}
          isDirty={isDirty}
          isBusy={isBusy}
          busyAction={busyAction}
          isExistingPost={originalSlug !== null}
          onPreview={preview}
          onArchive={archive}
          onSaveDraft={() => save("draft")}
          onPublish={() => save("published")}
        />
        <EditorNotice
          message={notice.message}
          tone={notice.tone}
          commitUrl={commitUrl}
        />
        <PostForm
          post={post}
          errors={fieldErrors}
          isExistingPost={originalSlug !== null}
          isBusy={isBusy}
          busyAction={busyAction}
          uploadedImageUrl={uploadedImageUrl}
          onUpdate={updatePost}
          onUploadImage={(file) => void uploadImage(file)}
          onCopyImageUrl={() => void copyUploadedUrl()}
          onInsertImage={insertUploadedImage}
        />
        {showPreview && (
          <PostPreview
            title={post.title}
            html={previewHtml}
            onClose={() => setShowPreview(false)}
          />
        )}
      </main>
    </div>
  );
}
