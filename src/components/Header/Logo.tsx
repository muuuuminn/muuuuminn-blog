import type { FC } from "react";
import { memo } from "react";

import { Box } from "@/libs/radix/layout/Box";
import { getDictionary } from "@/libs/i18n";
import { NextImage } from "@/libs/next/NextImage";

const RATIO = 1 / 0.689;

type LogoProps = {};

export const Logo: FC<LogoProps> = memo(async function Logo() {
  const d = await getDictionary();

  return (
    <Box
      style={{
        width: "40px",
        aspectRatio: RATIO.toString(),
        display: "block",
      }}
    >
      <NextImage
        alt={d.ALT.SITE_LOGO}
        quality={50}
        width={"40"}
        height={"40"}
        src={"/logo/logo_transparent_no_title.png"}
      />
    </Box>
  );
});
