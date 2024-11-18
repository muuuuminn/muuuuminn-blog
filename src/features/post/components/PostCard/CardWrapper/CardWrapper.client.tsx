import styles from "./CardWrapper.module.css";

import { Box } from "@/libs/radix/layout/Box";

import type { PostType } from "@/features/post/types";
import type { FC, ReactNode } from "react";

type CardWrapperProps = {
  post: PostType;
  children: ReactNode;
};

export const CardWrapper: FC<CardWrapperProps> = ({ children, post }) => {
  return (
    <Box asChild p="4" position="relative">
      <article className={styles.card} aria-labelledby={post.slug}>
        {children}
      </article>
    </Box>
  );
};
