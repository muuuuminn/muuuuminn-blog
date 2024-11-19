/**
 * workaround: 本来export const dynamicParams = falseとして、ビルド時に生成されたpathのみアクセス可能にし、それ以外はnot-foundへ遷移させるべき。
 * しかしこれを設定すると、おそらくNext.js側の不具合で生成されたpathも含む[category_name]ページが全てnot-found扱いとなってしまう。
 * 現状の回避方法はdynamicParamsはデフォルト値(true)にし、ページ側でparams内のcategory_nameとマスターとなるcategoryを照合して遷移を分岐させている
 */

import { notFound } from "next/navigation";
import { Suspense } from "react";

import { MASTER_CATEGORIES } from "@/features/category/constants";
import { getDictionary } from "@/libs/i18n/getDictionary";
import { getAllPosts } from "@/libs/markdown/api";
import { getMetadata } from "@/libs/seo/metadata";
import FilteredPosts from "../FilteredPosts";

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

export async function generateStaticParams() {
  return MASTER_CATEGORIES.map((category) => ({
    category_name: category.name.toLowerCase(),
  }));
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const categoryName = (await params).category_name;

  const isNotMatchCategoryName =
    MASTER_CATEGORIES.findIndex(
      (category) => category.name.toLowerCase() === categoryName,
    ) !== -1;

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
      <Suspense fallback={<>loading...</>}>
        <FilteredPosts posts={filteredPosts} />
      </Suspense>
    </div>
  );
}
