import { MASTER_CATEGORIES } from "@/features/category/constants";
import { PostCardList } from "@/features/post/components/PostCardList";
import { MASTER_TAGS } from "@/features/tag/constants";
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

const CategoryPage: FC<CategoryPageProps> = async ({ params, searchParams }) => {
  const categoryName = (await params).category_name;
  const tagNameAsQuery = (await searchParams).tag;

  const selectedCategory = MASTER_CATEGORIES.find(
    (category) => category.name.toLowerCase() === categoryName,
  );
  const selectedTag = MASTER_TAGS.find(
    (tag) => tag.name === tagNameAsQuery && tag.categoryId === selectedCategory?.id,
  );

  const filteredPosts = getAllPosts([
    "title",
    "date",
    "slug",
    "coverImage",
    "description",
    "category",
    "tags",
  ]).filter((post) => {
    const isCategoryMatch = post.category.name.toLowerCase() === categoryName;
    if (selectedTag) {
      const isTagMatch = post.tags.some((tag) => tag.name === selectedTag.name);
      return isCategoryMatch && isTagMatch;
    }
    return isCategoryMatch;
  });

  return (
    <div>
      <PostCardList posts={filteredPosts} />
    </div>
  );
};

export default CategoryPage;
