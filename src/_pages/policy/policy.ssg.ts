import markdownToHtml from "zenn-markdown-html";

import { getMarkdownFileByFilename } from "@/libs/markdown/api";

export const getStaticProps = () => {
  const policy = getMarkdownFileByFilename("policy", ["slug", "content"], "src/features/policy");
  const content = markdownToHtml(policy.content);

  return {
    props: {
      policy: {
        ...policy,
        content,
      },
    },
  };
};
