import type { FC } from "react";

import { AdSense } from "@/features/advertise/components";
import { PostDetail } from "@/features/post/components";
import { RelatedPostsArea } from "@/features/related-posts/components";
import { useTranslation } from "@/libs/i18n";
import { Stack } from "@/libs/mantine/layout";
import { ArticleSeo, ArticleJsonLd } from "@/shared/components";

import type { PostDetailType, PostListType } from "@/features/post/types";
import type { ArticleSeoProps, ArticleJsonLdProps } from "@/shared/components";

type PostProps = {
  post: PostDetailType;
  relatedPosts: PostListType;
};
export const Post: FC<PostProps> = ({ post, relatedPosts }) => {
  const { t } = useTranslation();

  const APP_ROOT_URL = process.env.NEXT_PUBLIC_APP_ROOT_URL || "";
  const seo: ArticleSeoProps = {
    title: post.title,
    description: post.description,
    path: `/post/${post.slug}`,
    ogImage: {
      url: APP_ROOT_URL + post.ogImageUrl,
      alt: `${post.title}${t.ALT.THUMBNAIL_OF}`,
    },
    articleOgp: {
      publishedTime: post.date,
      section: post.category.name,
      tags: post.tags.map((tag) => tag.name),
    },
  };

  const jsonLd: ArticleJsonLdProps = {
    title: post.title,
    description: post.description,
    url: `/post/${post.slug}`,
    images: [APP_ROOT_URL + post.ogImageUrl],
    datePublished: post.date,
    dateModified: post.date,
  };

  return (
    <>
      <ArticleSeo {...seo} />
      <ArticleJsonLd {...jsonLd} />
      <Stack
        miw={"300px"}
        mx={"auto"}
        my={8}
        spacing={10}
        sx={{
          overflowX: "hidden",
        }}
      >
        <PostDetail postDetail={post} />
        {relatedPosts.length !== 0 && <RelatedPostsArea relatedPosts={relatedPosts} />}
      </Stack>
      <div>
        <AdSense />
      </div>
    </>
  );
};
