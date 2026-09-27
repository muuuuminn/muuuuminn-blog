import styles from "../admin.module.css";
import type {
  BusyAction,
  EditorPost,
  FieldErrors,
  UpdatePost,
} from "../editorTypes";
import { BasicPostFields } from "./BasicPostFields";
import { MarkdownEditor } from "./MarkdownEditor";
import { PostImageFields } from "./PostImageFields";
import { TagSelector } from "./TagSelector";

type PostFormProps = {
  post: EditorPost;
  errors: FieldErrors;
  isExistingPost: boolean;
  isBusy: boolean;
  busyAction: BusyAction | null;
  uploadedImageUrl: string | null;
  onUpdate: UpdatePost;
  onUploadImage: (file: File) => void;
  onCopyImageUrl: () => void;
  onInsertImage: () => void;
};

export function PostForm({
  post,
  errors,
  isExistingPost,
  isBusy,
  busyAction,
  uploadedImageUrl,
  onUpdate,
  onUploadImage,
  onCopyImageUrl,
  onInsertImage,
}: PostFormProps) {
  return (
    <div className={styles.formGrid}>
      <BasicPostFields
        post={post}
        errors={errors}
        isExistingPost={isExistingPost}
        onUpdate={onUpdate}
      />
      <TagSelector
        selectedTags={post.tags}
        onChange={(tags) => onUpdate("tags", tags)}
      />
      <PostImageFields
        post={post}
        errors={errors}
        isBusy={isBusy}
        busyAction={busyAction}
        uploadedImageUrl={uploadedImageUrl}
        onUpdate={onUpdate}
        onUploadImage={onUploadImage}
        onCopyImageUrl={onCopyImageUrl}
        onInsertImage={onInsertImage}
      />
      <MarkdownEditor
        body={post.body}
        error={errors.body}
        onChange={(body) => onUpdate("body", body)}
      />
    </div>
  );
}
