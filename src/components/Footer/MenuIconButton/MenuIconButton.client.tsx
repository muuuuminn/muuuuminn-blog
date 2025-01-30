"use client";

import styles from "./MenuIconButton.module.css";

import { Cross2Icon, HamburgerMenuIcon } from "@radix-ui/react-icons";
import { Flex, IconButton, Link, Popover, Separator } from "@radix-ui/themes";

import { useDictionary } from "@/libs/i18n/useDictionary";
import { CustomNextLink } from "@/libs/next/CustomNextLink";
import { VStack } from "@/libs/radix/layout/Stack";
import { Text } from "@/libs/radix/typography/Text";
import { useState } from "react";

export const MenuIconButton = () => {
  const { d } = useDictionary();
  const [open, setOpen] = useState(false);

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger>
        <IconButton
          color="red"
          highContrast
          radius="full"
          variant="outline"
          aria-label="メニューを表示する"
        >
          <HamburgerMenuIcon width={24} height={24} />
        </IconButton>
      </Popover.Trigger>
      <Popover.Content>
        <Popover.Close className={styles.closeIconButton}>
          <IconButton aria-label="Close" variant="ghost">
            <Cross2Icon />
          </IconButton>
        </Popover.Close>
        <VStack gap="3">
          {MenuLinks.map((menuLink) =>
            menuLink.isNextLink ? (
              <Link
                key={menuLink.href}
                asChild
                color="gray"
                highContrast
                onClick={() => setOpen(false)}
              >
                <CustomNextLink
                  href={menuLink.href}
                  key={menuLink.name}
                  prefetch
                >
                  {d.PAGE[menuLink.name]}
                </CustomNextLink>
              </Link>
            ) : (
              <Link
                key={menuLink.href}
                color="gray"
                highContrast
                href={menuLink.href}
                target={menuLink.targetBlank ? "_blank" : undefined}
                onClick={() => setOpen(false)}
              >
                {d.PAGE[menuLink.name]}
              </Link>
            ),
          )}
          <Separator size="4" />
          <Flex align="center" direction="column" py="1">
            <Text size="1">{d.COPYRIGHT}</Text>
          </Flex>
        </VStack>
      </Popover.Content>
    </Popover.Root>
  );
};

const MenuLinks = [
  {
    isNextLink: true,
    name: "POSTS",
    href: "/posts",
    targetBlank: false,
  },
  {
    isNextLink: true,
    name: "RESUME",
    href: "/resume",
    targetBlank: false,
  },
  {
    isNextLink: true,
    name: "POLICY",
    href: "/policy",
    targetBlank: false,
  },
  {
    isNextLink: false,
    name: "CONTACT",
    href: "https://docs.google.com/forms/d/e/1FAIpQLSeXNfr1rEd0Cf_55yIlk2mOjrC4Rs00gA5jw0POoQ7pQOPo7A/viewform",
    targetBlank: true,
  },
  {
    isNextLink: true,
    name: "RSS",
    href: "/rss.xml",
    targetBlank: false,
  },
] as const;
