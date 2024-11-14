import type { ImageProps, ImageLoaderProps } from "next/image";
import OriginNextImage from "next/image";
import { memo } from "react";

import { Box } from "@/libs/radix/layout/Container/Container";

import type { BoxProps } from "@/libs/radix/layout/Container/Container";

const myLoader = (resolverProps: ImageLoaderProps): string => {
  return `${resolverProps.src}?w=${resolverProps.width}&q=${resolverProps.quality || 70}`;
};

const shimmer = (w: number, h: number) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#333" offset="20%" />
      <stop stop-color="#222" offset="50%" />
      <stop stop-color="#333" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#333" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
</svg>`;

const toBase64 = (str: string) =>
  typeof window === "undefined" ? Buffer.from(str).toString("base64") : window.btoa(str);

type NextImageProps = {
  enableBlur?: boolean;
} & ImageProps &
  BoxProps;
const _NextImage = (props: NextImageProps) => {
  const { src, alt = "", width, quality, height, fill, enableBlur, ...rest } = props;
  return (
    <Box pos="relative" {...rest}>
      {src ? (
        <OriginNextImage
          alt={alt}
          blurDataURL={
            enableBlur ? `data:image/svg+xml;base64,${toBase64(shimmer(700, 475))}` : undefined
          }
          fill={fill}
          height={height}
          loader={myLoader}
          placeholder={enableBlur ? "blur" : undefined}
          quality={quality}
          src={src}
          style={{
            objectFit: "contain",
            transition: "all 0.01s",
          }}
          width={width}
        />
      ) : (
        <Box bg={"currentcolor"} h={height} w={width} />
      )}
    </Box>
  );
};

export const NextImage = memo(_NextImage);
