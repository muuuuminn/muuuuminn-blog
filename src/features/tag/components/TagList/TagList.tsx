import { memo } from "react";

import { Flex, type FlexProps } from "@/libs/radix/layout/Flex";
import { Tag } from "./Tag";

import type { TagType } from "@/features/tag/types";
import type { FC } from "react";

type TagListProps = {
  tags: TagType[];
} & FlexProps;

const _TagList: FC<TagListProps> = ({ tags, ...rest }) => {
  return (
    <Flex gap="1" wrap="wrap" {...rest}>
      {tags.map((tag) => (
        <Tag key={tag.id} tag={tag} />
      ))}
    </Flex>
  );
};

export const TagList = memo(_TagList);
