"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { CmsPostStatus } from "@/libs/cms/types";
import styles from "./admin.module.css";
import { EditorHeader } from "./components/EditorHeader";
import { EditorNotice } from "./components/EditorNotice";
import { PostForm } from "./components/PostForm";
import { PostPreview } from "./components/PostPreview";
import { PostSidebar } from "./components/PostSidebar";
import {
  archivePost,
  fetchPost,
  fetchPosts,
  renderPostPreview,
  savePost,
  uploadPostImage,
} from "./editorApi";
import {
  confirmArchive,
  confirmDiscardChanges,
  copyToClipboard,
  focusFirstInvalidField,
} from "./editorBrowser";
import type {
  BusyAction,
  EditorPost,
  EditorPostSummary,
  NoticeTone,
} from "./editorTypes";
import {
  appendMarkdownImage,
  createEmptyPost,
  filterPosts,
  isWithinUploadLimit,
  toErrorMessage,
  validatePost,
  withPostStatus,
} from "./editorUtils";
import {
  useSaveShortcut,
  useUnsavedChangesWarning,
} from "./useEditorBrowserEvents";
import { useEditorDocument } from "./useEditorDocument";

export function CmsEditor() {
  const initialPost = useMemo(
    () => createEmptyPost(new Date().toISOString()),
    [],
  );
  const [posts, setPosts] = useState<EditorPostSummary[]>([]);
  const [query, setQuery] = useState("");
  const [notice, setNotice] = useState({
    message: "記事を読み込んでいます…",
    tone: "neutral" as NoticeTone,
  });
  const [busyAction, setBusyAction] = useState<BusyAction | null>(null);
  const [previewHtml, setPreviewHtml] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const {
    post,
    originalSlug,
    commitUrl,
    uploadedImageUrl,
    fieldErrors,
    isDirty,
    updatePost,
    resetDocument,
    setFieldErrors,
    setFieldError,
    markSaved,
    applyImageUpload,
  } = useEditorDocument(initialPost);

  const isBusy = busyAction !== null;
  const filteredPosts = useMemo(
    () => filterPosts(posts, query),
    [posts, query],
  );

  const setMessage = useCallback(
    (message: string, tone: NoticeTone = "neutral") => {
      setNotice({ message, tone });
    },
    [],
  );

  const loadPosts = useCallback(async () => {
    const loadedPosts = await fetchPosts();
    setPosts(loadedPosts);
    setNotice({
      message: `${loadedPosts.length}件の記事を読み込みました。`,
      tone: "neutral",
    });
  }, []);

  useEffect(() => {
    loadPosts().catch((error: unknown) =>
      setMessage(
        toErrorMessage(error, "記事を読み込めませんでした。"),
        "error",
      ),
    );
  }, [loadPosts, setMessage]);

  useUnsavedChangesWarning(isDirty);

  const updatePostSummary = useCallback((updatedPost: EditorPost) => {
    const summary: EditorPostSummary = {
      slug: updatedPost.slug,
      title: updatedPost.title,
      status: updatedPost.status,
      updatedAt: new Date().toISOString(),
    };
    setPosts((current) => [
      summary,
      ...current.filter((item) => item.slug !== summary.slug),
    ]);
  }, []);

  const selectPost = async (selected: EditorPostSummary) => {
    if (selected.slug === originalSlug) return;
    if (!confirmDiscardChanges(isDirty)) return;

    setBusyAction("load");
    setMessage(`「${selected.title || selected.slug}」を読み込んでいます…`);
    try {
      const loadedPost = await fetchPost(selected.slug);
      resetDocument(loadedPost, loadedPost.slug);
      setPreviewHtml("");
      setShowPreview(false);
      setMessage(`「${loadedPost.title || loadedPost.slug}」を編集中です。`);
    } catch (error) {
      setMessage(
        toErrorMessage(error, "記事を読み込めませんでした。"),
        "error",
      );
    } finally {
      setBusyAction(null);
    }
  };

  const startNew = () => {
    if (!confirmDiscardChanges(isDirty)) return;
    resetDocument(createEmptyPost(new Date().toISOString()), null);
    setPreviewHtml("");
    setShowPreview(false);
    setMessage("新しい記事を作成します。");
  };

  const save = useCallback(
    async (status: CmsPostStatus) => {
      const errors = validatePost(post, status);
      setFieldErrors(errors);
      if (Object.keys(errors).length > 0) {
        setMessage("入力内容を確認してください。", "error");
        focusFirstInvalidField();
        return;
      }

      setBusyAction(status === "published" ? "publish" : "save");
      setMessage(
        status === "published" ? "公開しています…" : "保存しています…",
      );
      try {
        const saved = await savePost(post, status, originalSlug);
        markSaved(saved.post, saved.commitUrl);
        updatePostSummary(saved.post);
        setMessage(
          status === "published"
            ? "記事を公開しました。"
            : "下書きを保存しました。",
          "success",
        );
      } catch (error) {
        setMessage(toErrorMessage(error, "保存に失敗しました。"), "error");
      } finally {
        setBusyAction(null);
      }
    },
    [
      markSaved,
      originalSlug,
      post,
      setFieldErrors,
      setMessage,
      updatePostSummary,
    ],
  );

  const saveDraft = useCallback(() => {
    void save("draft");
  }, [save]);

  useSaveShortcut(saveDraft, isBusy);

  const preview = async () => {
    if (!post.body.trim()) {
      setFieldError("body", "プレビューする本文を入力してください。");
      setMessage("本文を入力するとプレビューできます。", "error");
      return;
    }
    setBusyAction("preview");
    setMessage("プレビューを生成しています…");
    try {
      setPreviewHtml(await renderPostPreview(post.body));
      setShowPreview(true);
      setMessage("プレビューを更新しました。", "success");
    } catch (error) {
      setMessage(toErrorMessage(error, "プレビューに失敗しました。"), "error");
    } finally {
      setBusyAction(null);
    }
  };

  const archive = async () => {
    if (!originalSlug || !confirmArchive()) return;
    setBusyAction("archive");
    setMessage("非公開にしています…");
    try {
      const nextCommitUrl = await archivePost(originalSlug);
      const archivedPost = withPostStatus(post, "archived");
      markSaved(archivedPost, nextCommitUrl);
      updatePostSummary(archivedPost);
      setMessage("記事を非公開にしました。", "success");
    } catch (error) {
      setMessage(toErrorMessage(error, "非公開にできませんでした。"), "error");
    } finally {
      setBusyAction(null);
    }
  };

  const uploadImage = async (file: File) => {
    if (!isWithinUploadLimit(file.size)) {
      setMessage("画像は10MB以下にしてください。", "error");
      return;
    }
    setBusyAction("upload");
    setMessage("画像をアップロードしています…");
    try {
      applyImageUpload(await uploadPostImage(file, post.slug));
      setMessage("画像をアップロードし、カバー画像に設定しました。", "success");
    } catch (error) {
      setMessage(
        toErrorMessage(error, "画像をアップロードできませんでした。"),
        "error",
      );
    } finally {
      setBusyAction(null);
    }
  };

  const insertUploadedImage = () => {
    if (!uploadedImageUrl) return;
    updatePost("body", appendMarkdownImage(post.body, uploadedImageUrl));
    setMessage("本文の末尾に画像を挿入しました。", "success");
  };

  const copyUploadedUrl = async () => {
    if (!uploadedImageUrl) return;
    await copyToClipboard(uploadedImageUrl);
    setMessage("画像URLをコピーしました。", "success");
  };

  return (
    <div className={styles.workspace}>
      <PostSidebar
        posts={filteredPosts}
        totalCount={posts.length}
        selectedSlug={originalSlug}
        isBusy={isBusy}
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
          onSaveDraft={saveDraft}
          onPublish={() => void save("published")}
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
