import type { FC } from "react";

import { em, getBreakpointValue, Title, useMantineTheme } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";

import { Category } from "@/features/category/components";
import { PostDate, PostThumbnail } from "@/features/post/components";
import { WrapTagList } from "@/features/tag/components";
import { useTranslation } from "@/libs/i18n";
import { Box, HStack, Stack } from "@/libs/mantine/layout";
import { RichMarkdownContent } from "@/shared/components";

import type { PostDetailType } from "@/features/post/types";
import type { BoxProps } from "@/libs/mantine/layout";

type PostDetailProps = {
  postDetail: PostDetailType;
} & BoxProps;

export const PostDetail: FC<PostDetailProps> = ({ postDetail, ...rest }) => {
  const { t } = useTranslation();
  const { breakpoints } = useMantineTheme();
  const largerThanSm = useMediaQuery(`(min-width: ${em(getBreakpointValue(breakpoints.sm))})`);

  const sizeSet = largerThanSm
    ? {
        width: 400,
        height: 225,
      }
    : {
        width: 300,
        height: 168,
      };

  const alt = `${postDetail.title}${t.ALT.THUMBNAIL_OF}`;
  return (
    <Box {...rest}>
      <Stack>
        <HStack spacing={16}>
          {postDetail.category && <Category asLink category={postDetail.category} />}
          <PostDate date={postDetail.date} fz={"sm"} />
        </HStack>
        <Stack align={"center"} justify={"center"}>
          <PostThumbnail
            alt={alt}
            enableBlur
            imageQuality={75}
            ratio={largerThanSm ? 16 / 9 : 1.85 / 1.5}
            sizeSet={sizeSet}
            src={postDetail.coverImage}
          />
          <Title fw={"bold"} fz={"lg"}>
            {postDetail.title}
          </Title>
          <WrapTagList justify={"center"} tags={postDetail.tags} w={"full"} wrap={"wrap"} />
        </Stack>
      </Stack>
      {postDetail.content && (
        <Box mt={16} pl={8} pr={4}>
          <RichMarkdownContent html={postDetail.content} />
        </Box>
      )}
    </Box>
  );
};
