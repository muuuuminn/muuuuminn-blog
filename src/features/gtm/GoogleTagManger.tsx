import Script from "next/script";
import type { FC } from "react";

import type { GoogleTagManagerIdType } from "./type";

type GoogleTagManagerProps = {
  googleTagManagerId: GoogleTagManagerIdType;
};

export const GoogleTagManager: FC<GoogleTagManagerProps> = ({ googleTagManagerId }) => (
  <Script
    dangerouslySetInnerHTML={{
      __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${googleTagManagerId}');`,
    }}
    id="gtm"
    strategy="afterInteractive"
  />
);
