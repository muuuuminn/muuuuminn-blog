import type { TextProps } from "@radix-ui/themes";
import type { FC } from "react";
import { memo } from "react";
import { Text } from "@/libs/radix/typography/Text";

type PostTitleProps = {
  title: string;
  slug: string;
} & TextProps;

const _PostTitle: FC<PostTitleProps> = ({ title, slug, ...rest }) => {
  return (
    <Text
      id={slug}
      // biome-ignore lint/a11y/useSemanticElements: <explanation>
      role="heading"
      aria-level={2}
      weight="bold"
      wrap="pretty"
      {...rest}
    >
      {title}
    </Text>
  );
};

export const PostTitle = memo(_PostTitle);
