import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { useMemo, useState } from "react";
import { MASTER_TAGS } from "@/features/tag/constants";
import styles from "../admin.module.css";

type TagSelectorProps = {
  selectedTags: string[];
  onChange: (tags: string[]) => void;
};

export function TagSelector({ selectedTags, onChange }: TagSelectorProps) {
  const [query, setQuery] = useState("");
  const filteredTags = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return MASTER_TAGS;
    return MASTER_TAGS.filter(
      (tag) =>
        tag.name.toLowerCase().includes(normalizedQuery) ||
        tag.id.toLowerCase().includes(normalizedQuery),
    );
  }, [query]);

  const toggleTag = (tagId: string, checked: boolean) => {
    onChange(
      checked
        ? [...selectedTags, tagId]
        : selectedTags.filter((id) => id !== tagId),
    );
  };

  return (
    <fieldset className={`${styles.tags} ${styles.wideField}`}>
      <legend>
        タグ <span>{selectedTags.length}件選択</span>
      </legend>
      <label className={styles.tagSearch}>
        <MagnifyingGlassIcon aria-hidden="true" />
        <span className={styles.srOnly}>タグを検索</span>
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="タグを絞り込む"
        />
      </label>
      <div className={styles.tagOptions}>
        {filteredTags.map((tag) => {
          const checked = selectedTags.includes(tag.id);
          return (
            <label
              key={tag.id}
              className={checked ? styles.tagSelected : undefined}
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={(event) => toggleTag(tag.id, event.target.checked)}
              />
              {tag.name}
            </label>
          );
        })}
        {selectedTags
          .filter((tagId) => !MASTER_TAGS.some((tag) => tag.id === tagId))
          .map((tagId) => (
            <label key={tagId} className={styles.tagSelected}>
              <input
                type="checkbox"
                checked
                onChange={() => toggleTag(tagId, false)}
              />
              Legacy ({tagId})
            </label>
          ))}
      </div>
    </fieldset>
  );
}
