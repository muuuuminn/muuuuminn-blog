import { FC, ReactNode } from "react";

type PostLayoutProps = {
  params: Promise<{
    slug: string;
  }>;
  children: ReactNode;
};

const PostLayout: FC<PostLayoutProps> = ({ children }) => {
  return <main>{children}</main>;
};

export default PostLayout;
