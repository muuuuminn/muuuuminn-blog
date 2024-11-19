import styles from "./Header.module.css";

import { Heading, Link } from "@radix-ui/themes";
import type { FC } from "react";

import { getDictionary } from "@/libs/i18n/getDictionary";
import { CustomNextLink } from "@/libs/next/CustomNextLink";
import { Flex } from "@/libs/radix/layout/Flex";
import { HStack } from "@/libs/radix/layout/Stack";
import { Logo } from "./Logo";

export const Header: FC = async () => {
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
};
