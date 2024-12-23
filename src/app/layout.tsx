import "./reset.css";
import "@radix-ui/themes/styles.css";
import "@/libs/radix/theme/accent.css";
import "@/libs/radix/theme/background.css";
import "@/libs/radix/theme/cursor.css";
import "@/libs/radix/theme/token.css";
import { Theme } from "@radix-ui/themes";

import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
// import { GoogleTagManager } from "@/features/gtm/GoogleTagManger";
// import { gtmId } from "@/features/gtm/constant";
import { Box } from "@/libs/radix/layout/Box";
import { getMetadata } from "@/libs/seo/metadata";

// import type { GoogleTagManagerIdType } from "@/features/gtm/type";
import type { Metadata } from "next";
import type { FC, ReactNode } from "react";

/**
 * Footerの高さ(112px) + padding(20px)の合計
 */
const FOOTER_HEIGHT = "132px";

export const metadata: Metadata = getMetadata();

type RootLayoutProps = {
  children: ReactNode;
};

const RootLayout: FC<RootLayoutProps> = ({ children }) => {
  return (
    <html lang="ja">
      <head>
        <script
          async
          crossOrigin="anonymous"
          defer
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9104412012929052"
        />
        <script
          async
          defer
          src="https://embed.zenn.studio/js/listen-embed-event.js"
        />
        <link href="/favicons/favicon.ico" rel="icon" sizes="any" />
        <link href="/favicons/icon.svg" rel="icon" type="image/svg+xml" />
        <link href="/favicons/apple-touch-icon.png" rel="apple-touch-icon" />
        <link href="/favicons/site.webmanifest" rel="manifest" />
      </head>
      {/* <GoogleTagManager googleTagManagerId={gtmId as GoogleTagManagerIdType} /> */}
      <body>
        <Theme appearance="dark" accentColor="red" radius="large">
          <Header />
          <Box mx="auto" px="2" pt="4" pb={FOOTER_HEIGHT} maxWidth="690px">
            {children}
          </Box>
          <Footer />
        </Theme>
      </body>
    </html>
  );
};

export default RootLayout;
