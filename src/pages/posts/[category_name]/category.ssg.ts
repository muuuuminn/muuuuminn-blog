import { MASTER_CATEGORIES } from "@/features/category/constants";
import { MASTER_TAGS } from "@/features/tag/constants";
import { getAllPosts } from "@/libs/markdown/api";

import type { LocalesType } from "@/libs/i18n/types";
import type { GetStaticPathsContext } from "next";

type Params = {
  params: {
    category_name: string;
  };
  locale: LocalesType;
};

export function getStaticProps({ params, locale }: Params) {
  const posts = getAllPosts(
    ["title", "date", "slug", "coverImage", "description", "category", "tags"],
    locale,
  ).filter((post) => post.category.name.toLowerCase() === params.category_name);

  const selectedCategory = MASTER_CATEGORIES.find(
    (category) => category.name.toLowerCase() === params.category_name,
  );
  const filteredTags = MASTER_TAGS.filter((tag) => tag.categoryId === selectedCategory?.id);

  return {
    props: {
      posts,
      categories: MASTER_CATEGORIES,
      tags: filteredTags,
    },
  };
}

export function getStaticPaths({ locales }: GetStaticPathsContext) {
  const paths = locales?.flatMap((locale) => {
    return MASTER_CATEGORIES.map((category) => {
      return {
        params: {
          category_name: category.name.toLowerCase(),
        },
        locale,
      };
    });
  });

  return {
    paths: paths,
    fallback: false,
  };
}
