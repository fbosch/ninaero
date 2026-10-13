import {
  accentNames,
  accentStorageKey,
  defaultAccent,
  isAccent,
} from "../registry/ninaero/accents.mjs";

/** @param {Pick<Storage, "getItem">} storage */
export function readAccent(storage) {
  try {
    const value = storage.getItem(accentStorageKey);
    return isAccent(value) ? value : defaultAccent;
  } catch {
    return defaultAccent;
  }
}

/**
 * @param {Pick<Storage, "setItem">} storage
 * @param {string} accent
 */
export function saveAccent(storage, accent) {
  if (!isAccent(accent)) throw new Error(`Unknown accent: ${accent}`);
  try {
    storage.setItem(accentStorageKey, accent);
    return true;
  } catch {
    return false;
  }
}

// Only trusted constants enter this script; persisted values are allowlisted at runtime.
export const accentBootstrap = `(() => {
  let accent = ${JSON.stringify(defaultAccent)};
  try {
    const stored = localStorage.getItem(${JSON.stringify(accentStorageKey)});
    if (${JSON.stringify(accentNames)}.includes(stored)) accent = stored;
  } catch {}
  document.documentElement.dataset.accent = accent;
})();`;
