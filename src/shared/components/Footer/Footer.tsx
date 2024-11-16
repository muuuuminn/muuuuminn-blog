import type { FC } from "react";

import { CustomNextLink } from "@/libs/next/CustomNextLink";
import { getDictionary } from "@/libs/i18n";
import { Flex } from "@/libs/radix/layout/Flex";
import { Text } from "@/libs/radix/typography/Text";
import { Link } from "@radix-ui/themes";

type FooterProps = {};

export const Footer: FC<FooterProps> = async () => {
  const d = await getDictionary();

  return (
    <footer>
      <Flex align="center" direction="column" py="1">
        <Link asChild underline="none">
          <CustomNextLink href="/policy">
            <Text weight="bold" size="2">
              {d.PAGE.POLICY}
            </Text>
          </CustomNextLink>
        </Link>
        <Text size="1">{d.COPYRIGHT}</Text>
      </Flex>
    </footer>
  );
};
