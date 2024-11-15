import Link from "next/link";
import { Heading, Text, Button, Flex } from "@radix-ui/themes";
import { getDictionary } from "@/libs/i18n";
import { getMetadata } from "@/libs/seo/metadata";

export async function generateMetadata() {
  const d = await getDictionary();
  const metadata = getMetadata({
    title: d.PAGE.NOT_FOUND,
    description: d.DESCRIPTION.NOT_FOUND,
  });

  return metadata;
}

export default function NotFound() {
  return (
    <Flex height="100vh" justify="center" align="center">
      <Flex
        p="4"
        direction="column"
        justify="center"
        align="center"
        gapY="2"
        style={{
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          borderRadius: "8px",
        }}
      >
        <Heading size="8" weight="bold">
          404
        </Heading>
        <Text size="2" color="gray">
          お探しのページが見つかりませんでした
        </Text>
        <Button asChild>
          <Link href="/">ホームに戻る</Link>
        </Button>
      </Flex>
    </Flex>
  );
}
