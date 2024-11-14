import type { FC } from "react";
import { memo } from "react";

import {
  em,
  getBreakpointValue,
  Title,
  useMantineColorScheme,
  useMantineTheme,
} from "@radix-ui/themes";
import { useMediaQuery } from "@mantine/hooks";

import { useTranslation } from "@/libs/i18n";
import { Flex, HStack } from "@/libs/radix/layout/Container/Container";
import { Text } from "@/libs/mantine/typography";
import { CustomNextLink } from "@/libs/next";

import { Logo } from "./Logo";
import { MenuDrawer } from "./MenuDrawer";
import { ToggleAppearanceButton } from "./ToggleAppearanceButton";

import type { FlexProps } from "@/libs/radix/layout/Container/Container";

type HeaderProps = FlexProps;

// TODO: PCのレイアウトも用意する
export const Header: FC<HeaderProps> = memo(function _header() {
  const { t } = useTranslation();
  const { colorScheme } = useMantineColorScheme();
  const { breakpoints } = useMantineTheme();
  const largerThanSm = useMediaQuery(`(min-width: ${em(getBreakpointValue(breakpoints.sm))})`);

  return (
    <Flex align={"center"} component={"header"} justify={"space-between"} py={16}>
      <CustomNextLink
        href={"/posts"}
        p={8}
        prefetch={false}
        sx={{
          textDecoration: "none",
          borderRadius: "0.75rem",
          "&:hover": {
            textDecoration: "none",
            backgroundColor: "#fec8c82e",
          },
        }}
      >
        <Flex align={"center"} gap={8}>
          <Logo />
          <Text
            color={colorScheme === "dark" ? "#fec8c8" : "#473a39"}
            fz={largerThanSm ? "lg" : "sm"}
            weight={"bolder"}
          >
            {t.SITE_NAME}
          </Text>
        </Flex>
        <Title hidden>{t.SITE_NAME}</Title>
      </CustomNextLink>
      <HStack>
        <ToggleAppearanceButton />
        <MenuDrawer />
      </HStack>
    </Flex>
  );
});
