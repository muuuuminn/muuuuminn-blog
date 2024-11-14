import type { FC } from "react";

import { useTranslation } from "@/libs/i18n";
import { Box, Flex } from "@/libs/radix/layout/Container/Container";
import { Text } from "@/libs/mantine/typography";
import { CustomNextLink } from "@/libs/next/link/CustomNextLink";

import type { FlexProps } from "@/libs/radix/layout/Container/Container";

type FooterProps = FlexProps;

export const Footer: FC<FooterProps> = () => {
  const { t } = useTranslation();
  return (
    <Flex align={"center"} component={"footer"} direction={"column"} py={"1"}>
      <Box
        component={CustomNextLink}
        href={"/policy"}
        prefetch={false}
        sx={{
          textDecoration: "none",
          ":hover": {
            textDecoration: "underline",
          },
        }}
      >
        <Text color={"gray"} fz={"sm"} weight={"bold"}>
          {t.PAGE.POLICY}
        </Text>
      </Box>
      <Text color={"gray"} fz={"xs"}>
        {t.COPYRIGHT}
      </Text>
    </Flex>
  );
};
