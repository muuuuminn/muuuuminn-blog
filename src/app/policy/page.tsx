import { RichMarkdownContent } from "@/components/RichMarkdownContent";
import { getDictionary } from "@/libs/i18n/getDictionary";
import { getStaticMarkdownPage } from "@/libs/markdown/static-page";
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
  const policy = getStaticMarkdownPage("policy");

  return (
    <div>
      <RichMarkdownContent html={policy.html} />
    </div>
  );
};

export default PolicyPage;
