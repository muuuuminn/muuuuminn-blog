import { MASTER_CATEGORIES } from "@/features/category/constants";
import { MASTER_TAGS } from "@/features/tag/constants";
import { getAllPosts } from "@/libs/markdown/api";

type Params = {
  params: {
    category_name: string;
  };
};

export function getStaticProps({ params }: Params) {
  const posts = getAllPosts([
    "title",
    "date",
    "slug",
    "coverImage",
    "description",
    "category",
    "tags",
  ]).filter((post) => post.category.name.toLowerCase() === params.category_name);

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

export function getStaticPaths() {
  const paths = MASTER_CATEGORIES.map((category) => {
    return {
      params: {
        category_name: category.name.toLowerCase(),
      },
    };
  });

  paths.push(...paths.map((p) => ({ ...p, locale: "en" })));

  return {
    paths: paths,
    fallback: false,
  };
}
