import "zenn-content-css";
import "@/libs/markdown/prism-override-style.css";

import { Metadata } from "next";
import { FC, ReactNode } from "react";

import { getDictionary } from "@/libs/i18n";
import { getPostBySlug } from "@/libs/markdown/api";
import { getMetadata, OG_IMAGE_EXTENSION_TYPE, SITE_METADATA } from "@/libs/seo/metadata";

type PostLayoutProps = {
  params: Promise<{
    slug: string;
  }>;
  children: ReactNode;
};

export async function generateMetadata({ params }: PostLayoutProps): Promise<Metadata> {
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

const PostLayout: FC<PostLayoutProps> = ({ children }) => {
  return <main>{children}</main>;
};

export default PostLayout;
