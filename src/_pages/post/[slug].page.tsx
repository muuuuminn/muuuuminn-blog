import type { ReactElement } from "react";

export { getStaticPaths, getStaticProps } from "@/pages/post/post.ssg";
import { BaseLayout } from "@/shared/components";

import { Post } from "./Post";
import { PostLayout } from "./PostLayout";

import type { PostDetailType, PostListType } from "@/features/post/types";
import type { NextPageWithLayout } from "@/pages/_app.page";

type PostPageProps = {
  post: PostDetailType;
  relatedPosts: PostListType;
};

const PostPage: NextPageWithLayout<PostPageProps> = ({ post, relatedPosts }) => {
  return <Post post={post} relatedPosts={relatedPosts} />;
};

PostPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <BaseLayout>
      <PostLayout>{page}</PostLayout>
    </BaseLayout>
  );
};

export default PostPage;
