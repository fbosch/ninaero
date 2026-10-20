"use client";

import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
  useSyncExternalStore,
} from "react";

import { readAccent, saveAccent } from "@/lib/accent-preference.mjs";
import {
  type AccentName,
  accentStorageKey,
  defaultAccent,
  isAccent,
} from "@/registry/ninaero/accents.mjs";

const accentChangeEvent = "ninaero:accent-change";

const AccentContext = createContext<{
  accent: AccentName;
  mounted: boolean;
  saved: boolean;
  setAccent: (value: AccentName) => void;
} | null>(null);

function getAccentSnapshot(): AccentName {
  const accent = document.documentElement.dataset.accent;
  return isAccent(accent) ? accent : defaultAccent;
}

function getServerAccentSnapshot(): AccentName {
  return defaultAccent;
}

function subscribeToNothing() {
  return () => {};
}

function getClientMountedSnapshot() {
  return true;
}

function getServerMountedSnapshot() {
  return false;
}

function subscribeAccent(onChange: () => void) {
  function syncAccent(event: StorageEvent) {
    if (event.key !== accentStorageKey && event.key !== null) return;
    const value = readAccent({ getItem: () => event.newValue });
    document.documentElement.dataset.accent = value;
    onChange();
  }

  window.addEventListener("storage", syncAccent);
  window.addEventListener(accentChangeEvent, onChange);
  return () => {
    window.removeEventListener("storage", syncAccent);
    window.removeEventListener(accentChangeEvent, onChange);
  };
}

export function AccentProvider({ children }: { children: ReactNode }) {
  const accent = useSyncExternalStore(subscribeAccent, getAccentSnapshot, getServerAccentSnapshot);
  const mounted = useSyncExternalStore(
    subscribeToNothing,
    getClientMountedSnapshot,
    getServerMountedSnapshot,
  );
  const [saved, setSaved] = useState(true);

  useEffect(() => {
    function markAccentSaved(event: StorageEvent) {
      if (event.key !== accentStorageKey && event.key !== null) return;
      setSaved(true);
    }

    window.addEventListener("storage", markAccentSaved);
    return () => window.removeEventListener("storage", markAccentSaved);
  }, []);

  function setAccent(value: AccentName) {
    if (!isAccent(value)) throw new Error(`Unknown accent: ${value}`);
    document.documentElement.dataset.accent = value;
    window.dispatchEvent(new Event(accentChangeEvent));
    try {
      setSaved(saveAccent(window.localStorage, value));
    } catch {
      // Accessing localStorage itself can throw when browser storage is blocked.
      setSaved(false);
    }
  }

  return (
    <AccentContext.Provider value={{ accent, mounted, saved, setAccent }}>
      {children}
    </AccentContext.Provider>
  );
}

export function useAccent() {
  const context = useContext(AccentContext);
  if (!context) throw new Error("useAccent requires AccentProvider");
  return context;
}
