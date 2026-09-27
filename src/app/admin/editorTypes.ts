import type { CmsPostInput, CmsPostSummary } from "@/libs/cms/types";

export type EditorPost = CmsPostInput & {
  createdAt?: string;
  updatedAt?: string;
  source?: "github";
  sha?: string;
};

export type EditorPostSummary = CmsPostSummary;

export type BusyAction =
  | "load"
  | "save"
  | "publish"
  | "preview"
  | "archive"
  | "upload";
export type FieldErrors = Partial<Record<keyof CmsPostInput, string>>;
export type NoticeTone = "neutral" | "success" | "error";

export type UpdatePost = <K extends keyof CmsPostInput>(
  key: K,
  value: CmsPostInput[K],
) => void;
