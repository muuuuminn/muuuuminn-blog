"use client";

import { useParams } from "next/navigation";
import type { FC } from "react";
import { memo, useMemo } from "react";

import { Box } from "@/libs/radix/layout/Box";
import { Text } from "@/libs/radix/typography/Text";
import { CustomNextLink } from "@/libs/next/CustomNextLink";

import type { TagType } from "@/features/tag/types";
import type { CustomNextLinkProps } from "@/libs/next/CustomNextLink";
import type { ComponentProps } from "react";
import { Link } from "@radix-ui/themes";

type TagProps = Omit<CustomNextLinkProps, "href"> & {
  tag: TagType;
  className?: string;
} & ComponentProps<typeof Box>;

const _Tag: FC<TagProps> = ({ tag, className, ...rest }) => {
  const { category_name } = useParams<{ category_name: string | undefined }>();

  // タグへのリンクを計算
  const href = useMemo(() => {
    const params = new URLSearchParams();
    params.append("tag", tag.name);
    const searchParams = params.toString();
    const urlSuffix = searchParams ? `/?${searchParams}` : "";

    if (category_name) {
      return `/posts/${category_name.toLowerCase()}${urlSuffix}`; // カテゴリが指定されている場合
    } else {
      return `/posts${urlSuffix}`; // カテゴリが指定されていない場合
    }
  }, [category_name, tag]);

  // ホバー時のスタイルをJavaScriptで追加
  const baseStyle = {
    border: `1px solid ${tag.color ? `#${tag.color}` : "#ccc"}`,
    borderRadius: "var(--radius-6)",
    backgroundColor: "transparent",
    transition: "background-color 0.3s ease, color 0.3s ease",
  };

  const hoverStyle = {
    backgroundColor: tag.color ? `#${tag.color}2E` : "#f5f5f5",
  };

  return (
    <Box
      display={"inline-block"}
      py="1"
      px="2"
      className={className}
      {...rest}
      style={baseStyle}
      onMouseEnter={(e) => {
        Object.assign(e.currentTarget.style, hoverStyle);
      }}
      onMouseLeave={(e) => {
        Object.assign(e.currentTarget.style, baseStyle);
      }}
    >
      <Link asChild underline="none" color="gray" highContrast>
        <CustomNextLink prefetch={false} href={href}>
          <Text as="span" size="1">
            #{tag.name}
          </Text>
        </CustomNextLink>
      </Link>
    </Box>
  );
};

export const Tag = memo(_Tag);
