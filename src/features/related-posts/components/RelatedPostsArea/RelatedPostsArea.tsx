import type { FC } from "react";
import { memo } from "react";

import { Title } from "@radix-ui/themes";

import { PostCard } from "@/features/post/components";
import { useTranslation } from "@/libs/i18n";
import { Stack } from "@/libs/radix/layout/Container/Container";

import type { PostListType } from "@/features/post/types";

type RelatedPostsArea = {
  relatedPosts: PostListType;
};

const _RelatedPostsArea: FC<RelatedPostsArea> = ({ relatedPosts }) => {
  const { t } = useTranslation();
  return (
    <Stack>
      <Title
        fw={"bold"}
        fz={"lg"}
        sx={(theme) => ({
          borderBottom: `2px solid ${
            theme.colorScheme === "dark"
              ? theme.colors["light-coral"][1]
              : theme.colors["light-coral"][8]
          }`,
        })}
      >
        {t.COMPONENTS.RELATED_POST_AREA.TITLE}
      </Title>
      {relatedPosts.map((relatedPost) => (
        <PostCard key={relatedPost.slug} post={relatedPost} />
      ))}
    </Stack>
  );
};

export const RelatedPostsArea = memo(_RelatedPostsArea);
