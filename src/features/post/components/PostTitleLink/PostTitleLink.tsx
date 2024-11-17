import type { FC } from "react";
import { memo } from "react";

import { Heading, HeadingProps } from "@radix-ui/themes";
import { CustomNextLink } from "@/libs/next/CustomNextLink";

type PostTitleProps = {
  title: string;
  slug: string;
} & HeadingProps;

const _PostTitleLink: FC<PostTitleProps> = ({ title, slug, ...rest }) => {
  return (
    <Heading id={slug} as="h2" {...rest}>
      <CustomNextLink href={`/post/${slug}`} prefetch={false}>
        {title}
      </CustomNextLink>
    </Heading>
  );
};

export const PostTitleLink = memo(_PostTitleLink);
