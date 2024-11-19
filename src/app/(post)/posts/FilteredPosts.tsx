"use client";

import { useSearchParams } from "next/navigation";

import { PostCardList } from "@/features/post/components/PostCardList";
import { MASTER_TAGS } from "@/features/tag/constants";

import type { PostType } from "@/features/post/types";
import type { FC } from "react";

type FilteredPostsProps = {
  posts: PostType[];
};

const FilteredPosts: FC<FilteredPostsProps> = ({ posts }) => {
  const searchParams = useSearchParams();
  const tagName = searchParams.get("tag") as string | string[] | undefined;

  const selectedTag = MASTER_TAGS.find(
    (tag) => typeof tagName === "string" && tag.name === tagName,
  );

  const filteredPosts = selectedTag
    ? posts.filter((post) => {
        if (selectedTag) {
          const isTagMatch = post.tags.some(
            (tag) => tag.name === selectedTag.name,
          );
          return isTagMatch;
        }
        return true;
      })
    : posts;

  return <PostCardList posts={filteredPosts} />;
};

export default FilteredPosts;
