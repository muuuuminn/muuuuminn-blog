import NextDocument, { Html, Head, Main, NextScript } from "next/document";

import { createGetInitialProps } from "@mantine/next";

// eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment
const getInitialProps = createGetInitialProps();

export default class Document extends NextDocument {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  static getInitialProps = getInitialProps;

  render() {
    return (
      <Html lang="ja">
        <Head>
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
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
