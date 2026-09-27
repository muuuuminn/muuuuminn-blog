import { EyeOpenIcon } from "@radix-ui/react-icons";
import styles from "../admin.module.css";
import type { BusyAction, EditorPost } from "../editorTypes";
import { PostStatusBadge } from "./PostStatusBadge";

type EditorHeaderProps = {
  post: EditorPost;
  isDirty: boolean;
  isBusy: boolean;
  busyAction: BusyAction | null;
  isExistingPost: boolean;
  onPreview: () => void;
  onArchive: () => void;
  onSaveDraft: () => void;
  onPublish: () => void;
};

export function EditorHeader({
  post,
  isDirty,
  isBusy,
  busyAction,
  isExistingPost,
  onPreview,
  onArchive,
  onSaveDraft,
  onPublish,
}: EditorHeaderProps) {
  return (
    <div className={styles.editorHeader}>
      <div className={styles.editorTitle}>
        <PostStatusBadge status={post.status} />
        <h2>{post.title || "無題の記事"}</h2>
        <span className={isDirty ? styles.unsaved : styles.saved}>
          {isDirty ? "未保存の変更" : "保存済み"}
        </span>
      </div>
      <div className={styles.actions}>
        <button type="button" onClick={onPreview} disabled={isBusy}>
          <EyeOpenIcon aria-hidden="true" />
          {busyAction === "preview" ? "生成中…" : "プレビュー"}
        </button>
        {isExistingPost && post.status !== "archived" && (
          <button
            className={styles.dangerButton}
            type="button"
            onClick={onArchive}
            disabled={isBusy}
          >
            {busyAction === "archive" ? "処理中…" : "非公開"}
          </button>
        )}
        <button
          type="button"
          onClick={onSaveDraft}
          disabled={isBusy || !isDirty}
          title="⌘ / Ctrl + S"
        >
          {busyAction === "save" ? "保存中…" : "下書き保存"}
        </button>
        <button
          className={styles.primaryButton}
          type="button"
          onClick={onPublish}
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
  );
}
