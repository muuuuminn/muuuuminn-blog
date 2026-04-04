import type { FC } from "react";
import { memo } from "react";
import type { PostType } from "@/features/post/types";
import { VStack } from "@/libs/radix/layout/Stack";
import { PostCard } from "../PostCard";

type PostCardListProps = {
  posts: Omit<PostType, "html">[];
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
