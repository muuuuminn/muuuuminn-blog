import { Button, Card, Flex, Heading, Text } from "@radix-ui/themes";
import Link from "next/link";

import { getDictionary } from "@/libs/i18n";
import { VStack } from "@/libs/radix/layout/Stack";
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
    <Flex
      height="100vh"
      justify="center"
      align="center"
      style={{ marginTop: "-10vh" }}
    >
      <Card>
        <VStack align="center" justify="center" gap="4">
          <Heading as="h2" size="8" weight="bold">
            404
          </Heading>
          <Text size="2" color="gray">
            お探しのページが見つかりませんでした
          </Text>
          <Button asChild>
            <Link href="/">ホームに戻る</Link>
          </Button>
        </VStack>
      </Card>
    </Flex>
  );
}
