export function isSearchShortcut(
  event: Pick<
    KeyboardEvent,
    | "key"
    | "defaultPrevented"
    | "isComposing"
    | "repeat"
    | "altKey"
    | "shiftKey"
    | "ctrlKey"
    | "metaKey"
  >,
): boolean;

export function createSearchLoader<T>(load: () => Promise<T>): {
  preload(): Promise<T>;
  open(onReady: (module: T) => void, onError: (error: unknown) => void): boolean;
  cancel(): boolean;
};
