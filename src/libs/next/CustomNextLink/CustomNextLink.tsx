import type { LinkProps as OriginNextLinkProps } from "next/link";
import NextLink from "next/link";
import type { FC, ReactNode } from "react";

import type { UrlObject } from "url";

export type CustomNextLinkProps = OriginNextLinkProps;

const isExternalLink = (href: string | UrlObject): boolean => {
  if (typeof href !== "string") return false;
  return href.startsWith("http");
};

export const CustomNextLink: FC<OriginNextLinkProps & { children: ReactNode }> = (props) => {
  const { children, href, ...rest } = props;
  return (
    <NextLink href={href} rel={isExternalLink(href) ? "nofollow noreferrer" : undefined} {...rest}>
      {children}
    </NextLink>
  );
};
