import markdownToHtml from "zenn-markdown-html";

import { getMarkdownFileByFilename } from "@/libs/markdown/api";

import type { LocalesType } from "@/libs/i18n";

export const getStaticProps = ({ locale }: { locale: LocalesType }) => {
  const policy = getMarkdownFileByFilename(
    "policy",
    ["slug", "content"],
    "src/features/policy/locales",
    locale,
  );
  const content = markdownToHtml(policy.content);

  return {
    props: {
      locale: locale,
      policy: {
        ...policy,
        content,
      },
    },
  };
};
