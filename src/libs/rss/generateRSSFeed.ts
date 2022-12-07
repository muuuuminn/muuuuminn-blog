import fs from "fs";

import RSS from "rss";

import { getAllPosts } from "../markdown/api";

export default async function generateRssFeed() {
  const APP_ROOT_URL = process.env.NEXT_PUBLIC_APP_ROOT_URL || "";

  const posts = await getAllPosts([
    "title",
    "date",
    "slug",
    "coverImage",
    "description",
    "category",
    "tags",
  ]);

  const feedOptions = {
    title: "RSS Feed | muuuuminn blog",
    description: "muuuuminnによるブログです。",
    site_url: APP_ROOT_URL,
    feed_url: `${APP_ROOT_URL}/rss.xml`,
    image_url: `${APP_ROOT_URL}/logo/logo.png`,
    pubDate: new Date(),
    copyright: `© 2022 muuuuminn blog. All rights reserved.`,
  };

  const feed = new RSS(feedOptions);

  posts.map((post) => {
    feed.item({
      title: post.title,
      description: post.description,
      url: `${APP_ROOT_URL}/post/${post.slug}`,
      date: post.date,
      author: "muuuuminn",
      categories: [post.category.name, ...post.tags.map((tag) => tag.name)],
    });
  });

  fs.writeFileSync("./public/rss.xml", feed.xml({ indent: true }));
}
