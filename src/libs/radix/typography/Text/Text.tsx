import type { FC } from "react";

import { Text as _Text } from "@radix-ui/themes";

import type { TextProps as _TextProps } from "@radix-ui/themes";

export type TextProps = _TextProps;

export const Text: FC<TextProps> = (props) => {
  const { children, ...rest } = props;
  return <_Text {...rest}>{children}</_Text>;
};
