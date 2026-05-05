import { notFound } from "next/navigation";
import staticPagesData from "./static-pages.generated.json";

type StaticPageKey = "policy" | "resume";

type StaticPage = {
  slug: string;
  title: string;
  date: string;
  html: string;
};

const staticPages = staticPagesData as Record<StaticPageKey, StaticPage>;

export function getStaticMarkdownPage(key: StaticPageKey): StaticPage {
  const page = staticPages[key];

  if (!page) {
    notFound();
  }

  return page;
}
