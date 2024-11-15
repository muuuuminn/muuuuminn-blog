import "server-only";

const APP_ROOT_URL = process.env.NEXT_PUBLIC_APP_ROOT_URL || "";

export const SITE_METADATA = {
  APP_ROOT_URL,
  TITLE: "muuuuminn blog",
  DESCRIPTION: "",
  APPLICATION_NAME: "muuuuminn blog",
  SITE_NAME: "muuuuminn blog",
  LOGO_PATH: "/logo/logo_transparent.png",
  AUTHOR: {
    URL: "https://github.com/muuuuminn",
    NAME: "Hiroki Ogmi",
  },
  TWITTER: {
    CARD: "summary",
    HANDLE: "@4ho_v",
  },
  FACEBOOK_APP_ID: "475650504470227",
} as const;

const TITLE_SUFFIX = " | muuuuminn blog";

export const OG_IMAGE_EXTENSION_TYPE = "image/png";

export const getMetadata = (
  option?: Partial<{
    title: string;
    description: string;
    path: string;
    ogImage: {
      url: string;
      alt: string;
      type: string;
    };
    openGraphType: "website" | "article";
    article: {
      publishedTime: string;
      section: string;
      tags: string[];
    };
  }>,
) => {
  const {
    title = SITE_METADATA.TITLE,
    description = SITE_METADATA.DESCRIPTION,
    path,
    ogImage = {
      alt: `${title}のサムネイル`,
      url: `${SITE_METADATA.APP_ROOT_URL}${SITE_METADATA.LOGO_PATH}`,
      type: OG_IMAGE_EXTENSION_TYPE,
    },
    openGraphType = "website",
    article,
  } = option || {};

  const pageUrl = SITE_METADATA.APP_ROOT_URL + path;

  return {
    metadataBase: new URL(SITE_METADATA.APP_ROOT_URL),
    title: `${title}${TITLE_SUFFIX}`,
    description: SITE_METADATA.DESCRIPTION,
    applicationName: SITE_METADATA.APPLICATION_NAME,
    openGraph: {
      type: openGraphType,
      url: pageUrl,
      siteName: SITE_METADATA.SITE_NAME,
      title,
      description,
      images: [ogImage],
      ...(openGraphType === "article"
        ? {
            ...article,
            authors: [SITE_METADATA.AUTHOR.URL],
          }
        : {}),
    },
    authors: {
      url: SITE_METADATA.AUTHOR.URL,
      name: SITE_METADATA.AUTHOR.NAME,
    },
    twitter: {
      card: SITE_METADATA.TWITTER.CARD,
      site: SITE_METADATA.TWITTER.HANDLE,
      creator: SITE_METADATA.TWITTER.HANDLE,
    },
    facebook: {
      appId: SITE_METADATA.FACEBOOK_APP_ID,
    },
    formatDetection: {
      telephone: false,
      email: false,
      address: false,
    },
  };
};
