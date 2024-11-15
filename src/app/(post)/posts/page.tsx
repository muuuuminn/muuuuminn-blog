import { FC } from "react";

import { getAllPosts } from "@/libs/markdown/api";
import { getDictionary } from "@/libs/i18n";
import { getMetadata } from "@/libs/metadata";
import { PostCardList } from "@/features/post/components/PostCardList";
import { MASTER_TAGS } from "@/features/tag/constants";

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

const PostsPage: FC<PostsPageProps> = async ({ searchParams }) => {
  const tagNameAsQuery = (await searchParams).tag;

  const selectedTag = MASTER_TAGS.find((tag) => tag.name === tagNameAsQuery);

  const posts = getAllPosts([
    "title",
    "date",
    "slug",
    "coverImage",
    "description",
    "category",
    "tags",
  ]);

  const filteredPosts = selectedTag
    ? posts.filter((post) => {
        if (selectedTag) {
          const isTagMatch = post.tags.some((tag) => tag.name === selectedTag.name);
          return isTagMatch;
        }
        return true;
      })
    : posts;

  return (
    <div>
      <PostCardList posts={filteredPosts} />
    </div>
  );
};

export default PostsPage;
