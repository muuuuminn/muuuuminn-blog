"use client";

import type { FC } from "react";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";

import { Box } from "@/libs/radix/layout/Box";
import { Flex } from "@/libs/radix/layout/Flex";
import { Tag } from "./Tag";
import { TagMenu } from "./TagMenu";

import type { TagType } from "@/features/tag/types";
import type { ComponentProps } from "react";

type NoWrapTagListProps = ComponentProps<typeof Flex> & {
  tags: TagType[];
  tagProps?: {
    shallow?: boolean;
    replace?: boolean;
  };
};

const _NoWrapTagList: FC<NoWrapTagListProps> = ({
  tags,
  tagProps,
  ...flexProps
}) => {
  const childrenWrapper = useRef<HTMLDivElement>(null);
  const [visibilityMap, setVisibilityMap] = useState<Record<string, boolean>>(
    {},
  );

  const lastVisibleTagIndex = useMemo(
    () => Object.values(visibilityMap).findIndex((v) => !v) - 1,
    [visibilityMap],
  );

  const invisibleTags = useMemo(() => {
    const invisibleTags = [...tags.filter((tag) => !visibilityMap[tag.id])];
    return [tags[lastVisibleTagIndex], ...invisibleTags];
  }, [tags, visibilityMap, lastVisibleTagIndex]);

  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const updatedEntries: Record<string, boolean> = {};
      entries.forEach((entry) => {
        const targetId = (entry.target as HTMLElement).dataset.id || "";
        updatedEntries[targetId] = entry.isIntersecting;
      });
      setVisibilityMap((prev) => ({
        ...prev,
        ...updatedEntries,
      }));
    },
    [],
  );

  useEffect(() => {
    const observer = new IntersectionObserver(handleIntersection, {
      threshold: 1,
    });
    if (childrenWrapper.current) {
      Array.from(childrenWrapper.current.children).forEach((item) => {
        observer.observe(item);
      });
    }
    return () => observer.disconnect();
  }, [handleIntersection]);

  return (
    <Flex
      ref={childrenWrapper}
      gap="8px"
      style={{ width: "max-content" }}
      {...flexProps}
    >
      {tags.map((tag, index) => {
        const isVisibleTag = visibilityMap[tag.id];
        return (
          <Box
            key={tag.id}
            data-id={tag.id}
            style={{
              flexShrink: 0,
              cursor: "pointer",
              height: "24px",
              width: tags.length === 1 ? "100%" : "90px",
            }}
          >
            {/* {index === lastVisibleTagIndex ? (
              <TagMenu countsOfTagInMenu={invisibleTags.length} tags={invisibleTags} />
            ) : (
              <Tag
                data-visibility={isVisibleTag}
                style={{ visibility: isVisibleTag ? "visible" : "hidden" }}
                tag={tag}
                {...tagProps}
              />
            )} */}
          </Box>
        );
      })}
    </Flex>
  );
};

export const NoWrapTagList = memo(_NoWrapTagList);
