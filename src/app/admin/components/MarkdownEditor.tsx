import styles from "../admin.module.css";
import { FieldError } from "./FieldError";

type MarkdownEditorProps = {
  body: string;
  error?: string;
  onChange: (body: string) => void;
};

export function MarkdownEditor({ body, error, onChange }: MarkdownEditorProps) {
  return (
    <label className={`${styles.field} ${styles.wideField}`} htmlFor="cms-body">
      <span className={styles.fieldLabel}>
        Markdown本文 <b>必須</b>
      </span>
      <textarea
        id="cms-body"
        className={styles.bodyEditor}
        value={body}
        onChange={(event) => onChange(event.target.value)}
        spellCheck={false}
        placeholder={"## 見出し\n\n本文を書き始める"}
        aria-invalid={Boolean(error)}
      />
      <span className={styles.fieldFooter}>
        <FieldError message={error} />
        <span>{body.length.toLocaleString()}文字</span>
      </span>
    </label>
  );
}
