import type { CmsPostInput } from "@/libs/cms/types";

export type EditorPost = CmsPostInput & {
  createdAt?: string;
  updatedAt?: string;
  source?: "github";
  sha?: string;
};

export type BusyAction = "save" | "publish" | "preview" | "archive" | "upload";
export type FieldErrors = Partial<Record<keyof CmsPostInput, string>>;
export type NoticeTone = "neutral" | "success" | "error";

export type UpdatePost = <K extends keyof EditorPost>(
  key: K,
  value: EditorPost[K],
) => void;
