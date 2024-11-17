import { memo } from "react";
import { Link } from "@radix-ui/themes";

import { Box } from "@/libs/radix/layout/Box";
import { Text } from "@/libs/radix/typography/Text";
import { Grid } from "@/libs/radix/layout/Grid";
import { CustomNextLink } from "@/libs/next/CustomNextLink";
import { Category } from "@/features/category/components/Category";
import { Tag } from "@/features/tag/components/TagList/Tag";

import { PostDate } from "../PostDate";
import { PostTitleLink } from "../PostTitleLink";
import { PostThumbnail } from "../PostThumbnail";

import type { FC } from "react";
import type { ComponentProps } from "react";
import type { PostType } from "@/features/post/types";

type PostCardProps = {
  post: PostType;
} & ComponentProps<typeof Box>;

const _PostCard: FC<PostCardProps> = ({ post }) => {
  return (
    <article aria-labelledby={post.slug}>
      <Grid
        areas={`
          "category date"
          "thumbnail title"
          "thumbnail tag"
          "description description"
        `}
        gapX="4"
        gapY="2"
        align="start"
        style={{
          gridTemplateColumns: "auto 1fr",
        }}
      >
        {/* タイトル */}
        <Box
          style={{
            gridArea: "title",
          }}
        >
          <PostTitleLink title={post.title} slug={post.slug} size="3" />
        </Box>

        {/* カテゴリ */}
        <Box
          style={{
            gridArea: "category",
          }}
        >
          <Category category={post.category} />
        </Box>

        {/* 投稿日 */}
        <Box
          style={{
            gridArea: "date",
          }}
        >
          <PostDate date={post.date} />
        </Box>

        {/* タグ */}
        <Box
          style={{
            gridArea: "tag",
          }}
        >
          {post.tags.map((tag) => (
            <Tag tag={tag} />
          ))}
        </Box>

        {/* 概要 */}
        <Text
          style={{
            gridArea: "description",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
            lineHeight: "1.5",
          }}
          as="p"
          size="2"
        >
          {post.description}
        </Text>

        {/* サムネイル */}
        <Box
          style={{
            gridArea: "thumbnail",
          }}
          position="relative"
          width="100px"
          height="100px"
        >
          <Link asChild tabIndex={-1} aria-hidden="true">
            <CustomNextLink href={`/post/${post.slug}`}>
              <PostThumbnail src={post.coverImage} alt="" />
            </CustomNextLink>
          </Link>
        </Box>
      </Grid>
    </article>
  );
};

export const PostCard = memo(_PostCard);
