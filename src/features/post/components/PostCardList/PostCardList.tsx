import type { FC } from "react";
import { memo } from "react";

import { PostCard } from "../PostCard";

import type { PostListType } from "@/features/post/types";

type PostCardListProps = {
  posts: PostListType;
};

// TODO: スクロールがあることを示すために上下に矢印をabsoluteで置くか、ボカシをいれて示すかしたい
const _PostCardList: FC<PostCardListProps> = ({ posts }) => {
  return posts.map((post) => <PostCard key={post.slug} post={post} />);
};

export const PostCardList = memo(_PostCardList);
