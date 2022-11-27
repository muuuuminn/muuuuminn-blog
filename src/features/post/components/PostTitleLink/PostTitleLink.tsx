import { FC, memo } from "react";

import { PostType } from "@/features/post/type/post";
import { Text } from "@/libs/chakra";
import { CustomNextLink } from "@/libs/next";

type PostTitleProps = {
  post: PostType;
};

const _PostTitleLink: FC<PostTitleProps> = ({ post }) => {
  return (
    <CustomNextLink linkType={"withOverlay"} href={`/post/${post.slug}`} prefetch={false}>
      <Text noOfLines={2} fontSize={"lg"} fontWeight={"bold"}>
        {post.title}
      </Text>
    </CustomNextLink>
  );
};

export const PostTitleLink = memo(_PostTitleLink);
