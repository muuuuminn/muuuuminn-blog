import { type FC, memo } from "react";

import { getDictionary } from "@/libs/i18n/getDictionary";
import { NextImage } from "@/libs/next/NextImage";
import { Box } from "@/libs/radix/layout/Box";

const RATIO = 1 / 0.689;

export const Logo: FC = memo(async function Logo() {
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
