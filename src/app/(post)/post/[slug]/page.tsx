import { Metadata } from "next";
import { FC } from "react";
import markdownToHtml from "zenn-markdown-html";

import { getDictionary } from "@/libs/i18n";
import { getAllPosts, getPostBySlug } from "@/libs/markdown/api";
import { getMetadata, OG_IMAGE_EXTENSION_TYPE, SITE_METADATA } from "@/libs/metadata";
import { PostDetail } from "@/features/post/components/PostDetail";
import { RelatedPostsArea } from "@/features/related-posts/components/RelatedPostsArea";
import { getRelatedPosts } from "@/features/related-posts/utils/getRelatedPosts";

type PostPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const d = await getDictionary();
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

  const metadata = getMetadata({
    title: post.title,
    description: post.description,
    path: `/post/${post.slug}`,
    ogImage: {
      type: OG_IMAGE_EXTENSION_TYPE,
      url: SITE_METADATA.APP_ROOT_URL + post.ogImageUrl,
      alt: `${post.title}${d.ALT.THUMBNAIL_OF}`,
    },
    article: {
      publishedTime: post.date,
      section: post.category.name,
      tags: post.tags.map((tag) => tag.name),
    },
  });

  return metadata;
}

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

  return (
    <div>
      <PostDetail
        post={{
          ...post,
          content: htmlContent,
        }}
      />
      {relatedPosts.length !== 0 && <RelatedPostsArea relatedPosts={relatedPosts} />}
    </div>
  );
};

export default PostPage;
