import { Badge } from "@radix-ui/themes";

import { Text } from "@/libs/radix/typography/Text";
import { CustomNextLink } from "@/libs/next/CustomNextLink";
import { VisuallyHiddenElement } from "@/components/VisuallyHiddenElement";

import type { FC } from "react";
import type { CategoryType } from "@/features/category/types";
import type { BadgeProps } from "@radix-ui/themes";

type CategoryProps = BadgeProps & {
  category: CategoryType;
};

export const Category: FC<CategoryProps> = ({ category }) => {
  return (
    <CustomNextLink href={`/posts/${category.name.toLowerCase()}`} prefetch={false}>
      <VisuallyHiddenElement>カテゴリ：</VisuallyHiddenElement>
      <Badge
        style={{
          width: "100px",
          maxWidth: "100%",
        }}
        variant={"outline"}
        highContrast
      >
        <Text size={"2"} mx="auto">
          {category.name.toUpperCase()}
        </Text>
      </Badge>
    </CustomNextLink>
  );
};
