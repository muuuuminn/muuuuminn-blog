import type { FC } from "react";
import { memo } from "react";

import { Text } from "@/libs/radix/typography/Text";
import { CustomNextLink } from "@/libs/next/CustomNextLink";

import type { PostType } from "@/features/post/types";

type PostTitleProps = {
  post: PostType;
};

const _PostTitleLink: FC<PostTitleProps> = ({ post }) => {
  return (
    <Text
      // fz={"lg"}
      weight={"bold"}
    >
      <CustomNextLink
        href={`/post/${post.slug}`}
        prefetch={false}
        // sx={(theme) => ({
        //   textDecoration: "none",
        //   color: theme.colorScheme === "dark" ? theme.white : theme.black,
        //   transitionProperty: "var(--transition-property-common)",
        //   transitionDuration: "var(--transition-duration-common)",
        //   background: "linear-gradient(currentColor 0 0) 0 100% /var(--d, 0) 1px no-repeat",
        //   "&:hover": {
        //     color: theme.colorScheme === "dark" ? "#fec8c8cc" : "#775f5fcc",
        //     "--d": "100%",
        //   },
        //   "&:visited": {
        //     color:
        //       theme.colorScheme === "dark"
        //         ? theme.colors["light-coral"][1]
        //         : theme.colors["light-coral"][8],
        //   },
        // })}
      >
        {post.title}
      </CustomNextLink>
    </Text>
  );
};

export const PostTitleLink = memo(_PostTitleLink);
