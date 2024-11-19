"use client";

import styles from "./TagSearchButton.module.css";

import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon, MagnifyingGlassIcon } from "@radix-ui/react-icons";
import {
  Button,
  Heading,
  IconButton,
  ScrollArea,
  Theme,
} from "@radix-ui/themes";
import { type FC, useState } from "react";

import { Tag } from "@/features/tag/components/TagList/Tag";
import { MASTER_TAGS } from "@/features/tag/constants";
import { Flex } from "@/libs/radix/layout/Flex";
import { VStack } from "@/libs/radix/layout/Stack";

export const TagSearchButton: FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <Button
          color="red"
          highContrast
          variant="ghost"
          className={styles.searchButton}
        >
          <MagnifyingGlassIcon width={24} height={24} />
        </Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className={styles.dialogOverlay} />
        <Dialog.Content className={styles.dialogContent}>
          <Theme appearance="dark" accentColor="red" radius="large">
            <VStack gap="4">
              <Dialog.Title asChild>
                <Heading size="4">タグで検索する</Heading>
              </Dialog.Title>
              <ScrollArea
                type="auto"
                scrollbars="vertical"
                style={{
                  height: 180,
                }}
              >
                <Flex wrap="wrap" gapX="2" gapY="3">
                  {MASTER_TAGS.map((tag) => (
                    <Tag
                      tag={tag}
                      key={tag.id}
                      onMouseDown={() => setOpen(false)}
                    />
                  ))}
                </Flex>
              </ScrollArea>
              <Dialog.Close asChild>
                <IconButton
                  aria-label="Close"
                  variant="ghost"
                  className={styles.closeIconButton}
                >
                  <Cross2Icon />
                </IconButton>
              </Dialog.Close>
            </VStack>
          </Theme>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
