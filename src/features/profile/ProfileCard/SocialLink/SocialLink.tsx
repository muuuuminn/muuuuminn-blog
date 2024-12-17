import { Link } from "@radix-ui/themes";
import type { FC } from "react";

import { CustomNextLink } from "@/libs/next/CustomNextLink";
import { HStack } from "@/libs/radix/layout/Stack";
import { Text } from "@/libs/radix/typography/Text";

type SocialLinkProps = {
  href: string;
  icon: React.ReactNode;
  title: string;
};

export const SocialLink: FC<SocialLinkProps> = ({ href, icon, title }) => {
  return (
    <Link asChild target="_blank" highContrast>
      <CustomNextLink href={href}>
        <HStack gap="1">
          {icon}
          <Text>{title}</Text>
        </HStack>
      </CustomNextLink>
    </Link>
  );
};
