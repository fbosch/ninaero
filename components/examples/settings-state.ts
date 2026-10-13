export type Settings = Readonly<{
  displayName: string;
  email: string;
  updates: boolean;
}>;

export const initialSettings: Settings = {
  displayName: "Nina",
  email: "nina@example.com",
  updates: false,
};

export function settingsMatch(draft: Settings, saved: Settings | null): boolean {
  return (
    saved !== null &&
    draft.displayName === saved.displayName &&
    draft.email === saved.email &&
    draft.updates === saved.updates
  );
}
