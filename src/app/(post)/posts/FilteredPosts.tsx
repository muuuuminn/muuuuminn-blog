"use client";

import { useSearchParams } from "next/navigation";
import { useMemo } from "react";

import { PostCardList } from "@/features/post/components/PostCardList";
import { MASTER_TAGS } from "@/features/tag/constants";

import type { PostType } from "@/features/post/types";
import type { FC } from "react";

type FilteredPostsProps = {
  posts: PostType[];
};

const FilteredPosts: FC<FilteredPostsProps> = ({ posts }) => {
  const searchParams = useSearchParams();
  const tagName = searchParams.get("tag");

  const filteredPosts = useMemo(() => {
    if (typeof tagName !== "string") {
      return posts;
    }

    const selectedTag = MASTER_TAGS.find((tag) => tag.name === tagName);
    if (!selectedTag) {
      return posts;
    }

    return posts.filter((post) =>
      post.tags.some((tag) => tag.name === selectedTag.name),
    );
  }, [posts, tagName]);

  return <PostCardList posts={filteredPosts} />;
};

export default FilteredPosts;
