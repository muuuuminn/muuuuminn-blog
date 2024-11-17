import { memo } from "react";

import { Flex } from "@/libs/radix/layout/Flex";
import { Tag } from "./Tag";

import type { TagType } from "@/features/tag/types";
import type { FC } from "react";
import type { ComponentProps } from "react";

type WrapTagListProps = ComponentProps<typeof Flex> & {
  tags: TagType[];
  tagProps?: {
    shallow?: boolean;
    replace?: boolean;
  };
};

const _WrapTagList: FC<WrapTagListProps> = ({
  tags,
  tagProps,
  ...flexProps
}) => {
  return (
    <Flex gap="2" wrap="wrap" {...flexProps}>
      {tags.map((tag) => (
        <Tag
          {...tagProps}
          key={tag.id}
          tag={tag}
          style={{ width: "min-content" }}
        />
      ))}
    </Flex>
  );
};

export const WrapTagList = memo(_WrapTagList);
