import fs from "node:fs";
import { join } from "node:path";
import matter from "gray-matter";

const MARKDOWN_FILE_FIELDS = ["title", "date", "slug", "content"] as const;

type MarkdownFileField = (typeof MARKDOWN_FILE_FIELDS)[number];

type MarkdownFileFieldMap = {
  title: string;
  date: string;
  slug: string;
  content: string;
};

type PickMarkdownFile<T extends readonly MarkdownFileField[]> = {
  [K in T[number]]: MarkdownFileFieldMap[K];
};

function normalizeString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function pickFields<T extends readonly MarkdownFileField[]>(
  data: MarkdownFileFieldMap,
  fields: T,
): PickMarkdownFile<T> {
  return Object.fromEntries(
    fields.map((field) => [field, data[field]]),
  ) as PickMarkdownFile<T>;
}

export function getMarkdownFileByFilename<
  T extends readonly MarkdownFileField[],
>(filename: string, fields: T, directoryName: string): PickMarkdownFile<T> {
  const directory = join(process.cwd(), directoryName);
  const fullPath = join(directory, `${filename}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  const file = {
    title: normalizeString(data.title),
    date: normalizeString(data.date),
    slug: filename,
    content,
  };

  return pickFields(file, fields);
}
