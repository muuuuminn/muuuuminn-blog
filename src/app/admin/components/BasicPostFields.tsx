import { MASTER_CATEGORIES } from "@/features/category/constants";
import styles from "../admin.module.css";
import type { EditorPost, FieldErrors, UpdatePost } from "../editorTypes";
import { slugify, toDateTimeLocal } from "../editorUtils";
import { FieldError } from "./FieldError";

type BasicPostFieldsProps = {
  post: EditorPost;
  errors: FieldErrors;
  isExistingPost: boolean;
  onUpdate: UpdatePost;
};

export function BasicPostFields({
  post,
  errors,
  isExistingPost,
  onUpdate,
}: BasicPostFieldsProps) {
  const generatedSlug = slugify(post.title);

  return (
    <>
      <label
        className={`${styles.field} ${styles.wideField}`}
        htmlFor="cms-title"
      >
        <span className={styles.fieldLabel}>
          タイトル <b>必須</b>
        </span>
        <input
          id="cms-title"
          value={post.title}
          onChange={(event) => onUpdate("title", event.target.value)}
          aria-invalid={Boolean(errors.title)}
          aria-describedby={errors.title ? "cms-title-error" : undefined}
          placeholder="記事の内容がひと目で伝わるタイトル"
        />
        <span className={styles.fieldFooter}>
          <FieldError id="cms-title-error" message={errors.title} />
          <span>{post.title.length}文字</span>
        </span>
      </label>

      <div className={styles.field}>
        <label className={styles.fieldLabel} htmlFor="cms-slug">
          スラッグ <b>必須</b>
        </label>
        <div className={styles.inlineInput}>
          <input
            id="cms-slug"
            value={post.slug}
            disabled={isExistingPost}
            onChange={(event) =>
              onUpdate(
                "slug",
                event.target.value.toLowerCase().replace(/\s+/g, "-"),
              )
            }
            placeholder="my-new-post"
            aria-invalid={Boolean(errors.slug)}
            aria-describedby={errors.slug ? "cms-slug-error" : "cms-slug-hint"}
          />
          {!isExistingPost && generatedSlug && !post.slug && (
            <button
              type="button"
              onClick={() => onUpdate("slug", generatedSlug)}
            >
              タイトルから生成
            </button>
          )}
        </div>
        <span
          id={errors.slug ? "cms-slug-error" : "cms-slug-hint"}
          className={errors.slug ? styles.fieldError : styles.hint}
        >
          {errors.slug ||
            (isExistingPost
              ? "公開URLのため変更できません。"
              : "半角英小文字・数字・ハイフン")}
        </span>
      </div>

      <label className={styles.field} htmlFor="cms-date">
        <span className={styles.fieldLabel}>
          公開日時 <b>必須</b>
        </span>
        <input
          id="cms-date"
          type="datetime-local"
          value={toDateTimeLocal(post.publishedAt)}
          onChange={(event) =>
            onUpdate(
              "publishedAt",
              event.target.value
                ? new Date(event.target.value).toISOString()
                : "",
            )
          }
          aria-invalid={Boolean(errors.publishedAt)}
        />
        <FieldError message={errors.publishedAt} />
      </label>

      <label
        className={`${styles.field} ${styles.wideField}`}
        htmlFor="cms-description"
      >
        <span className={styles.fieldLabel}>
          概要 <b>必須</b>
        </span>
        <textarea
          id="cms-description"
          rows={3}
          value={post.description}
          onChange={(event) => onUpdate("description", event.target.value)}
          aria-invalid={Boolean(errors.description)}
          placeholder="検索結果やSNSで表示される、記事の短い説明"
        />
        <span className={styles.fieldFooter}>
          <FieldError message={errors.description} />
          <span
            className={
              post.description.length > 160 ? styles.countWarning : undefined
            }
          >
            {post.description.length} / 160文字
          </span>
        </span>
      </label>

      <label className={styles.field} htmlFor="cms-category">
        <span className={styles.fieldLabel}>
          カテゴリ <b>必須</b>
        </span>
        <select
          id="cms-category"
          value={post.category}
          onChange={(event) => onUpdate("category", event.target.value)}
          aria-invalid={Boolean(errors.category)}
        >
          {!MASTER_CATEGORIES.some(
            (category) => category.id === post.category,
          ) && <option value={post.category}>Legacy ({post.category})</option>}
          {MASTER_CATEGORIES.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
          <option value="-1">Other</option>
        </select>
        <FieldError message={errors.category} />
      </label>
    </>
  );
}
