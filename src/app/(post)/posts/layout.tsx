import { FC, ReactNode } from "react";

type PostsLayoutProps = {
  children: ReactNode;
};

const PostsLayout: FC<PostsLayoutProps> = ({ children }) => {
  return <main>{children}</main>;
};

export default PostsLayout;
