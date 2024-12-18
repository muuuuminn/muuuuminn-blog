import { getDictionary } from "@/libs/i18n/getDictionary";
import { getAllPosts } from "@/libs/markdown/api";
import { getMetadata } from "@/libs/seo/metadata";
import FilteredPosts from "./FilteredPosts";

import type { FC } from "react";

export async function generateMetadata() {
  const d = await getDictionary();
  const metadata = getMetadata({
    title: d.PAGE.POSTS,
    description: d.DESCRIPTION.POSTS,
    path: "/posts",
  });

  return metadata;
}

const PostsPage: FC = () => {
  const posts = getAllPosts([
    "title",
    "date",
    "slug",
    "coverImage",
    "description",
    "category",
    "tags",
  ]);

  return (
    <div>
      <FilteredPosts posts={posts} />
    </div>
  );
};

export default PostsPage;
