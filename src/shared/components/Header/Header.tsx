import type { FC } from "react";
import { memo } from "react";
import { Heading, Link } from "@radix-ui/themes";

import { getDictionary } from "@/libs/i18n";
import { Flex } from "@/libs/radix/layout/Flex";
import { HStack } from "@/libs/radix/layout/Stack";
import { CustomNextLink } from "@/libs/next/CustomNextLink";

import { Logo } from "./Logo";
import styles from "./Header.module.css";

type HeaderProps = {};

export const Header: FC<HeaderProps> = memo(async function Header() {
  const d = await getDictionary();

  return (
    <header>
      <Flex py="2" align="center" justify="center" gap="2">
        <Link asChild underline="none" highContrast className={styles.link}>
          <CustomNextLink href="/posts">
            <HStack align="center" gap="2" px="2" py="1">
              <Logo />
              <Heading size="4">{d.SITE_NAME}</Heading>
            </HStack>
          </CustomNextLink>
        </Link>
      </Flex>
    </header>
  );
});
