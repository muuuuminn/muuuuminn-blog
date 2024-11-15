import { useRouter } from "next/router";
import { useEffect } from "react";

import { Box } from "@/libs/radix/layout/Box";

export const AdSense: React.FC = () => {
  const { asPath } = useRouter();
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.log({ AdSenseCmpError: err });
    }
  }, [asPath]);

  if (asPath === "/policy") {
    return null;
  }

  return (
    <Box key={asPath}>
      <ins
        className="adsbygoogle"
        data-ad-client="ca-pub-9104412012929052"
        data-ad-format="autorelaxed"
        data-ad-slot="4647394274"
        data-adtest={process.env.NODE_ENV === "production" ? "off" : "on"}
        style={{ display: "block" }}
      ></ins>
    </Box>
  );
};
