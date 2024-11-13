import { getRelatedPosts } from "@/features/related-posts/utils/getRelatedPosts";
import { getPostBySlug, getAllPosts } from "@/libs/markdown/api";
import markdownToHtml from "@/libs/markdown/markdownToHtml";

type Params = {
  params: {
    slug: string;
  };
};

export function getStaticProps({ params }: Params) {
  const post = getPostBySlug(params.slug, [
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
  const content = markdownToHtml(post.content || "");

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

export function getStaticPaths() {
  const posts = getAllPosts(["slug", "date"]);

  const paths = posts.map((post) => {
    return {
      params: {
        slug: post.slug,
      },
    };
  });

  paths.push(...paths.map((p) => ({ ...p, locale: "en" })));

  return {
    paths: paths,
    fallback: false,
  };
}
