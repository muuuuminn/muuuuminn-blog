import styles from "./PostCard.module.css";

import { Link } from "@radix-ui/themes";
import { memo } from "react";

import { Category } from "@/features/category/components/Category";
import { TagList } from "@/features/tag/components/TagList";
import { CustomNextLink } from "@/libs/next/CustomNextLink";
import { Box } from "@/libs/radix/layout/Box";
import { Grid } from "@/libs/radix/layout/Grid";
import { Text } from "@/libs/radix/typography/Text";

import { PostDate } from "../PostDate";
import { PostThumbnail } from "../PostThumbnail";
import { PostTitle } from "../PostTitle";
import { CardWrapper } from "./CardWrapper";

import type { PostType } from "@/features/post/types";
import type { FC } from "react";
import type { ComponentProps } from "react";

type PostCardProps = {
  post: PostType;
} & ComponentProps<typeof Box>;

const _PostCard: FC<PostCardProps> = ({ post }) => {
  return (
    <CardWrapper post={post}>
      <Grid
        areas={`
          "category date"
          "thumbnail title"
          "thumbnail tag"
          "description description"
        `}
        gapX="4"
        gapY="1"
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
          <Link
            asChild
            highContrast
            color="gray"
            underline="none"
            className={styles.titleLink}
          >
            <CustomNextLink href={`/post/${post.slug}`}>
              <PostTitle title={post.title} slug={post.slug} size="2" />
            </CustomNextLink>
          </Link>
        </Box>

        {/* カテゴリ */}
        <Box
          style={{
            gridArea: "category",
          }}
          className={styles.category}
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
          className={styles.tag}
        >
          <TagList tags={post.tags} />
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
          }}
          as="p"
          size="1"
          color="gray"
          highContrast
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
          <PostThumbnail src={post.coverImage} alt="" />
        </Box>
      </Grid>
    </CardWrapper>
  );
};

export const PostCard = memo(_PostCard);
