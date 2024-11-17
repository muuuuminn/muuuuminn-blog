import { SITE_METADATA } from "@/libs/seo/metadata";

import type { PostDetailType } from "@/features/post/types";
import type { Article, WithContext } from "schema-dts";

export const getPostJsonLd = (post: PostDetailType) => {
  const jsonLd: WithContext<Article> = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    name: post.title,
    headline: post.title,
    image: post.ogImageUrl,
    thumbnailUrl: post.ogImageUrl,
    description: post.description,
    datePublished: post.date,
    dateModified: post.date,
    keywords: [post.category.name, ...post.tags.map((tag) => tag.name)],
    mainEntityOfPage: `${SITE_METADATA.APP_ROOT_URL}/post/${post.slug}`,
    url: `${SITE_METADATA.APP_ROOT_URL}/post/${post.slug}`,
    author: {
      "@type": "Person",
      "@id": "https://github.com/muuuuminn",
      name: "Hiroki Ohmi",
      url: "https://github.com/muuuuminn",
      image: {
        "@type": "ImageObject",
        "@id": "https://avatars.githubusercontent.com/u/38467746?v=4",
        url: "https://avatars.githubusercontent.com/u/38467746?v=4",
        height: "96",
        width: "96",
      },
    },
  };
  return JSON.stringify(jsonLd);
};
