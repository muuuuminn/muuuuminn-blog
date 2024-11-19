"use client";

import styles from "./Tag.module.css";

import { Link } from "@radix-ui/themes";
import { useParams } from "next/navigation";
import { memo, useMemo } from "react";

import { CustomNextLink } from "@/libs/next/CustomNextLink";
import { Flex } from "@/libs/radix/layout/Flex";
import { Text } from "@/libs/radix/typography/Text";

import type { TagType } from "@/features/tag/types";
import type { FC } from "react";

type TagProps = {
  tag: TagType;
  onMouseDown?: () => void;
};

const _Tag: FC<TagProps> = ({ tag, onMouseDown }) => {
  const { category_name } = useParams<{ category_name: string | undefined }>();

  // タグへのリンクを計算
  const href = useMemo(() => {
    const params = new URLSearchParams();
    params.append("tag", tag.name);
    const searchParams = params.toString();
    const urlSuffix = searchParams ? `/?${searchParams}` : "";

    if (category_name) {
      return `/posts/${category_name.toLowerCase()}${urlSuffix}`; // カテゴリが指定されている場合
    }
    return `/posts${urlSuffix}`; // カテゴリが指定されていない場合
  }, [category_name, tag]);

  const tagColorCode = tag.color ? `#${tag.color}` : "#ccc";
  const cssVariables = {
    "--tag-color": `${tagColorCode}`,
  } as React.CSSProperties;

  return (
    <Link
      asChild
      underline="none"
      color="gray"
      highContrast
      style={cssVariables}
      className={styles.linkWrapper}
      onMouseDown={onMouseDown}
    >
      <CustomNextLink href={href}>
        <Flex py="1" px="2" height="20px" align="center" justify="center">
          <Text size="1">#{tag.name}</Text>
        </Flex>
      </CustomNextLink>
    </Link>
  );
};

export const Tag = memo(_Tag);
