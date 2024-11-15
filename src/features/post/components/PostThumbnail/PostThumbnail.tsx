import type { FC } from "react";
import { memo } from "react";

import { NextImage } from "@/libs/next/NextImage";

interface PostThumbnailProps {
  src: string;
  imageQuality?: number;
  sizeSet?: {
    width: number;
    height: number;
  };
  enableBlur?: boolean;
  alt: string;
  // objectFit?: "cover" | "contain";
}

const _PostThumbnail: FC<PostThumbnailProps> = ({
  src,
  imageQuality,
  sizeSet = { width: 100, height: 100 },
  enableBlur,
  alt = "",
  // ratio = 1 / 1,
  ...rest
}) => {
  return (
    <NextImage
      // borderRadius={"xl"}
      alt={alt}
      // enableBlur={enableBlur}
      quality={imageQuality}
      src={src}
      style={{
        borderRadius: "10px",
      }}
      {...sizeSet}
    />
  );
};

export const PostThumbnail = memo(_PostThumbnail);
