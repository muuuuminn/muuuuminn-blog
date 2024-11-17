import type { FC } from "react";
import { memo } from "react";

import { VStack } from "@/libs/radix/layout/Stack";
import { PostCard } from "../PostCard";

import type { PostListType } from "@/features/post/types";

type PostCardListProps = {
  posts: PostListType;
};

// TODO: スクロールがあることを示すために上下に矢印をabsoluteで置くか、ボカシをいれて示すかしたい
const _PostCardList: FC<PostCardListProps> = ({ posts }) => {
  return (
    <VStack gap="4">
      {posts.map((post) => (
        <PostCard post={post} key={post.slug} />
      ))}
    </VStack>
  );
};

export const PostCardList = memo(_PostCardList);
