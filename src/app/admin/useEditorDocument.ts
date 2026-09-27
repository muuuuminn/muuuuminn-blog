import { useCallback, useMemo, useReducer } from "react";
import type { CmsPostInput } from "@/libs/cms/types";
import {
  createEditorDocumentState,
  type EditorDocumentAction,
  editorDocumentReducer,
} from "./editorReducer";
import type { EditorPost, FieldErrors, UpdatePost } from "./editorTypes";
import { createPostSnapshot } from "./editorUtils";

export function useEditorDocument(initialPost: EditorPost) {
  const [state, dispatch] = useReducer(
    editorDocumentReducer,
    initialPost,
    createEditorDocumentState,
  );

  const isDirty = useMemo(
    () => createPostSnapshot(state.post) !== state.savedSnapshot,
    [state.post, state.savedSnapshot],
  );

  const updatePost = useCallback<UpdatePost>((key, value) => {
    dispatch({ type: "update", key, value } as EditorDocumentAction);
  }, []);

  const resetDocument = useCallback(
    (post: EditorPost, originalSlug: string | null) => {
      dispatch({ type: "reset", post, originalSlug });
    },
    [],
  );

  const setFieldErrors = useCallback((errors: FieldErrors) => {
    dispatch({ type: "setErrors", errors });
  }, []);

  const setFieldError = useCallback(
    (key: keyof CmsPostInput, message: string) => {
      dispatch({ type: "setFieldError", key, message });
    },
    [],
  );

  const markSaved = useCallback(
    (post: EditorPost, commitUrl: string | null) => {
      dispatch({ type: "markSaved", post, commitUrl });
    },
    [],
  );

  const applyImageUpload = useCallback((imageUrl: string) => {
    dispatch({ type: "imageUploaded", imageUrl });
  }, []);

  return {
    ...state,
    isDirty,
    updatePost,
    resetDocument,
    setFieldErrors,
    setFieldError,
    markSaved,
    applyImageUpload,
  };
}
