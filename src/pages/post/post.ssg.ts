import { getRelatedPosts } from "@/features/related-posts/utils/getRelatedPosts";
import { getPostBySlug, getAllPosts } from "@/libs/markdown/api";
import markdownToHtml from "@/libs/markdown/markdownToHtml";

import type { LocalesType } from "@/libs/i18n/types";
import type { GetStaticPathsContext } from "next";

type Params = {
  params: {
    slug: string;
  };
  locale: LocalesType;
};

export function getStaticProps({ params, locale }: Params) {
  const post = getPostBySlug(
    params.slug,
    [
      "title",
      "date",
      "slug",
      "content",
      "ogImageUrl",
      "coverImage",
      "description",
      "category",
      "tags",
    ],
    locale,
  );
  const content = markdownToHtml(post.content || "");

  const posts = getAllPosts(
    ["title", "date", "slug", "coverImage", "description", "category", "tags"],
    locale,
  );
  const relatedPosts = getRelatedPosts(posts, {
    category: post.category,
    tags: post.tags,
    tagMatchLevel: 2,
    limit: 5,
    excludeSlug: post.slug,
  });

  return {
    props: {
      post: {
        ...post,
        content,
      },
      relatedPosts,
    },
  };
}

export function getStaticPaths({ locales }: GetStaticPathsContext) {
  const posts = getAllPosts(["slug", "date"], "ja");

  const paths = locales?.flatMap((locale) => {
    return posts.map((post) => {
      return {
        params: {
          slug: post.slug,
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
