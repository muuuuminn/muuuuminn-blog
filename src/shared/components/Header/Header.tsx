import { Heading, Text } from "@chakra-ui/react";
import { FC, memo } from "react";

import { Flex, FlexProps, HStack, Spacer } from "@/libs/chakra";
import { useTranslation } from "@/libs/i18n";
import { CustomNextLink } from "@/libs/next";

import { HeaderMenu } from "./HeaderMenu";
import { Logo } from "./Logo";
import { ToggleAppearanceButton } from "./ToggleAppearanceButton";

type HeaderProps = FlexProps;

export const Header: FC<HeaderProps> = memo(function _header() {
  const { t } = useTranslation();

  return (
    <Flex alignItems={"center"} paddingX={{ base: 2, md: 4 }}>
      <CustomNextLink href={"/posts"}>
        <Logo />
        <Heading hidden>{t.SITE_NAME}</Heading>
      </CustomNextLink>
      <Spacer />
      <HStack>
        <ToggleAppearanceButton />
        <HeaderMenu />
      </HStack>
    </Flex>
  );
});
