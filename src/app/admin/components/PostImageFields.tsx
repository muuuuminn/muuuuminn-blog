import styles from "../admin.module.css";
import type {
  BusyAction,
  EditorPost,
  FieldErrors,
  UpdatePost,
} from "../editorTypes";
import { FieldError } from "./FieldError";
import { ImageUploader } from "./ImageUploader";

type PostImageFieldsProps = {
  post: EditorPost;
  errors: FieldErrors;
  isBusy: boolean;
  busyAction: BusyAction | null;
  uploadedImageUrl: string | null;
  onUpdate: UpdatePost;
  onUploadImage: (file: File) => void;
  onCopyImageUrl: () => void;
  onInsertImage: () => void;
};

export function PostImageFields({
  post,
  errors,
  isBusy,
  busyAction,
  uploadedImageUrl,
  onUpdate,
  onUploadImage,
  onCopyImageUrl,
  onInsertImage,
}: PostImageFieldsProps) {
  return (
    <>
      <label className={styles.field} htmlFor="cms-cover">
        <span className={styles.fieldLabel}>
          カバー画像URL <span>公開時は必須</span>
        </span>
        <input
          id="cms-cover"
          value={post.coverImage}
          onChange={(event) => onUpdate("coverImage", event.target.value)}
          placeholder="https://… または /post/…"
          aria-invalid={Boolean(errors.coverImage)}
        />
        <FieldError message={errors.coverImage} />
      </label>
      <label className={styles.field} htmlFor="cms-og">
        <span className={styles.fieldLabel}>
          OGP画像URL <span>任意</span>
        </span>
        <input
          id="cms-og"
          value={post.ogImageUrl}
          onChange={(event) => onUpdate("ogImageUrl", event.target.value)}
          placeholder="空欄ならカバー画像を使用"
        />
      </label>
      <ImageUploader
        slug={post.slug}
        isBusy={isBusy}
        isUploading={busyAction === "upload"}
        uploadedImageUrl={uploadedImageUrl}
        onUpload={onUploadImage}
        onCopyUrl={onCopyImageUrl}
        onInsertImage={onInsertImage}
      />
    </>
  );
}
