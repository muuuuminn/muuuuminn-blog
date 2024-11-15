import type { FC, ReactNode } from "react";

import { Badge } from "@radix-ui/themes";

import { Text } from "@/libs/radix/typography/Text";
import { CustomNextLink } from "@/libs/next/CustomNextLink";

import type { CategoryType } from "@/features/category/types";
import type { BadgeProps } from "@radix-ui/themes";

type CategoryProps = BadgeProps & {
  category: CategoryType;
  asLink?: boolean;
};

export const Category: FC<CategoryProps> = ({ category, asLink = false, ...rest }) => {
  return (
    <Wrapper asLink={asLink && !!category} href={`/posts/${category.name.toLowerCase()}`}>
      <Badge
        style={{
          width: "100px",
          maxWidth: "100%",
        }}
        variant={"outline"}
        {...rest}
      >
        <Text size={"2"} truncate>
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
      // style={{
      //   textDecoration: "none",
      //   ":hover": {
      //     textDecoration: "underline",
      //   },
      // }}
    >
      {children}
    </CustomNextLink>
  ) : (
    <>{children}</>
  );
