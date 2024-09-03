import type { FC } from "react";

import { NextSeo } from "next-seo";

import type { NextSeoProps } from "next-seo";
import type { OpenGraphArticle, OpenGraphMedia } from "next-seo/lib/types";

export type BasicSeoProps = {
  path: string;
  ogImage?: OpenGraphMedia;
  noTitleTemplate?: boolean;
  noindexAndFollow?: boolean;
} & NextSeoProps;

export const BasicSeo: FC<BasicSeoProps> = (props) => {
  const APP_ROOT_URL = process.env.NEXT_PUBLIC_APP_ROOT_URL || "";
  const {
    path,
    title = "",
    description,
    ogImage = {
      alt: `${title}のサムネイル`,
      url: `${APP_ROOT_URL}/logo/logo_transparent.png`,
      type: "image/png",
    },
    noindexAndFollow,
  } = props;

  const pageUrl = APP_ROOT_URL + path;

  return (
    <NextSeo
      canonical={pageUrl}
      defaultTitle="muuuuminn blog"
      description={description}
      facebook={{
        appId: "475650504470227",
      }}
      nofollow={noindexAndFollow}
      noindex={noindexAndFollow}
      openGraph={{
        type: "website",
        url: pageUrl,
        title,
        description,
        images: [ogImage],
      }}
      title={title}
      titleTemplate={"%s | muuuuminn blog"}
      twitter={{
        cardType: "summary",
        site: "@4ho_v",
      }}
    />
  );
};

export type ArticleSeoProps = {
  path: string;
  ogImage?: OpenGraphMedia;
  noTitleTemplate?: boolean;
  noindexAndFollow?: boolean;
  articleOgp?: OpenGraphArticle;
} & NextSeoProps;

export const ArticleSeo: FC<ArticleSeoProps> = (props) => {
  const APP_ROOT_URL = process.env.NEXT_PUBLIC_APP_ROOT_URL || "";
  const {
    path,
    title = "",
    description,
    ogImage = {
      alt: `${title}のサムネイル`,
      url: `${APP_ROOT_URL}/logo/logo_transparent.png`,
      type: "image/png",
    },
    noindexAndFollow,
    articleOgp,
  } = props;

  const pageUrl = APP_ROOT_URL + path;

  return (
    <NextSeo
      canonical={pageUrl}
      defaultTitle="muuuuminn blog"
      description={description}
      facebook={{
        appId: "475650504470227",
      }}
      nofollow={noindexAndFollow}
      noindex={noindexAndFollow}
      openGraph={{
        type: "article",
        title,
        description,
        url: pageUrl,
        article: {
          ...articleOgp,
          authors: ["https://twitter.com/4ho_v"],
        },
        images: [ogImage],
      }}
      title={title}
      titleTemplate={"%s | muuuuminn blog"}
      twitter={{
        cardType: "summary",
        site: "@4ho_v",
      }}
    />
  );
};
