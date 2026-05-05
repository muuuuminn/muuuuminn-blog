import type { CategoryType } from "@/features/category/types";
import type { TagType } from "@/features/tag/types";

export type PostType = {
  html: string;
  title: string;
  slug: string;
  date: string;
  coverImage: string;
  description: string;
  category: CategoryType;
  tags: TagType[];
};

export type PostListType = PostType[];

export type PostDetailType = {
  ogImageUrl: string;
} & PostType;
