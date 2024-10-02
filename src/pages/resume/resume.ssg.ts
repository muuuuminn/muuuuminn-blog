import markdownToHtml from "zenn-markdown-html";

import { getMarkdownFileByFilename } from "@/libs/markdown/api";

import type { LocalesType } from "@/libs/i18n/types";

export const getStaticProps = ({ locale }: { locale: LocalesType }) => {
  const resume = getMarkdownFileByFilename(
    "resume",
    ["title", "date", "slug", "content"],
    "src/features/resume/locales",
    locale,
  );
  const content = markdownToHtml(resume.content);

  return {
    props: {
      locale: locale,
      resume: {
        ...resume,
        content,
      },
    },
  };
};
