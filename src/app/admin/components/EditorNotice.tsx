import { CheckCircledIcon } from "@radix-ui/react-icons";
import styles from "../admin.module.css";
import type { NoticeTone } from "../editorTypes";

type EditorNoticeProps = {
  message: string;
  tone: NoticeTone;
  commitUrl: string | null;
};

export function EditorNotice({ message, tone, commitUrl }: EditorNoticeProps) {
  return (
    <div
      className={`${styles.notice} ${styles[tone]}`}
      role={tone === "error" ? "alert" : "status"}
      aria-live="polite"
    >
      {tone === "success" && <CheckCircledIcon aria-hidden="true" />}
      <span>{message}</span>
      {commitUrl && (
        <a href={commitUrl} target="_blank" rel="noreferrer">
          コミットを見る ↗
        </a>
      )}
    </div>
  );
}
