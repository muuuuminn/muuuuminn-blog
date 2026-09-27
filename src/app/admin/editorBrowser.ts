export function confirmDiscardChanges(isDirty: boolean): boolean {
  return (
    !isDirty || window.confirm("未保存の変更があります。破棄して移動しますか？")
  );
}

export function confirmArchive(): boolean {
  return window.confirm("この記事を非公開にしますか？");
}

export function focusFirstInvalidField(): void {
  requestAnimationFrame(() => {
    document.querySelector<HTMLElement>("[aria-invalid='true']")?.focus();
  });
}

export async function copyToClipboard(value: string): Promise<void> {
  await navigator.clipboard.writeText(value);
}
