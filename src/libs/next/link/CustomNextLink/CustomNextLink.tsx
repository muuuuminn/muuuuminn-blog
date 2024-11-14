import type { LinkProps as OriginNextLinkProps } from "next/link";
import NextLink from "next/link";
import type { FC, ReactNode } from "react";

import { Box } from "@/libs/radix/layout/Container/Container";

import type { BoxProps } from "@/libs/radix/layout/Container/Container";
import type { UrlObject } from "url";

export type CustomNextLinkProps = OriginNextLinkProps;

const isExternalLink = (href: string | UrlObject): boolean => {
  if (typeof href !== "string") return false;
  return href.startsWith("http");
};

export const CustomNextLink: FC<OriginNextLinkProps & BoxProps & { children: ReactNode }> = (
  props,
) => {
  const { children, href, ...rest } = props;
  return (
    <Box
      component={NextLink}
      href={href}
      rel={isExternalLink(href) ? "nofollow noreferrer" : undefined}
      {...rest}
    >
      {children}
    </Box>
  );
};
