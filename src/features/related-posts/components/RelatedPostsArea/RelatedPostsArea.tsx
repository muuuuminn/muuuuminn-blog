import type { FC } from "react";
import { memo } from "react";
import { Heading } from "@radix-ui/themes";

import { getDictionary } from "@/libs/i18n";
import { HStack } from "@/libs/radix/layout/Stack";
import { PostCard } from "@/features/post/components/PostCard";

import type { PostListType } from "@/features/post/types";

type RelatedPostsArea = {
  relatedPosts: PostListType;
};

const _RelatedPostsArea: FC<RelatedPostsArea> = async ({ relatedPosts }) => {
  const d = await getDictionary();
  return (
    <HStack>
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
    </HStack>
  );
};

export const RelatedPostsArea = memo(_RelatedPostsArea);
