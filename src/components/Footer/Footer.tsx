import { Box } from "@radix-ui/themes";
import type { FC } from "react";

import { VStack } from "@/libs/radix/layout/Stack";
import { CategorySegmentControl } from "./CategorySegmentControl";
import { MenuIconButton } from "./MenuIconButton";
import { Navigation } from "./Navigation";

export const Footer: FC = () => {
  return (
    <footer>
      <VStack position="お" bottom="0" width="100%" gap="2">
        <CategorySegmentControl />
        <Navigation />
        <Box position="absolute" right="4" bottom="4">
          <MenuIconButton />
        </Box>
      </VStack>
    </footer>
  );
};
