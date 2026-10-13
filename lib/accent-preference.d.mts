import type { AccentName } from "../registry/ninaero/accents.mjs";
export function readAccent(storage: Pick<Storage, "getItem">): AccentName;
export function saveAccent(
  storage: Pick<Storage, "setItem">,
  accent: AccentName,
): boolean;
export const accentBootstrap: string;
