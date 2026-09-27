import { CopyIcon, Pencil2Icon, UploadIcon } from "@radix-ui/react-icons";
import { type ChangeEvent, useRef } from "react";
import styles from "../admin.module.css";

type ImageUploaderProps = {
  slug: string;
  isBusy: boolean;
  isUploading: boolean;
  uploadedImageUrl: string | null;
  onUpload: (file: File) => void;
  onCopyUrl: () => void;
  onInsertImage: () => void;
};

export function ImageUploader({
  slug,
  isBusy,
  isUploading,
  uploadedImageUrl,
  onUpload,
  onCopyUrl,
  onInsertImage,
}: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) onUpload(file);
    event.target.value = "";
  };

  return (
    <div className={`${styles.uploadField} ${styles.wideField}`}>
      <div>
        <UploadIcon aria-hidden="true" />
        <span>
          <strong>
            {isUploading ? "アップロード中…" : "画像をアップロード"}
          </strong>
          <small>JPEG・PNG・WebP・GIF・AVIF / 10MBまで</small>
        </span>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/avif,image/gif,image/jpeg,image/png,image/webp"
        disabled={isBusy || !slug}
        onChange={handleFileChange}
      />
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={isBusy || !slug}
      >
        ファイルを選択
      </button>
      {!slug && (
        <span className={styles.hint}>先にスラッグを入力してください。</span>
      )}
      {uploadedImageUrl && (
        <div className={styles.uploadResult}>
          <code>{uploadedImageUrl}</code>
          <button type="button" onClick={onCopyUrl}>
            <CopyIcon aria-hidden="true" /> URLをコピー
          </button>
          <button type="button" onClick={onInsertImage}>
            <Pencil2Icon aria-hidden="true" /> 本文へ挿入
          </button>
        </div>
      )}
    </div>
  );
}
