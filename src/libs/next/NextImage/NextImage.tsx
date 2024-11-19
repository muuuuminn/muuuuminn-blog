import type { ImageProps } from "next/image";
import OriginNextImage from "next/image";
import { memo } from "react";

import { Box } from "@/libs/radix/layout/Box";

type NextImageProps = {
  enableBlur?: boolean;
} & ImageProps;

const _NextImage = (props: NextImageProps) => {
  const {
    src,
    alt = "",
    width,
    quality,
    height,
    fill,
    enableBlur,
    ...rest
  } = props;

  return src ? (
    <OriginNextImage
      alt={alt}
      fill={fill}
      height={height}
      width={width}
      placeholder={enableBlur ? "blur" : undefined}
      quality={quality}
      src={src}
      style={{
        width: "100%",
        height: "100%",
        objectFit: "contain",
        transition: "all 0.01s",
        borderRadius: "var(--radius-1)",
      }}
    />
  ) : (
    <Box
      style={{
        backgroundColor: "currentcolor",
        width: `${width}px`,
        height: `${height}px`,
      }}
    />
  );
};

export const NextImage = memo(_NextImage);
