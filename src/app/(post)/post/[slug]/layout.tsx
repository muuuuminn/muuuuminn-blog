import { notFound } from "next/navigation";

import { getDictionary } from "@/libs/i18n/getDictionary";
import { getPostBySlug } from "@/libs/markdown/api";
import {
  OG_IMAGE_EXTENSION_TYPE,
  SITE_METADATA,
  getMetadata,
} from "@/libs/seo/metadata";

import type { Metadata } from "next";
import type { FC, ReactNode } from "react";

type PostLayoutProps = {
  params: Promise<{
    slug: string;
  }>;
  children: ReactNode;
};

export async function generateMetadata({
  params,
}: PostLayoutProps): Promise<Metadata> {
  const d = await getDictionary();
  const slug = (await params).slug;
  const post = await getPostBySlug(slug, [
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
