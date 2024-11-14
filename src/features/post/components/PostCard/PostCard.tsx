import type { FC } from "react";
import { memo } from "react";

import { createStyles } from "@radix-ui/themes";

import { Category } from "@/features/category/components";
import { PostDate, PostThumbnail, PostTitleLink } from "@/features/post/components";
import { NoWrapTagList } from "@/features/tag/components";
import { useTranslation } from "@/libs/i18n";
import { HStack, Stack, Box } from "@/libs/radix/layout/Container/Container";
import { Text } from "@/libs/radix/typography/Text";

import type { PostType } from "@/features/post/types";
import type { BoxProps } from "@/libs/radix/layout/Container/Container";

type PostCardProps = {
  post: PostType;
} & BoxProps;

const useStyles = createStyles(() => ({
  card: {
    overflowX: "hidden",
  },
  thumbnailContainer: {
    flexShrink: 0,
  },
  thumbnail: {
    flexShrink: 0,
  },
}));

const _PostCard: FC<PostCardProps> = ({ post, ...rest }) => {
  const { classes } = useStyles();
  const { t } = useTranslation();
  const alt = `${post.title}${t.ALT.THUMBNAIL_OF}`;
  return (
    <Box className={classes.card} component={"article"} py={4} {...rest}>
      <Stack align={"start"} spacing={8}>
        <HStack spacing={"md"}>
          {post.category && <Category asLink category={post.category} />}
          <PostDate date={post.date} fz={"sm"} />
        </HStack>
        <HStack className={classes.thumbnailContainer} noWrap spacing={"md"}>
          <PostThumbnail
            alt={alt}
            className={classes.thumbnail}
            imageQuality={50}
            ratio={1 / 1}
            src={post.coverImage}
          />
          <Stack align={"flex-start"}>
            <PostTitleLink post={post} />
            <NoWrapTagList tagProps={{ shallow: true, replace: true }} tags={post.tags} />
          </Stack>
        </HStack>
        <Text color={"gray"} lineClamp={2}>
          {post.description}
        </Text>
      </Stack>
    </Box>
  );
};

export const PostCard = memo(_PostCard);
