import { useRouter } from "next/router";
import type { FC, ReactNode } from "react";

import { CategoryTabs } from "@/features/category/components";
import { TagFilter } from "@/features/tag/components";
import { useTranslation } from "@/libs/i18n";
import { Flex } from "@/libs/mantine/layout";
import { BasicSeo } from "@/shared/components";

import type { CategoryType } from "@/features/category/types";
import type { TagType } from "@/features/tag/types";
import type { BasicSeoProps } from "@/shared/components";

type PostsLayoutProps = {
  children: ReactNode;
  categories: CategoryType[];
  tags: TagType[];
};

export const PostsLayout: FC<PostsLayoutProps> = ({ children, categories, tags }) => {
  const router = useRouter();
  const { t } = useTranslation();

  const categoryNameAsQuery = (router.query.category_name as string) || "";

  const title = categoryNameAsQuery
    ? `${categoryNameAsQuery.toUpperCase()} | ${t.PAGE.POSTS}`
    : t.PAGE.POSTS;
  const seo: BasicSeoProps = {
    title,
    description: t.DESCRIPTION.POSTS,
    path: categoryNameAsQuery ? `/posts/${categoryNameAsQuery}` : "/posts",
  };

  return (
    <>
      <BasicSeo {...seo} />
      <Flex direction={"column"} gap={8} h={"100%"}>
        <CategoryTabs categories={categories} />
        <TagFilter tags={tags} />
        {children}
      </Flex>
    </>
  );
};
