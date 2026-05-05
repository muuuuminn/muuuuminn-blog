import { RichMarkdownContent } from "@/components/RichMarkdownContent";
import { getDictionary } from "@/libs/i18n/getDictionary";
import { getStaticMarkdownPage } from "@/libs/markdown/static-page";
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
  const resume = getStaticMarkdownPage("resume");

  return (
    <div>
      <RichMarkdownContent html={resume.html} />
    </div>
  );
};

export default ResumePage;
