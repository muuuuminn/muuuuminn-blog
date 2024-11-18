"use client";

import styles from "./TagSearchButton.module.css";

import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon, MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { Button, IconButton } from "@radix-ui/themes";

import type { FC } from "react";

export const TagSearchButton: FC = () => {
  return (
    <Dialog.Root>
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
          <Dialog.Title className={styles.dialogTitle}>
            Edit profile
          </Dialog.Title>
          <Dialog.Description className={styles.dialogDescription}>
            Make changes to your profile here. Click save when you're done.
          </Dialog.Description>
          <Dialog.Close asChild>
            <IconButton aria-label="Close" className={styles.closeIconButton}>
              <Cross2Icon />
            </IconButton>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
