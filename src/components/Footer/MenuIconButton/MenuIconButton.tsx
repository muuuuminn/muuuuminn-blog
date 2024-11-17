import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import { Flex, IconButton, Link, Popover, Separator } from "@radix-ui/themes";

import { CustomNextLink } from "@/libs/next/CustomNextLink";
import { getDictionary } from "@/libs/i18n";
import { VStack } from "@/libs/radix/layout/Stack";
import { Text } from "@/libs/radix/typography/Text";

export const MenuIconButton = async () => {
  const d = await getDictionary();
  return (
    <Popover.Root>
      <Popover.Trigger>
        <IconButton color="red" highContrast radius="full" variant="outline">
          <HamburgerMenuIcon width={24} height={24} />
        </IconButton>
      </Popover.Trigger>
      <Popover.Content>
        <VStack gap="3">
          {MenuLinks.map((menuLink) =>
            menuLink.isNextLink ? (
              <Link key={menuLink.href} asChild color="gray" highContrast>
                <CustomNextLink href={menuLink.href} key={menuLink.name}>
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
    isNextLink: false,
    name: "WISH_LIST",
    href: "https://www.amazon.co.jp/-/en/hz/wishlist/ls/15U19H5XG5941",
    targetBlank: true,
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
