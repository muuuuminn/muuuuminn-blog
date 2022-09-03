import fs from "fs";
import { join } from "path";

import matter from "gray-matter";

const POSTS_DIRECTORY_NAME = "src/contents/post";

export const MARKDOWN_FIELDS = [
  "title",
  "date",
  "slug",
  "content",
  "ogImageUrl",
  "coverImage",
] as const;
type FieldsType = typeof MARKDOWN_FIELDS[number];

const postsDirectory = join(process.cwd(), POSTS_DIRECTORY_NAME);

export function getPostSlugs() {
  return fs.readdirSync(postsDirectory);
}

export function getPostBySlug(slug: string, fields: FieldsType[]) {
  const fullPath = join(postsDirectory, `${slug}/index.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  type Items = {
    [key in FieldsType]: string;
  };

  const items: Items = {
    content: "",
    title: "",
    slug: "",
    date: "",
    ogImageUrl: "",
    coverImage: "",
  };

  // Ensure only the minimal needed data is exposed
  fields.forEach((field) => {
    if (field === "slug") {
      items[field] = slug;
    }
    if (field === "content") {
      items[field] = content;
    }

    if (typeof data[field] !== "undefined") {
      items[field] = data[field];
    }
  });

  return items;
}

export function getAllPosts(fields: FieldsType[]) {
  const slugs = getPostSlugs();
  const posts = slugs
    .map((slug) => getPostBySlug(slug, fields))
    // sort posts by date in descending order
    .sort((post1, post2) => (post1.date > post2.date ? -1 : 1));
  return posts;
}
