import { RichMarkdownContent } from "@/components/RichMarkdownContent";
import { Category } from "@/features/category/components/Category";
import { PostDate } from "@/features/post/components/PostDate";
import { PostThumbnail } from "@/features/post/components/PostThumbnail";
import { getDictionary } from "@/libs/i18n";
import { HStack, VStack } from "@/libs/radix/layout/Stack";
import { Box, Heading } from "@radix-ui/themes";

import type { PostDetailType } from "@/features/post/types";
import type { FC } from "react";
import type { ComponentProps } from "react";

type PostDetailProps = {
  post: PostDetailType;
} & ComponentProps<typeof Box>;

export const PostDetail: FC<PostDetailProps> = async ({ post, ...rest }) => {
  const d = await getDictionary();
  const alt = `${post.title}${d.ALT.THUMBNAIL_OF}`;

  return (
    <Box {...rest}>
      <VStack gap="16px">
        {/* カテゴリと日付 */}
        <HStack gap="8px" align="center">
          {post.category && <Category category={post.category} />}
          <PostDate date={post.date} size="2" />
        </HStack>

        {/* サムネイルとタイトル、タグ */}
        <VStack align="center" gap="8px">
          <PostThumbnail
            alt={alt}
            enableBlur
            imageQuality={75}
            // ratio={{ "@initial": 1.85 / 1.5, "@bp1": 16 / 9 }}
            sizeSet={{ width: 300, height: 168 }}
            src={post.coverImage}
          />
          <Heading as="h1" weight="bold" size="6" align="center">
            {post.title}
          </Heading>
          {/* <WrapTagList justify="center" tags={post.tags} wrap="wrap" /> */}
        </VStack>
      </VStack>

      {/* 記事コンテンツ */}
      <Box mt="16px" pl="8px" pr="4px">
        <RichMarkdownContent html={post.content} />
      </Box>
    </Box>
  );
};
