import { MASTER_CATEGORIES } from "@/features/category/constants";
import { MASTER_TAGS } from "@/features/tag/constants";
import { getAllPosts } from "@/libs/markdown/api";
import generateRssFeed from "@/libs/rss/generateRSSFeed";

import type { GetStaticProps, GetStaticPropsContext } from "next";

export const getStaticProps: GetStaticProps = (_context: GetStaticPropsContext) => {
  const posts = getAllPosts([
    "title",
    "date",
    "slug",
    "coverImage",
    "description",
    "category",
    "tags",
  ]);

  generateRssFeed();

  return {
    props: {
      posts,
      categories: MASTER_CATEGORIES,
      tags: MASTER_TAGS,
    },
  };
};
