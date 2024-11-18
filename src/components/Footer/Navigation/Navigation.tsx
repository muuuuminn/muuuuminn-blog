import styles from "./Navigation.module.css";

import { HomeIcon } from "@radix-ui/react-icons";
import { Link } from "@radix-ui/themes";
import type { FC } from "react";

import { CustomNextLink } from "@/libs/next/CustomNextLink";
import { HStack } from "@/libs/radix/layout/Stack";
import { TagSearchButton } from "./TagSearchButton";

export const Navigation: FC = () => {
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

      <TagSearchButton />
    </HStack>
  );
};
