import type { FC, ReactNode } from "react";

import { Badge } from "@mantine/core";

import { Text } from "@/libs/mantine/typography";
import { CustomNextLink } from "@/libs/next";

import type { CategoryType } from "@/features/category/types";
import type { BadgeProps } from "@mantine/core";

type CategoryProps = BadgeProps & {
  category: CategoryType;
  asLink?: boolean;
};

export const Category: FC<CategoryProps> = ({ category, asLink = false, ...rest }) => {
  return (
    <Wrapper asLink={asLink && !!category} href={`/posts/${category.name.toLowerCase()}`}>
      <Badge
        radius={"sm"}
        sx={() => ({
          width: "100px",
          maxWidth: "100%",
        })}
        variant={"outline"}
        {...rest}
      >
        <Text fz={"sm"} lineClamp={1}>
          {category.name}
        </Text>
      </Badge>
    </Wrapper>
  );
};

type WrapperProps = {
  children: ReactNode;
  asLink: boolean;
  href: string;
};

const Wrapper: FC<WrapperProps> = ({ children, href, asLink }) =>
  asLink ? (
    <CustomNextLink
      href={href}
      prefetch={false}
      shallow
      sx={{
        textDecoration: "none",
        ":hover": {
          textDecoration: "underline",
        },
      }}
    >
      {children}
    </CustomNextLink>
  ) : (
    <>{children}</>
  );
