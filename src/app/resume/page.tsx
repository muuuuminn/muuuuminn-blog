import markdownToHtml from "zenn-markdown-html";

import { RichMarkdownContent } from "@/components/RichMarkdownContent";
import { getDictionary } from "@/libs/i18n/getDictionary";
import { getMarkdownFileByFilename } from "@/libs/markdown/api";
import { getMetadata } from "@/libs/seo/metadata";

export async function generateMetadata() {
  const d = await getDictionary();
  const metadata = getMetadata({
    title: d.PAGE.RESUME,
    description: d.DESCRIPTION.RESUME,
    path: "/resume",
  });

  return metadata;
}

const ResumePage = async () => {
  const resume = getMarkdownFileByFilename(
    "resume",
    ["title", "date", "slug", "content"],
    "/resume",
  );
  const content = await markdownToHtml(resume.content);

  return (
    <div>
      <RichMarkdownContent html={content} />
    </div>
  );
};

export default ResumePage;
