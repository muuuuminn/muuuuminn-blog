import type { FC } from "react";
import { useCallback, useEffect, useMemo, useRef, useState, memo } from "react";

import { createStyles } from "@radix-ui/themes";

import { Box, Flex } from "@/libs/radix/layout/Container/Container";

import { Tag } from "./Tag";
import { TagMenu } from "./TagMenu";

import type { TagType } from "@/features/tag/types";
import type { FlexProps } from "@/libs/radix/layout/Container/Container";

type NoWrapTagListProps = FlexProps & {
  tags: TagType[];
  tagProps?: {
    shallow?: boolean;
    replace?: boolean;
  };
};

const useStyles = createStyles(() => ({
  tagWrapper: {
    flexShrink: 0,
    cursor: "pointer",
  },
  tag: {
    visibility: "hidden",
    "&[data-visibility='true']": {
      visibility: "visible",
    },
  },
}));

const _NoWrapTagList: FC<NoWrapTagListProps> = ({ tags, tagProps, ...flexProps }) => {
  const { classes } = useStyles();
  const childrenWrapper = useRef<HTMLDivElement>(null);
  const [visibilityMap, setVisibilityMap] = useState<Record<string, boolean>>({});

  const lastVisibleTagIndex = useMemo(
    () => Object.values(visibilityMap).findIndex((v) => !v) - 1,
    [visibilityMap],
  );

  const invisibleTags = useMemo(() => {
    const invisibleTags = [...tags.filter((tag) => !visibilityMap[tag.id])];
    return [tags[lastVisibleTagIndex], ...invisibleTags];
  }, [tags, visibilityMap, lastVisibleTagIndex]);

  const handleIntersection = useCallback((entries: IntersectionObserverEntry[]) => {
    const updatedEntries: Record<string, boolean> = {};
    entries.forEach((entry) => {
      if (entry.target) {
        const targetId = (entry.target as HTMLElement).dataset.id || "";
        if (entry.isIntersecting) {
          updatedEntries[targetId] = true;
        } else {
          updatedEntries[targetId] = false;
        }
      }
    });
    setVisibilityMap((prev) => ({
      ...prev,
      ...updatedEntries,
    }));
  }, []);

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
    <Flex gap={8} ref={childrenWrapper} w={"max-content"} {...flexProps}>
      {tags.map((tag, index) => {
        const isVisibleTag = visibilityMap[tag.id];
        return (
          <Box
            className={classes.tagWrapper}
            data-id={tag.id}
            h={24}
            key={tag.id}
            // タグがひとつであれば、省略せずに全表示する
            w={tags.length === 1 ? "100%" : "90px"}
          >
            {index === lastVisibleTagIndex ? (
              <TagMenu countsOfTagInMenu={invisibleTags.length} tags={invisibleTags} />
            ) : (
              <Tag className={classes.tag} data-visibility={isVisibleTag} tag={tag} {...tagProps} />
            )}
          </Box>
        );
      })}
    </Flex>
  );
};

export const NoWrapTagList = memo(_NoWrapTagList);
