import type { FC } from "react";
import { memo } from "react";
import { getDictionary } from "@/libs/i18n";
import { Box, Text, Flex } from "@radix-ui/themes";
import { Category } from "@/features/category/components/Category";
import { PostDate } from "@/features/post/components/PostDate";
import { PostThumbnail } from "@/features/post/components/PostThumbnail";
import { PostTitleLink } from "@/features/post/components/PostTitleLink";
import { NoWrapTagList } from "@/features/tag/components/TagList/NoWrapTagList";

import type { PostType } from "@/features/post/types";
import type { ComponentProps } from "react";

type PostCardProps = {
  post: PostType;
} & ComponentProps<typeof Box>;

const _PostCard: FC<PostCardProps> = async ({ post, ...rest }) => {
  const d = await getDictionary();
  const alt = `${post.title}${d.ALT.THUMBNAIL_OF}`;

  return (
    <Box asChild style={{ padding: "16px", overflowX: "hidden" }} {...rest}>
      <article>
        <Flex direction="column" gap="8px">
          {/* カテゴリと日付 */}
          <Flex gap="8px" align="center">
            {post.category && <Category asLink category={post.category} />}
            <PostDate date={post.date} size="2" />
          </Flex>

          {/* サムネイルとタイトル・タグ */}
          <Flex gap="16px" align="start" style={{ flexWrap: "nowrap" }}>
            <Box style={{ flexShrink: 0 }}>
              <PostThumbnail
                alt={alt}
                imageQuality={50}
                // ratio={1 / 1}
                src={post.coverImage}
                // style={{
                //   width: "80px",
                //   height: "80px",
                //   objectFit: "cover",
                //   borderRadius: "8px",
                // }}
              />
            </Box>
            <Flex direction="column" gap="4px" align="start">
              <PostTitleLink post={post} />
              {/* <NoWrapTagList tagProps={{ shallow: true, replace: true }} tags={post.tags} /> */}
            </Flex>
          </Flex>

          {/* 説明文 */}
          <Text
            size="2"
            color="gray"
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {post.description}
          </Text>
        </Flex>
      </article>
    </Box>
  );
};

export const PostCard = memo(_PostCard);
