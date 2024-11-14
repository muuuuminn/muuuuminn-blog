import type { FC } from "react";
import Link from "next/link";

import { getDictionary } from "@/libs/i18n";
import { Box } from "@/libs/radix/layout/Box";
import { Flex } from "@/libs/radix/layout/Flex";
import { Text } from "@/libs/radix/typography/Text";

type FooterProps = React.ComponentProps<typeof Flex>;

export const Footer: FC<FooterProps> = async () => {
  const d = await getDictionary();

  return (
    <Flex align="center" asChild direction="column" py="1">
      <footer>
        <Box asChild>
          <Link href="/policy" passHref>
            <Text
              style={{
                color: "var(--color-gray)",
                fontSize: "var(--font-size-sm)",
                fontWeight: "bold",
                textDecoration: "none",
                transition: "text-decoration 0.2s ease",
              }}
              // onMouseEnter={(e) => {
              //   (e.currentTarget as HTMLElement).style.textDecoration = "underline";
              // }}
              // onMouseLeave={(e) => {
              //   (e.currentTarget as HTMLElement).style.textDecoration = "none";
              // }}
            >
              {d.PAGE.POLICY}
            </Text>
          </Link>
        </Box>
        <Text style={{ color: "var(--color-gray)", fontSize: "var(--font-size-xs)" }}>
          {d.COPYRIGHT}
        </Text>
      </footer>
    </Flex>
  );
};
