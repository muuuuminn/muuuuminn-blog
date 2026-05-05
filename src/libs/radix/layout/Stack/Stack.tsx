import type { FlexProps } from "@radix-ui/themes";

import { Flex } from "@radix-ui/themes";
import { forwardRef } from "react";

export type VStackProps = FlexProps;

export const VStack = forwardRef<HTMLDivElement, VStackProps>((props, ref) => {
  const { children, ...rest } = props;
  return (
    <Flex {...rest} ref={ref} direction="column">
      {children}
    </Flex>
  );
});

export type HStackProps = FlexProps;

export const HStack = forwardRef<HTMLDivElement, HStackProps>((props, ref) => {
  const { children, ...rest } = props;
  return (
    <Flex {...rest} ref={ref} direction="row">
      {children}
    </Flex>
  );
});
