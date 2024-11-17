import { Container as _Container } from "@radix-ui/themes";

import type { ContainerProps as _ContainerProps } from "@radix-ui/themes";
import type { FC, ReactNode } from "react";

type ContainerProps = {
  children: ReactNode;
} & _ContainerProps;

export const Container: FC<ContainerProps> = (props) => {
  const { children, ...rest } = props;
  return <_Container {...rest}>{children}</_Container>;
};
