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
    <VStack>
      <Heading
      // sx={(theme) => ({
      //   borderBottom: `2px solid ${
      //     theme.colorScheme === "dark"
      //       ? theme.colors["light-coral"][1]
      //       : theme.colors["light-coral"][8]
      //   }`,
      // })}
      >
        {d.COMPONENTS.RELATED_POST_AREA.TITLE}
      </Heading>
      {relatedPosts.map((relatedPost) => (
        <PostCard key={relatedPost.slug} post={relatedPost} />
      ))}
    </VStack>
  );
};

export const RelatedPostsArea = memo(_RelatedPostsArea);
