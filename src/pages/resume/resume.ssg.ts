import markdownToHtml from "zenn-markdown-html";

import { getMarkdownFileByFilename } from "@/libs/markdown/api";

export const getStaticProps = () => {
  const resume = getMarkdownFileByFilename(
    "resume",
    ["title", "date", "slug", "content"],
    "src/features/resume",
  );
  const content = markdownToHtml(resume.content);

  return {
    props: {
      resume: {
        ...resume,
        content,
      },
    },
  };
};
