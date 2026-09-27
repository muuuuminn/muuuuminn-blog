import {
  Cross2Icon,
  MagnifyingGlassIcon,
  PlusIcon,
} from "@radix-ui/react-icons";
import styles from "../admin.module.css";
import type { EditorPost } from "../editorTypes";
import { formatUpdatedAt } from "../editorUtils";
import { PostStatusBadge } from "./PostStatusBadge";

type PostSidebarProps = {
  posts: EditorPost[];
  totalCount: number;
  selectedSlug: string | null;
  query: string;
  onQueryChange: (query: string) => void;
  onSelect: (post: EditorPost) => void;
  onCreate: () => void;
};

export function PostSidebar({
  posts,
  totalCount,
  selectedSlug,
  query,
  onQueryChange,
  onSelect,
  onCreate,
}: PostSidebarProps) {
  return (
    <aside className={styles.sidebar}>
      <button className={styles.newButton} type="button" onClick={onCreate}>
        <PlusIcon aria-hidden="true" /> 新しい記事
      </button>
      <label className={styles.searchBox}>
        <MagnifyingGlassIcon aria-hidden="true" />
        <span className={styles.srOnly}>記事を検索</span>
        <input
          type="search"
          placeholder="タイトル・スラッグで検索"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
        />
        {query && (
          <button
            type="button"
            onClick={() => onQueryChange("")}
            aria-label="検索をクリア"
          >
            <Cross2Icon aria-hidden="true" />
          </button>
        )}
      </label>
      <div className={styles.listMeta}>
        <span>記事一覧</span>
        <span>
          {posts.length} / {totalCount}
        </span>
      </div>
      <div className={styles.postList}>
        {posts.map((post) => (
          <button
            className={`${styles.postItem} ${selectedSlug === post.slug ? styles.selected : ""}`}
            type="button"
            key={post.slug}
            onClick={() => onSelect(post)}
            aria-current={selectedSlug === post.slug ? "page" : undefined}
          >
            <span>{post.title || post.slug}</span>
            <small>
              <PostStatusBadge status={post.status} />
              {formatUpdatedAt(post.updatedAt)}
            </small>
          </button>
        ))}
        {posts.length === 0 && (
          <div className={styles.emptyList}>
            <p>記事が見つかりません</p>
            <button type="button" onClick={() => onQueryChange("")}>
              検索をクリア
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
