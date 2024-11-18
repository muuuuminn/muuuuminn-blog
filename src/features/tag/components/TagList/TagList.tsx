import { memo } from "react";

import { Flex } from "@/libs/radix/layout/Flex";
import { Tag } from "./Tag/Tag";

import type { TagType } from "@/features/tag/types";
import type { FC } from "react";

type TagListProps = {
  tags: TagType[];
};

const _TagList: FC<TagListProps> = ({ tags }) => {
  return (
    <Flex gap="1" wrap="wrap">
      {tags.map((tag) => (
        <Tag key={tag.id} tag={tag} />
      ))}
    </Flex>
  );
};

export const TagList = memo(_TagList);
