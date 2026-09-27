import styles from "../admin.module.css";

export function FieldError({ message, id }: { message?: string; id?: string }) {
  if (!message) return null;
  return (
    <span id={id} className={styles.fieldError}>
      {message}
    </span>
  );
}
