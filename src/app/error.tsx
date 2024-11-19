"use client";

import { Button, Card, Flex, Heading, Text } from "@radix-ui/themes";
import Link from "next/link";

import { VStack } from "@/libs/radix/layout/Stack";

export default function ErrorPage() {
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
