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
}

const _PostThumbnail: FC<PostThumbnailProps> = ({
  src,
  imageQuality = 50,
  sizeSet = { width: 100, height: 100 },
  enableBlur,
  alt = "",
  ...rest
}) => {
  return (
    <NextImage
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
