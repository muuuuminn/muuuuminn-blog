import styles from "./Navigation.module.css";

import { HomeIcon } from "@radix-ui/react-icons";
import { Button, Link } from "@radix-ui/themes";
import type { FC } from "react";

import { CustomNextLink } from "@/libs/next/CustomNextLink";
import { HStack } from "@/libs/radix/layout/Stack";
import { Text } from "@/libs/radix/typography/Text";
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
      <Button
        asChild
        color="red"
        highContrast
        variant="ghost"
        className={styles.navigationItem}
        aria-label="トップページへ移動する"
      >
        <CustomNextLink href="/posts" prefetch>
          <HomeIcon width={24} height={24} />
          <Text>トップ</Text>
        </CustomNextLink>
      </Button>

      <TagSearchButton />
    </HStack>
  );
};
