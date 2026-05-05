import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import matter from "gray-matter";

const require = createRequire(import.meta.url);
const zennMarkdownHtmlModule = require("zenn-markdown-html");

const markdownHtml =
  typeof zennMarkdownHtmlModule === "function"
    ? zennMarkdownHtmlModule
    : zennMarkdownHtmlModule.default;

const OUTPUT_FILE_PATH = "src/libs/markdown/static-pages.generated.json";

const STATIC_PAGES = [
  {
    key: "policy",
    filename: "policy",
    directoryName: "src/app/policy",
  },
  {
    key: "resume",
    filename: "resume",
    directoryName: "src/app/resume",
  },
];

function normalizeString(value) {
  return typeof value === "string" ? value : "";
}

async function readStaticPage({ key, filename, directoryName }) {
  const fullPath = path.join(process.cwd(), directoryName, `${filename}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  return [
    key,
    {
      slug: filename,
      title: normalizeString(data.title),
      date: normalizeString(data.date),
      html: await markdownHtml(content),
    },
  ];
}

async function main() {
  const entries = await Promise.all(STATIC_PAGES.map(readStaticPage));
  const pages = Object.fromEntries(entries);

  const outputPath = path.join(process.cwd(), OUTPUT_FILE_PATH);
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(pages, null, 2), "utf8");

  console.log(`Generated static pages: ${OUTPUT_FILE_PATH}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
