import type { AppProps } from "next/app";
import Head from "next/head";
import type { ReactElement, ReactNode } from "react";

import { GoogleTagManager } from "@/features/gtm/components";
import { gtmId } from "@/features/gtm/constants/gtmId";
import { MantineProvider } from "@/libs/mantine/provider";

import type { GoogleTagManagerIdType } from "@/features/gtm/types";
import type { NextPage } from "next";

import "zenn-content-css";
import "../libs/markdown/prism-override-style.css";

// eslint-disable-next-line @typescript-eslint/ban-types
export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout<{}>;
  pageProps: {};
};

function MyApp({ Component, pageProps }: AppPropsWithLayout): JSX.Element {
  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <>
      <Head>
        <meta content="minimum-scale=1, initial-scale=1, width=device-width" name="viewport" />
      </Head>
      <GoogleTagManager googleTagManagerId={gtmId as GoogleTagManagerIdType} />

      <MantineProvider>{getLayout(<Component {...pageProps} />)}</MantineProvider>
    </>
  );
}

export default MyApp;
