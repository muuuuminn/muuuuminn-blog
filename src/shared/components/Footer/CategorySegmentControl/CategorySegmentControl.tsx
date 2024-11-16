"use client";

import { Flex, Link } from "@radix-ui/themes";

import { CustomNextLink } from "@/libs/next/CustomNextLink";
import { MASTER_CATEGORIES } from "@/features/category/constants";
import { CategoryType } from "@/features/category/types";
import styles from "./CategorySegmentControl.module.css";
import { useParams } from "next/navigation";

export const CategorySegmentControl = () => {
  const { category_name } = useParams<{ category_name: string | undefined }>();

  const categories: CategoryType[] = [{ id: "-1", name: "All", color: "" }, ...MASTER_CATEGORIES];

  const getHref = (category: CategoryType) => {
    if (category.id === "-1") {
      return `/posts`;
    } else {
      return `/posts/${category.name.toLowerCase()}`;
    }
  };

  return (
    <Flex
      gap={{ initial: "2", sm: "1" }}
      align="center"
      justify="center"
      p="1"
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
            category_name ? category.name.toLowerCase() === category_name : category.id === "-1"
          }
          className={styles.segmentControlItem}
        >
          <CustomNextLink href={getHref(category)}>{category.name}</CustomNextLink>
        </Link>
      ))}
    </Flex>
  );
};
