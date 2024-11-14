import type { FC } from "react";
import { memo } from "react";

import { Flex } from "@/libs/radix/layout/Container/Container";

import { Tag } from "./Tag";

import type { TagType } from "@/features/tag/types";
import type { FlexProps } from "@/libs/radix/layout/Container/Container";

type WrapTagListProps = FlexProps & {
  tags: TagType[];
  tagProps?: {
    shallow?: boolean;
    replace?: boolean;
  };
};

const _WrapTagList: FC<WrapTagListProps> = ({ tags, tagProps, ...boxProps }) => {
  return (
    <Flex gap={8} {...boxProps}>
      {tags.map((tag) => {
        return <Tag {...tagProps} key={tag.id} tag={tag} w={"min-content"} />;
      })}
    </Flex>
  );
};

export const WrapTagList = memo(_WrapTagList);
