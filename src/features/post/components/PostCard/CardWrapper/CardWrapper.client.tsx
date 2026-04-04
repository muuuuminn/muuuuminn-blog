import type { FC, ReactNode } from "react";
import type { PostType } from "@/features/post/types";
import { Box } from "@/libs/radix/layout/Box";
import styles from "./CardWrapper.module.css";

type CardWrapperProps = {
  post: Omit<PostType, "html">;
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
