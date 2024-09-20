import { BIZ_UDPGothic } from "next/font/google";
import type { FC } from "react";

import { em, getBreakpointValue, SimpleGrid, useMantineTheme } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";

import { Box } from "@/libs/mantine/layout";

import { Footer } from "./Footer";
import { Header } from "./Header";

import type { SimpleGridProps } from "@mantine/core";

type BaseLayoutProps = SimpleGridProps;

const font = BIZ_UDPGothic({ weight: "400", subsets: ["latin"] });

export const BaseLayout: FC<BaseLayoutProps> = (props) => {
  const { children } = props;
  const { breakpoints } = useMantineTheme();
  const largerThanSm = useMediaQuery(`(min-width: ${em(getBreakpointValue(breakpoints.sm))})`);

  return (
    <SimpleGrid
      className={font.className}
      cols={1}
      maw={"690px"}
      mx={"auto"}
      px={largerThanSm ? 8 : 4}
      sx={{
        minHeight: "100vh",
        "&": {
          minHeight: "100svh",
        },
        gridTemplateRows: "auto 1fr auto",
      }}
    >
      {/* TODO: 下スクロールで消す */}
      {/* TODO: headerとbodyのマージンを少し離してもいいかも */}
      <Header />
      <Box component={"main"}>{children}</Box>
      {/* TODO: 何かのきっかけをトリガーに消せたら消す */}
      <Footer />
    </SimpleGrid>
  );
};
