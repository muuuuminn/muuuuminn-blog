export const dynamicParams = false;

import { notFound } from "next/navigation";

import { MASTER_CATEGORIES } from "@/features/category/constants";
import { getDictionary } from "@/libs/i18n/getDictionary";
import { getAllPosts } from "@/libs/markdown/api";
import { getMetadata } from "@/libs/seo/metadata";
import FilteredPosts from "../FilteredPosts";

import { SuspenseLoader } from "@/components/SuspenseLoader";
import type { Metadata } from "next";

type CategoryPageProps = {
  params: Promise<{
    category_name: string;
  }>;
};

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const d = await getDictionary();
  const categoryName = (await params).category_name;

  const metadata = getMetadata({
    title: `${categoryName.toUpperCase()} | ${d.PAGE.POSTS}`,
    description: d.DESCRIPTION.POSTS,
    path: `/posts/${categoryName}`,
  });

  return metadata;
}

export const generateStaticParams = async () => {
  return MASTER_CATEGORIES.map((category) => ({
    category_name: category.name.toLowerCase(),
  }));
};

export default async function CategoryPage({ params }: CategoryPageProps) {
  const categoryName = (await params).category_name;

  const isNotMatchCategoryName =
    MASTER_CATEGORIES.findIndex(
      (category) => category.name.toLowerCase() === categoryName,
    ) === -1;

  if (isNotMatchCategoryName) {
    return notFound();
  }

  const filteredPosts = getAllPosts([
    "title",
    "date",
    "slug",
    "coverImage",
    "description",
    "category",
    "tags",
  ]).filter((post) => post.category.name.toLowerCase() === categoryName);

  return (
    <div>
      <SuspenseLoader>
        <FilteredPosts posts={filteredPosts} />
      </SuspenseLoader>
    </div>
  );
}
