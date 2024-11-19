import NextLink from "next/link";

import type { UrlObject } from "node:url";
import type { LinkProps as OriginNextLinkProps } from "next/link";
import type { FC, ReactNode } from "react";

export type CustomNextLinkProps = OriginNextLinkProps;

const isExternalLink = (href: string | UrlObject): boolean => {
  if (typeof href !== "string") return false;
  return href.startsWith("http");
};

export const CustomNextLink: FC<
  OriginNextLinkProps & { children: ReactNode }
> = (props) => {
  const { children, href, ...rest } = props;
  return (
    <NextLink
      href={href}
      rel={isExternalLink(href) ? "nofollow noreferrer" : undefined}
      prefetch={false}
      {...rest}
    >
      {children}
    </NextLink>
  );
};
