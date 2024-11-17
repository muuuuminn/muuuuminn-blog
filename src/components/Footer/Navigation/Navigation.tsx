import { HomeIcon, MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { Button, Link } from "@radix-ui/themes";
import type { FC } from "react";

import { getDictionary } from "@/libs/i18n";
import { CustomNextLink } from "@/libs/next/CustomNextLink";
import { HStack } from "@/libs/radix/layout/Stack";
import styles from "./Navigation.module.css";

export const Navigation: FC = async () => {
  const d = await getDictionary();

  return (
    <HStack
      gap="9"
      align="center"
      justify="center"
      px="2"
      py="3"
      className={styles.navigation}
    >
      <Link asChild color="red" highContrast className={styles.navigationItem}>
        <CustomNextLink href="/posts">
          <HomeIcon width={24} height={24} />
        </CustomNextLink>
      </Link>

      <Button
        color="red"
        highContrast
        variant="ghost"
        className={styles.navigationItem}
      >
        <MagnifyingGlassIcon width={24} height={24} />
      </Button>
    </HStack>
  );
};
