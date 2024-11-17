import "./reset.css";
import "@radix-ui/themes/styles.css";
import "@/libs/radix/theme/accent.css";
import "@/libs/radix/theme/background.css";
import "@/libs/radix/theme/cursor.css";

import { FC, ReactNode } from "react";
import { Box, Theme } from "@radix-ui/themes";
import { Metadata } from "next";

import { getMetadata } from "@/libs/seo/metadata";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { GoogleTagManager } from "@/features/gtm/GoogleTagManger";
import { gtmId } from "@/features/gtm/constant";

import type { GoogleTagManagerIdType } from "@/features/gtm/type";
import generateRssFeed from "@/libs/rss/generateRSSFeed";

export const metadata: Metadata = getMetadata();

type RootLayoutProps = {
  children: ReactNode;
};

const RootLayout: FC<RootLayoutProps> = ({ children }) => {
  generateRssFeed();

  return (
    <html lang="ja">
      <head>
        <script
          async
          crossOrigin="anonymous"
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9104412012929052"
        ></script>
        <script async defer src="https://embed.zenn.studio/js/listen-embed-event.js"></script>
        <link href="/favicons/favicon.ico" rel="icon" sizes="any" />
        <link href="/favicons/icon.svg" rel="icon" type="image/svg+xml" />
        <link href="/favicons/apple-touch-icon.png" rel="apple-touch-icon" />
        <link href="/favicons/site.webmanifest" rel="manifest" />
      </head>
      <GoogleTagManager googleTagManagerId={gtmId as GoogleTagManagerIdType} />
      <body>
        <Theme appearance="dark" accentColor="red" radius="large">
          <Header />
          <Box pb="4" mb={"112px"}>
            {children}
          </Box>
          <Footer />
        </Theme>
      </body>
    </html>
  );
};

export default RootLayout;
