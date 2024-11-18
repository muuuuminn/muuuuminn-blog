import { Box, Heading } from "@radix-ui/themes";

import { RichMarkdownContent } from "@/components/RichMarkdownContent";
import { Category } from "@/features/category/components/Category";
import { PostDate } from "@/features/post/components/PostDate";
import { PostThumbnail } from "@/features/post/components/PostThumbnail";
import { TagList } from "@/features/tag/components/TagList";
import { getDictionary } from "@/libs/i18n";
import { HStack, VStack } from "@/libs/radix/layout/Stack";

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
      <VStack gap="4">
        {/* カテゴリと日付 */}
        <HStack gap="2" align="center">
          <Category category={post.category} />
          <PostDate date={post.date} size="2" />
        </HStack>

        {/* サムネイルとタイトル、タグ */}
        <VStack align="center" gap="2">
          <Box position="relative" width="300px" height="168px">
            <PostThumbnail
              alt={alt}
              imageQuality={75}
              sizeSet={{ width: 300, height: 168 }}
              src={post.coverImage}
            />
          </Box>
          <Heading as="h1" weight="bold" size="5" align="center" wrap="pretty">
            {post.title}
          </Heading>
          <TagList tags={post.tags} />
        </VStack>
      </VStack>

      {/* 記事コンテンツ */}
      <Box mt="4" pl="2" pr="1">
        <RichMarkdownContent html={post.content} />
      </Box>
    </Box>
  );
};
