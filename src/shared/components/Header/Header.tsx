import type { FC } from "react";
import { memo } from "react";
import { Heading } from "@radix-ui/themes";
import Link from "next/link";

import { Box } from "@/libs/radix/layout/Box";
import { Flex } from "@/libs/radix/layout/Flex";
import { Text } from "@/libs/radix/typography/Text";
import { getDictionary } from "@/libs/i18n";
import { Logo } from "./Logo";
// import { MenuDrawer } from "./MenuDrawer";

type HeaderProps = {};

export const Header: FC<HeaderProps> = memo(async function Header() {
  const d = await getDictionary();

  return (
    <Flex align="center" asChild justify="between" py="16">
      <header>
        <Box
          asChild
          style={{
            padding: "8px",
            textDecoration: "none",
            borderRadius: "0.75rem",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            backgroundColor: "transparent",
            transition: "background-color 0.2s ease",
          }}
          // onMouseEnter={(e) => {
          //   (e.currentTarget as HTMLElement).style.backgroundColor = "#fec8c82e";
          // }}
          // onMouseLeave={(e) => {
          //   (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
          // }}
        >
          <Link href="/posts">
            <Logo />
            <Text color="red" weight="bold">
              {d.SITE_NAME}
            </Text>
            <Heading hidden>{d.SITE_NAME}</Heading>
          </Link>
        </Box>
      </header>
    </Flex>
  );
});
