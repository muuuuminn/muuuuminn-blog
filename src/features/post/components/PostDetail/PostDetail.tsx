import { FC } from "react";

import { Category } from "@/features/post/components/Category";
import { PostDate } from "@/features/post/components/PostDate";
import { PostThumbnail } from "@/features/post/components/PostThumbnail";
import { WrapTagList } from "@/features/post/components/TagList";
import { PostDetailType } from "@/features/post/type/post";
import { Box, BoxProps, HStack, VStack } from "@/libs/chakra";
import { Text } from "@/libs/chakra";
import { RichMarkdownContent } from "@/shared/components/RichMarkdownContent";

type PostDetailProps = {
  postDetail: PostDetailType;
} & BoxProps;

export const PostDetail: FC<PostDetailProps> = ({ postDetail, ...rest }) => {
  return (
    <Box overflowX={"hidden"} {...rest} marginY={{ base: 2, md: 8 }}>
      <VStack>
        <HStack alignSelf={"flex-start"} spacing={4}>
          {postDetail.category && <Category asLink category={postDetail.category} />}
          <PostDate fontSize={"sm"} date={postDetail.date} />
        </HStack>
        <VStack>
          <PostThumbnail
            src={postDetail.coverImage}
            imageQuality={75}
            sizeSet={{
              width: "200px",
              height: "200px",
            }}
          />
          <Text fontSize={"lg"} fontWeight={"bold"}>
            {postDetail.title}
          </Text>
          <WrapTagList tags={postDetail.tags} flexWrap={"wrap"} width={"full"} paddingX={20} />
        </VStack>
      </VStack>
      {postDetail.content && (
        <Box marginTop={4}>
          <RichMarkdownContent html={postDetail.content} />
        </Box>
      )}
    </Box>
  );
};
