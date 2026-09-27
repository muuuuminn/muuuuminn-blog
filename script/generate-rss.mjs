import fs from "node:fs";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const RSS = require("rss");
const posts = JSON.parse(
  fs.readFileSync("src/libs/markdown/posts.generated.json", "utf8"),
);
const appRootUrl = process.env.NEXT_PUBLIC_APP_ROOT_URL || "";
const feed = new RSS({
  title: "RSS Feed | muuuuminn blog",
  description: "muuuuminnによるブログです。",
  site_url: appRootUrl,
  feed_url: `${appRootUrl}/rss.xml`,
  image_url: `${appRootUrl}/logo/logo.png`,
  pubDate: new Date(),
  copyright: "© 2022 muuuuminn blog. All rights reserved.",
});

for (const post of posts) {
  feed.item({
    title: post.title,
    description: post.description,
    url: `${appRootUrl}/post/${post.slug}`,
    date: post.date,
    author: "muuuuminn",
  });
}

fs.writeFileSync("public/rss.xml", feed.xml({ indent: true }));
console.log(`Generated RSS feed with ${posts.length} posts: public/rss.xml`);
