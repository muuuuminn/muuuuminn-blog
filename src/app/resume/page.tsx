import markdownToHtml from "zenn-markdown-html";

import { RichMarkdownContent } from "@/shared/components/RichMarkdownContent";
import { getMarkdownFileByFilename } from "@/libs/markdown/api";
import { getDictionary } from "@/libs/i18n";
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

const ResumePage = () => {
  const resume = getMarkdownFileByFilename(
    "resume",
    ["title", "date", "slug", "content"],
    "src/app/resume",
  );
  const content = markdownToHtml(resume.content);

  return (
    <div>
      <RichMarkdownContent html={content} />
    </div>
  );
};

export default ResumePage;
