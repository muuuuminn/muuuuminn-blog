import { useRouter } from "next/router";
import type { FC } from "react";
import { useCallback, useMemo } from "react";

import { Box, HStack } from "@/libs/radix/layout/Container/Container";
import { Text } from "@/libs/radix/typography/Text";
import { CustomNextLink } from "@/libs/next";

import type { CategoryType } from "@/features/category/types";
import type { BoxProps } from "@/libs/radix/layout/Container/Container";

type CategoryTabsProps = BoxProps & {
  categories: CategoryType[];
};

export const CategoryTabs: FC<CategoryTabsProps> = ({ categories }) => {
  const router = useRouter();
  const categoryNameAsQuery = (router.query.category_name as string) || "";

  const tabList = useMemo(
    () => [{ id: "-1", name: "All", color: "" }, ...categories],
    [categories],
  );

  const getHref = useCallback((tab: CategoryType) => {
    if (tab.id === "-1") {
      return `/posts`;
    } else {
      return `/posts/${tab.name.toLowerCase()}`;
    }
  }, []);

  return (
    <Box>
      <HStack wrap={"nowrap"} overflowX={"scroll"}>
        {tabList.map((tab) => (
          <Box
            data-selected={
              categoryNameAsQuery ? tab.name.toLowerCase() === categoryNameAsQuery : tab.id === "-1"
            }
            id={`${tab.id}`}
            key={tab.id}
            sx={(theme) => ({
              borderBottom: "2px solid transparent",
              transition: "0.2s",
              "&[data-selected='true']": {
                borderColor: theme.colorScheme === "dark" ? "#fec8c8" : "#473a39",
              },
              "&:hover": {
                borderColor: theme.colorScheme === "dark" ? "#fec8c82e" : "#473a392e",
              },
            })}
          >
            <CustomNextLink
              href={getHref(tab)}
              key={tab.id}
              px={16}
              py={8}
              sx={{
                display: "block",
                textDecoration: "none",
                ":hover": {
                  textDecoration: "none",
                },
              }}
            >
              <Text color={"gray"}>{tab.name}</Text>
            </CustomNextLink>
          </Box>
        ))}
      </HStack>
    </Box>
  );
};
