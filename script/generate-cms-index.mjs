import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const POSTS_DIRECTORY = "src/muuuuminn-blog/posts";
const OUTPUT_FILE = "src/libs/cms/posts-index.generated.json";

function normalizeString(value) {
  return typeof value === "string" ? value : "";
}

function normalizeStatus(value) {
  if (value === undefined || value === null || value === "") {
    return "published";
  }
  if (value === "published" || value === "archived") return value;
  return "draft";
}

function readPostSummary(slug) {
  const filePath = path.join(POSTS_DIRECTORY, slug, "index.md");
  const { data } = matter(fs.readFileSync(filePath, "utf8"));
  const publishedAt = normalizeString(data.date);

  return {
    slug,
    title: normalizeString(data.title),
    status: normalizeStatus(data.status),
    updatedAt: normalizeString(data.updatedAt) || publishedAt,
  };
}

function main() {
  const summaries = fs
    .readdirSync(POSTS_DIRECTORY, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => readPostSummary(entry.name))
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));

  fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(summaries, null, 2), "utf8");
  console.log(`Generated ${summaries.length} CMS entries: ${OUTPUT_FILE}`);
}

main();
