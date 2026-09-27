import { notFound } from "next/navigation";
import { MASTER_CATEGORIES } from "@/features/category/constants";
import { MASTER_TAGS } from "@/features/tag/constants";
import postsData from "./posts.generated.json";

const POST_FIELDS = [
  "title",
  "date",
  "slug",
  "html",
  "ogImageUrl",
  "coverImage",
  "description",
  "category",
  "tags",
] as const;

type PostField = (typeof POST_FIELDS)[number];
type Category = (typeof MASTER_CATEGORIES)[number];
type Tag = (typeof MASTER_TAGS)[number];

type GeneratedPost = {
  slug: string;
  title: string;
  date: string;
  ogImageUrl: string;
  coverImage: string;
  description: string;
  category: string;
  tags: string[];
  html: string;
};

type RuntimePost = {
  title: string;
  date: string;
  slug: string;
  html: string;
  ogImageUrl: string;
  coverImage: string;
  description: string;
  category: Category;
  tags: Tag[];
};

type PickPost<T extends readonly PostField[]> = {
  [K in T[number]]: RuntimePost[K];
};

const FALLBACK_CATEGORY: Category = {
  id: "-1",
  name: "Other",
  color: "#c9c9c9",
};

function shapePost(post: GeneratedPost): RuntimePost {
  const category =
    MASTER_CATEGORIES.find((item) => item.id === post.category) ??
    FALLBACK_CATEGORY;
  const tags = [...new Set(post.tags)]
    .map((tagId) => MASTER_TAGS.find((item) => item.id === tagId))
    .filter((tag): tag is Tag => tag !== undefined);

  return {
    title: post.title,
    date: post.date,
    slug: post.slug,
    html: post.html,
    ogImageUrl: post.ogImageUrl,
    coverImage: post.coverImage,
    description: post.description,
    category,
    tags,
  };
}

function pickFields<T extends readonly PostField[]>(
  post: RuntimePost,
  fields: T,
): PickPost<T> {
  return Object.fromEntries(
    fields.map((field) => [field, post[field]]),
  ) as PickPost<T>;
}

const runtimePosts = (postsData as GeneratedPost[]).map(shapePost);

export function getPostSlugs(): string[] {
  return runtimePosts.map((post) => post.slug);
}

export function getPostBySlug<T extends readonly PostField[]>(
  slug: string,
  fields: T,
): PickPost<T> {
  const post = runtimePosts.find((item) => item.slug === slug);

  if (!post) {
    notFound();
  }

  return pickFields(post, fields);
}

export function getAllPosts<T extends readonly PostField[]>(
  fields: T,
): Array<PickPost<T>> {
  return runtimePosts.map((post) => pickFields(post, fields));
}
