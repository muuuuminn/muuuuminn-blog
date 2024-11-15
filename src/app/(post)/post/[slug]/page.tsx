import { FC } from "react";
import markdownToHtml from "zenn-markdown-html";

import { getAllPosts, getPostBySlug } from "@/libs/markdown/api";
import { PostDetail } from "@/features/post/components/PostDetail";
import { RelatedPostsArea } from "@/features/related-posts/components/RelatedPostsArea";
import { getRelatedPosts } from "@/features/related-posts/utils/getRelatedPosts";
import { AdSense } from "@/features/advertise/components/AdSense";
import { getPostJsonLd } from "./jsonLd";

type PostPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  const posts = getAllPosts(["slug", "date"]);

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

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
  const htmlContent = markdownToHtml(post.content || "");

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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
      <PostDetail
        post={{
          ...post,
          content: htmlContent,
        }}
      />
      {relatedPosts.length !== 0 && <RelatedPostsArea relatedPosts={relatedPosts} />}
      <AdSense />
    </div>
  );
};

export default PostPage;
