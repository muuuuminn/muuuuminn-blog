import { forwardRef } from "react";

import { Box as _Box } from "@radix-ui/themes";

import type { BoxProps as _BoxProps } from "@radix-ui/themes";

export type BoxProps = _BoxProps;

export const Box = forwardRef<HTMLDivElement, BoxProps>((props, ref) => {
  const { children, ...rest } = props;
  return (
    <_Box {...rest} ref={ref}>
      {children}
    </_Box>
  );
});
