"use client";

import styles from "./CategorySegmentControl.module.css";

import { Flex, Link } from "@radix-ui/themes";
import { useParams, usePathname } from "next/navigation";

import { MASTER_CATEGORIES } from "@/features/category/constants";
import type { CategoryType } from "@/features/category/types";
import { CustomNextLink } from "@/libs/next/CustomNextLink";

const getHref = (category: CategoryType) => {
  if (category.id === "-1") {
    return "/posts";
  }
  return `/posts/${category.name.toLowerCase()}`;
};

export const CategorySegmentControl = () => {
  const pathname = usePathname();
  const { category_name } = useParams<{ category_name: string | undefined }>();

  const categories: CategoryType[] = [
    { id: "-1", name: "All", color: "" },
    ...MASTER_CATEGORIES,
  ];

  const hereIsPostsPage = pathname.includes("posts");

  return (
    <Flex
      display={hereIsPostsPage ? "flex" : "none"}
      gap={{ initial: "2", sm: "1" }}
      align="center"
      justify="center"
      py="1"
      px="2"
      wrap="wrap"
      className={styles.segmentControlRoot}
    >
      {categories.map((category) => (
        <Link
          asChild
          key={category.id}
          color="red"
          highContrast
          size="3"
          underline="none"
          data-selected={
            category_name
              ? category.name.toLowerCase() === category_name
              : category.id === "-1"
          }
          className={styles.segmentControlItem}
        >
          <CustomNextLink href={getHref(category)}>
            {category.name}
          </CustomNextLink>
        </Link>
      ))}
    </Flex>
  );
};
