import type { ReactElement } from "react";

export { getStaticProps } from "@/pages/posts/posts.ssg";
import { BaseLayout } from "@/shared/components";

import { Posts } from "./Posts";
import { PostsLayout } from "./PostsLayout";

import type { CategoryType } from "@/features/category/types";
import type { PostListType } from "@/features/post/types";
import type { TagType } from "@/features/tag/types";
import type { NextPageWithLayout } from "@/pages/_app.page";

type PostsPageProps = {
  posts: PostListType;
  categories: CategoryType[];
  tags: TagType[];
};

const PostsPage: NextPageWithLayout<PostsPageProps> = (props) => {
  return (
    <>
      <Posts {...props} />
    </>
  );
};

PostsPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <BaseLayout>
      <PostsLayout {...page.props}>{page}</PostsLayout>
    </BaseLayout>
  );
};

export default PostsPage;
