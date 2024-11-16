import type { FC } from "react";

import { Box } from "@radix-ui/themes";

import { VStack } from "@/libs/radix/layout/Stack";
import { CategorySegmentControl } from "./CategorySegmentControl";
import { Navigation } from "./Navigation";
import { MenuIconButton } from "./MenuIconButton";

export const Footer: FC = () => {
  return (
    <footer>
      <VStack position="fixed" bottom="0" width="100%" gap="2">
        <CategorySegmentControl />
        <Navigation />
        <Box position="absolute" right="4" bottom="4">
          <MenuIconButton />
        </Box>
      </VStack>
    </footer>
  );
};
