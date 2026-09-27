import type { CmsPostStatus } from "@/libs/cms/types";
import styles from "../admin.module.css";

const STATUS_LABELS: Record<CmsPostStatus, string> = {
  draft: "下書き",
  published: "公開中",
  archived: "非公開",
};

export function PostStatusBadge({ status }: { status: CmsPostStatus }) {
  return (
    <span className={`${styles.statusBadge} ${styles[status]}`}>
      {STATUS_LABELS[status]}
    </span>
  );
}
