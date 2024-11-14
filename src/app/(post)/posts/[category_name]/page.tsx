import { MASTER_CATEGORIES } from "@/features/category/constants";
import { getDictionary } from "@/libs/i18n";
import { getAllPosts } from "@/libs/markdown/api";
import { getMetadata } from "@/libs/metadata";
import { Metadata } from "next";
import { FC } from "react";

type CategoryPageProps = {
  params: Promise<{
    category_name: string;
  }>;
  searchParams: Promise<{ tag: string }>;
};

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const d = await getDictionary();
  const categoryName = (await params).category_name;

  const metadata = getMetadata({
    title: `${categoryName.toUpperCase()} | ${d.PAGE.POSTS}`,
    description: d.DESCRIPTION.POSTS,
    path: `/posts/${categoryName}`,
  });

  return metadata;
}

export async function generateStaticParams() {
  return MASTER_CATEGORIES.map((category) => ({
    category_name: category.name,
  }));
}

const CategoryPage: FC<CategoryPageProps> = async ({ params }) => {
  const categoryName = (await params).category_name;

  const posts = getAllPosts([
    "title",
    "date",
    "slug",
    "coverImage",
    "description",
    "category",
    "tags",
  ]).filter((post) => post.category.name.toLowerCase() === categoryName);

  return <div>{JSON.stringify(posts)}</div>;
};

export default CategoryPage;
