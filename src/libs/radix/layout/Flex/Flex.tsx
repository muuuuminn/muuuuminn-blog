import { forwardRef } from "react";

import { Flex as _Flex } from "@radix-ui/themes";

import type { FlexProps as _FlexProps } from "@radix-ui/themes";

export type FlexProps = _FlexProps;

export const Flex = forwardRef<HTMLDivElement, FlexProps>((props, ref) => {
  const { children, ...rest } = props;
  return (
    <_Flex {...rest} ref={ref}>
      {children}
    </_Flex>
  );
});
