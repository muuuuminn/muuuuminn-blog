import type { FC } from "react";
import { memo } from "react";

import { AspectRatio, createStyles, useMantineColorScheme } from "@radix-ui/themes";

import { useTranslation } from "@/libs/i18n";
import { NextImage } from "@/libs/next";

const RATIO = 1 / 0.689;

const useStyles = createStyles((theme) => ({
  aspectRatio: {
    borderRadius: "xl",
    width: "40px",
    [theme.fn.largerThan("sm")]: {
      width: "60px",
    },
  },
}));

type LogoProps = {};

export const Logo: FC<LogoProps> = memo(function _logo() {
  const { t } = useTranslation();
  const { colorScheme } = useMantineColorScheme();
  const { classes } = useStyles();

  return (
    <>
      <AspectRatio className={classes.aspectRatio} hidden={colorScheme === "dark"} ratio={RATIO}>
        <NextImage
          alt={t.ALT.SITE_LOGO}
          fill
          quality={50}
          src={"/logo/logo_transparent_reverse_no_title.png"}
        />
      </AspectRatio>
      <AspectRatio className={classes.aspectRatio} hidden={colorScheme === "light"} ratio={RATIO}>
        <NextImage
          alt={t.ALT.SITE_LOGO}
          fill
          quality={50}
          src={"/logo/logo_transparent_no_title.png"}
        />
      </AspectRatio>
    </>
  );
});
