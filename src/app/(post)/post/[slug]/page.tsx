export const dynamicParams = false;

import { notFound } from "next/navigation";

import { AdSense } from "@/features/advertise/components/AdSense";
import { PostDetail } from "@/features/post/components/PostDetail";
import { RelatedPostsArea } from "@/features/related-posts/components/RelatedPostsArea";
import { getRelatedPosts } from "@/features/related-posts/utils/getRelatedPosts";
import { getAllPosts, getPostBySlug } from "@/libs/markdown/api";
import markdownToHtml from "@/libs/markdown/markdownToHtml";
import { VStack } from "@/libs/radix/layout/Stack";

import { getPostJsonLd } from "./jsonLd";

import type { FC } from "react";

type PostPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export const generateStaticParams = async () => {
  const posts = getAllPosts(["slug", "date"]);

  return posts.map((post) => ({
    slug: post.slug,
  }));
};

const PostPage: FC<PostPageProps> = async ({ params }) => {
  const slug = (await params).slug;
  const post = getPostBySlug(slug, [
    "title",
    "date",
    "slug",
    "content",
    "ogImageUrl",
    "coverImage",
    "description",
    "category",
    "tags",
  ]);

  if (!post) {
    return notFound();
  }

  const htmlContent = await markdownToHtml(post.content || "");

  const posts = getAllPosts([
    "title",
    "date",
    "slug",
    "coverImage",
    "description",
    "category",
    "tags",
  ]);
  const relatedPosts = getRelatedPosts(posts, {
    category: post.category,
    tags: post.tags,
    tagMatchLevel: 2,
    limit: 5,
    excludeSlug: slug,
  });

  const jsonLd = getPostJsonLd(post);

  return (
    <div>
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
        dangerouslySetInnerHTML={{ __html: jsonLd }}
      />
      <VStack gap="6">
        <PostDetail
          post={{
            ...post,
            content: htmlContent,
          }}
        />
        {relatedPosts.length !== 0 && (
          <RelatedPostsArea relatedPosts={relatedPosts} />
        )}
        <AdSense />
      </VStack>
    </div>
  );
};

export default PostPage;
