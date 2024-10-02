import { MASTER_CATEGORIES } from "@/features/category/constants";
import { MASTER_TAGS } from "@/features/tag/constants";
import { getAllPosts } from "@/libs/markdown/api";
import generateRssFeed from "@/libs/rss/generateRSSFeed";

import type { LocalesType } from "@/libs/i18n/types";
import type {} from "next";

export const getStaticProps = ({ locale }: { locale: LocalesType }) => {
  const posts = getAllPosts(
    ["title", "date", "slug", "coverImage", "description", "category", "tags"],
    locale,
  );

  generateRssFeed(locale);

  return {
    props: {
      posts,
      categories: MASTER_CATEGORIES,
      tags: MASTER_TAGS,
    },
  };
};
