import { Heading } from "@radix-ui/themes";
import { memo } from "react";

import { PostCard } from "@/features/post/components/PostCard";
import { getDictionary } from "@/libs/i18n";
import { VStack } from "@/libs/radix/layout/Stack";

import type { PostListType } from "@/features/post/types";
import type { FC } from "react";

type RelatedPostsArea = {
  relatedPosts: PostListType;
};

const _RelatedPostsArea: FC<RelatedPostsArea> = async ({ relatedPosts }) => {
  const d = await getDictionary();
  return (
    <VStack gap="3">
      <Heading as="h3" size="4">
        {d.COMPONENTS.RELATED_POST_AREA.TITLE}
      </Heading>
      <VStack gap="2">
        {relatedPosts.map((relatedPost) => (
          <PostCard key={relatedPost.slug} post={relatedPost} />
        ))}
      </VStack>
    </VStack>
  );
};

export const RelatedPostsArea = memo(_RelatedPostsArea);
