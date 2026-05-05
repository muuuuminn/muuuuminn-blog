import type { TextProps as _TextProps } from "@radix-ui/themes";
import { Text as _Text } from "@radix-ui/themes";
import type { FC } from "react";

export type TextProps = _TextProps;

export const Text: FC<TextProps> = (props) => {
  const { children, ...rest } = props;
  return <_Text {...rest}>{children}</_Text>;
};
