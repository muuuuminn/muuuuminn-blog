import Link from "next/link";

import { Menu, ActionIcon, em, getBreakpointValue, useMantineTheme } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";

import { useTranslation } from "@/libs/i18n";

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

export const MenuDrawer = () => {
  const { t } = useTranslation();
  const { breakpoints } = useMantineTheme();
  const largerThanSm = useMediaQuery(`(min-width: ${em(getBreakpointValue(breakpoints.sm))})`);

  return (
    <Menu offset={4} position="bottom-end" shadow="md" width={200} withArrow>
      <Menu.Target>
        <ActionIcon aria-label={t.ARIA_LABEL.MENU_BUTTON} size="lg">
          <HamburgerMenuIcon />
        </ActionIcon>
      </Menu.Target>
      <Menu.Dropdown>
        {MenuLinks.map((menuLink) =>
          menuLink.isNextLink ? (
            // workaround: next/linkのラッパーコンポーネントを使うとhoverのスタイルで不具合が起きるため、直接Linkを使う
            <Menu.Item
              component={Link}
              fw={"bold"}
              fz={largerThanSm ? "md" : "sm"}
              href={menuLink.href}
              key={menuLink.name}
            >
              {t.PAGE[menuLink.name]}
            </Menu.Item>
          ) : (
            <Menu.Item
              component="a"
              fw={"bold"}
              fz={largerThanSm ? "md" : "sm"}
              href={menuLink.href}
              key={menuLink.name}
              target={menuLink.targetBlank ? "_blank" : undefined}
            >
              {t.PAGE[menuLink.name]}
            </Menu.Item>
          ),
        )}
      </Menu.Dropdown>
    </Menu>
  );
};
