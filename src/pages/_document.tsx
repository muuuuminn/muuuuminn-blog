// pages/_document.js

import { ColorModeScript } from "@chakra-ui/react";
import NextDocument, { Html, Head, Main, NextScript } from "next/document";

import theme from "@/libs/chakra/theme";

export default class Document extends NextDocument {
  render() {
    return (
      <Html lang="jp">
        <Head>
          <script async src="https://embed.zenn.studio/js/listen-embed-event.js"></script>
          <link rel="icon" href="/favicons/favicon.ico" sizes="any" />
          <link rel="icon" href="/favicons/icon.svg" type="image/svg+xml" />
          <link rel="apple-touch-icon" href="/favicons/apple-touch-icon.png" />
          <link rel="manifest" href="/favicons/site.webmanifest" />
        </Head>
        <body>
          <ColorModeScript initialColorMode={theme.config.initialColorMode} />
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
