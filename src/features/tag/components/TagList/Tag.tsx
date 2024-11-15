import { useRouter } from "next/router";
import type { FC } from "react";
import { memo, useMemo } from "react";

import { Badge } from "@radix-ui/themes";

import { fireClickTagTrigger } from "@/features/gtm/eventTrigger";
import { CustomNextLink } from "@/libs/next";

import type { TagType } from "@/features/tag/types";
import type { CustomNextLinkProps } from "@/libs/next";
import type { BadgeProps } from "@radix-ui/themes";

type TagProps = Omit<CustomNextLinkProps, "href"> & {
  tag: TagType;
  className?: string;
} & BadgeProps;

const _Tag: FC<TagProps> = ({ tag, ...rest }) => {
  const router = useRouter();
  const categoryNameAsQuery = (router.query.category_name as string) || "";
  const href = useMemo(() => {
    // TODO: クエリ作成を関数化する
    const params = new URLSearchParams();
    params.append("tag", tag.name);
    const searchParams = params.toString();
    const urlSuffix = searchParams ? `/?${searchParams}` : "";

    if (categoryNameAsQuery) {
      return `/posts/${categoryNameAsQuery}${urlSuffix}`;
    } else {
      return `/posts${urlSuffix}`;
    }
  }, [categoryNameAsQuery, tag]);

  const hoverBackgroundColor = "#333333";

  return (
    <Badge
      {...rest}
      asChild
      // fz={"sm"}
      // px={8}
      size={"3"}
      // sx={(theme) => ({
      //   cursor: "pointer",
      //   "--var-badge-color": tag.color ? `#${tag.color}` : "currentcolor",
      //   fontWeight: "normal",
      //   color: theme.colorScheme === "dark" ? "white" : "black",
      //   textTransform: "none",
      //   ":hover": {
      //     textDecoration: "none",
      //     backgroundColor: tag.color ? `#${tag.color}2E` : hoverBackgroundColor,
      //   },
      // })}
      variant="outline"
    >
      <CustomNextLink prefetch={false} href={href} onClick={() => fireClickTagTrigger(tag)}>
        #{tag.name}
      </CustomNextLink>
    </Badge>
  );
};

export const Tag = memo(_Tag);
