import { useRouter } from "next/router";
import { FC, useCallback, useMemo } from "react";

import { CategoryType } from "@/features/category/types";
import { Box, BoxProps, HStack } from "@/libs/mantine/layout";
import { Text } from "@/libs/mantine/typography";
import { CustomNextLink } from "@/libs/next";

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
      <HStack noWrap sx={{ overflowX: "scroll" }}>
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
