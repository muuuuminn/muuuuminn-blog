import markdownToHtml from "zenn-markdown-html";

import { RichMarkdownContent } from "@/components/RichMarkdownContent";
import { getDictionary } from "@/libs/i18n/getDictionary";
import { getMarkdownFileByFilename } from "@/libs/markdown/api";
import { getMetadata } from "@/libs/seo/metadata";

export async function generateMetadata() {
  const d = await getDictionary();
  const metadata = getMetadata({
    title: d.PAGE.POLICY,
    description: d.DESCRIPTION.POLICY,
    path: "/policy",
  });

  return metadata;
}

const PolicyPage = async () => {
  const policy = getMarkdownFileByFilename(
    "policy",
    ["slug", "content"],
    "/policy",
  );
  const content = await markdownToHtml(policy.content);

  return (
    <div>
      <RichMarkdownContent html={content} />
    </div>
  );
};

export default PolicyPage;
