import type { CmsPostInput } from "@/libs/cms/types";
import type { EditorPost, FieldErrors } from "./editorTypes";
import {
  applyUploadedImage,
  clearFieldError,
  createPostSnapshot,
  updatePostField,
} from "./editorUtils";

export type EditorDocumentState = {
  post: EditorPost;
  originalSlug: string | null;
  savedSnapshot: string;
  commitUrl: string | null;
  uploadedImageUrl: string | null;
  fieldErrors: FieldErrors;
};

type UpdateAction = {
  [K in keyof CmsPostInput]-?: {
    type: "update";
    key: K;
    value: CmsPostInput[K];
  };
}[keyof CmsPostInput];

export type EditorDocumentAction =
  | UpdateAction
  | { type: "reset"; post: EditorPost; originalSlug: string | null }
  | { type: "setErrors"; errors: FieldErrors }
  | { type: "setFieldError"; key: keyof CmsPostInput; message: string }
  | { type: "markSaved"; post: EditorPost; commitUrl: string | null }
  | { type: "imageUploaded"; imageUrl: string };

export function createEditorDocumentState(
  post: EditorPost,
): EditorDocumentState {
  return {
    post,
    originalSlug: null,
    savedSnapshot: createPostSnapshot(post),
    commitUrl: null,
    uploadedImageUrl: null,
    fieldErrors: {},
  };
}

export function editorDocumentReducer(
  state: EditorDocumentState,
  action: EditorDocumentAction,
): EditorDocumentState {
  switch (action.type) {
    case "update":
      return {
        ...state,
        post: updatePostField(state.post, action.key, action.value),
        commitUrl: null,
        fieldErrors: clearFieldError(state.fieldErrors, action.key),
      };
    case "reset":
      return {
        post: action.post,
        originalSlug: action.originalSlug,
        savedSnapshot: createPostSnapshot(action.post),
        commitUrl: null,
        uploadedImageUrl: null,
        fieldErrors: {},
      };
    case "setErrors":
      return { ...state, fieldErrors: action.errors };
    case "setFieldError":
      return {
        ...state,
        fieldErrors: { ...state.fieldErrors, [action.key]: action.message },
      };
    case "markSaved":
      return {
        ...state,
        post: action.post,
        originalSlug: action.post.slug,
        savedSnapshot: createPostSnapshot(action.post),
        commitUrl: action.commitUrl,
      };
    case "imageUploaded":
      return {
        ...state,
        post: applyUploadedImage(state.post, action.imageUrl),
        uploadedImageUrl: action.imageUrl,
        fieldErrors: clearFieldError(state.fieldErrors, "coverImage"),
      };
  }
}
