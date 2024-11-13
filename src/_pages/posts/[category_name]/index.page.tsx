import type { ReactElement } from "react";

export { getStaticPaths, getStaticProps } from "@/pages/posts/[category_name]/category.ssg";
import { BaseLayout } from "@/shared/components";

import { Category } from "./Category";
import { PostsLayout } from "../PostsLayout";

import type { CategoryType } from "@/features/category/types";
import type { PostListType } from "@/features/post/types";
import type { TagType } from "@/features/tag/types";
import type { NextPageWithLayout } from "@/pages/_app.page";

type CategoryPageProps = {
  posts: PostListType;
  categories: CategoryType[];
  tags: TagType[];
};

const CategoryPage: NextPageWithLayout<CategoryPageProps> = (props) => {
  return <Category {...props} />;
};

CategoryPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <BaseLayout>
      <PostsLayout {...page.props}>{page}</PostsLayout>
    </BaseLayout>
  );
};

export default CategoryPage;
