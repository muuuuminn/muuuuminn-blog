import { FC } from "react";

import { getAllPosts } from "@/libs/markdown/api";
import { getDictionary } from "@/libs/i18n";
import { getMetadata } from "@/libs/metadata";

type PostsPageProps = {
  searchParams: Promise<{ tag: string }>;
};

export async function generateMetadata({ searchParams }: PostsPageProps) {
  const d = await getDictionary();
  const metadata = getMetadata({
    title: d.PAGE.POSTS,
    description: d.DESCRIPTION.POSTS,
    path: "/posts",
  });

  return metadata;
}

const PostsPage: FC<PostsPageProps> = () => {
  const posts = getAllPosts([
    "title",
    "date",
    "slug",
    "coverImage",
    "description",
    "category",
    "tags",
  ]);

  return <div>{JSON.stringify(posts)}</div>;
};

export default PostsPage;
