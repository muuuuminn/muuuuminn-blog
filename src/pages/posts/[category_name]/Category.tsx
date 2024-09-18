import { useRouter } from "next/router";
import type { FC } from "react";
import { useMemo } from "react";

import { PostCardList } from "@/features/post/components";
import { Box } from "@/libs/mantine/layout";

import type { PostListType } from "@/features/post/types";
import type { TagType } from "@/features/tag/types";

type CategoryProps = {
  posts: PostListType;
  tags: TagType[];
};

export const Category: FC<CategoryProps> = ({ posts, tags }) => {
  const router = useRouter();

  const tagNameAsQuery = (router.query.tag as string) || "";
  const selectedTag = useMemo(
    () => tags.find((tag) => tag.name === tagNameAsQuery),
    [tags, tagNameAsQuery],
  );

  const postsFilteredByTag = useMemo(() => {
    return selectedTag
      ? posts.filter((post) => post.tags.some((tag) => tag.name === selectedTag.name))
      : posts;
  }, [posts, selectedTag]);

  return (
    <>
      <Box px={8} sx={{ flex: "1 1 auto" }}>
        <PostCardList posts={postsFilteredByTag} />
      </Box>
    </>
  );
};
