import { Box, type BoxProps } from "@radix-ui/themes";
import type { FC } from "react";
import styles from "./VisuallyHiddenElement.module.css";

type Props = BoxProps;

export const VisuallyHiddenElement: FC<Props> = (props) => {
  const { children, as = "span", ...rest } = props;
  return (
    <Box className={styles.visuallyHidden} as={as} {...rest}>
      {children}
    </Box>
  );
};
