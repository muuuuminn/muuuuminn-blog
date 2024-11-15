import { useRouter } from "next/router";
import type { FC } from "react";
import { memo, useCallback } from "react";

import { Select } from "@radix-ui/themes";

import { getDictionary } from "@/libs/i18n";
import { Flex } from "@/libs/radix/layout/Container/Container";
import { Text } from "@/libs/radix/typography/Text";

import type { TagType } from "@/features/tag/types";

type TagFilterProps = {
  tags: TagType[];
};

const _TagFilter: FC<TagFilterProps> = async ({ tags }) => {
  const d = await getDictionary();
  const router = useRouter();
  const categoryNameAsQuery = (router.query.category_name as string) || "";
  const tagNameAsQuery = (router.query.tag as string) || "";

  const onChange = useCallback(
    (e: string | null) => {
      // TODO: クエリ作成を関数化する
      const params = new URLSearchParams();
      const tagName = e;
      if (tagName) {
        params.append("tag", tagName);
      }
      const searchParams = params.toString();
      const urlSuffix = searchParams ? `/?${searchParams}` : "";

      if (categoryNameAsQuery) {
        void router.replace(`/posts/${categoryNameAsQuery}${urlSuffix}`, undefined, {
          shallow: true,
        });
      } else {
        void router.replace(`/posts${urlSuffix}`, undefined, { shallow: true });
      }
    },
    [router, categoryNameAsQuery],
  );

  return (
    <Flex align={"center"} gap={2}>
      <Select
        clearable
        data={[
          { value: "", label: d.COMPONENTS.TAG.PLACEHOLDER },
          ...tags.map((tag) => ({ value: tag.name, label: tag.name })),
        ]}
        onChange={onChange}
        placeholder={d.COMPONENTS.TAG.PLACEHOLDER}
        searchable
        styles={(theme) => ({
          fontSize: "16px",
          transform: "scale(0.8)",
          item: {
            // applies styles to selected item
            "&[data-selected]": {
              "&, &:hover": {
                color: theme.colorScheme === "dark" ? theme.black : theme.white,
              },
            },
          },
        })}
        value={tagNameAsQuery}
        w={"100%"}
      />
      <Text fz={"xs"} sx={{ flexShrink: 0 }}>
        {d.COMPONENTS.TAG.LABEL}
      </Text>
    </Flex>
  );
};

export const TagFilter = memo(_TagFilter);
