"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

import { Box } from "@/libs/radix/layout/Box";

export const AdSense: React.FC = () => {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname) {
      try {
        window.adsbygoogle = window.adsbygoogle || [];
        window.adsbygoogle.push({});
      } catch (err) {
        console.log({ AdSenseCmpError: err });
      }
    }
  }, [pathname]);

  return (
    <Box key={pathname}>
      <ins
        className="adsbygoogle"
        data-ad-client="ca-pub-9104412012929052"
        data-ad-format="autorelaxed"
        data-ad-slot="4647394274"
        data-adtest={process.env.NODE_ENV === "production" ? "off" : "on"}
        style={{ display: "block" }}
      />
    </Box>
  );
};
