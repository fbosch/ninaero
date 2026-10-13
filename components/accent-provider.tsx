"use client";

import { createContext, type ReactNode, useContext, useEffect, useState } from "react";

import { readAccent, saveAccent } from "@/lib/accent-preference.mjs";
import {
  type AccentName,
  accentStorageKey,
  defaultAccent,
  isAccent,
} from "@/registry/ninaero/accents.mjs";

const AccentContext = createContext<{
  accent: AccentName;
  mounted: boolean;
  saved: boolean;
  setAccent: (value: AccentName) => void;
} | null>(null);

export function AccentProvider({ children }: { children: ReactNode }) {
  const [accent, updateAccent] = useState<AccentName>(defaultAccent);
  const [mounted, setMounted] = useState(false);
  const [saved, setSaved] = useState(true);

  useEffect(() => {
    const initial = document.documentElement.dataset.accent;
    if (isAccent(initial)) updateAccent(initial);
    setMounted(true);

    function syncAccent(event: StorageEvent) {
      if (event.key !== accentStorageKey && event.key !== null) return;
      const value = readAccent({ getItem: () => event.newValue });
      document.documentElement.dataset.accent = value;
      updateAccent(value);
      setSaved(true);
    }
    window.addEventListener("storage", syncAccent);
    return () => window.removeEventListener("storage", syncAccent);
  }, []);

  function setAccent(value: AccentName) {
    if (!isAccent(value)) throw new Error(`Unknown accent: ${value}`);
    document.documentElement.dataset.accent = value;
    updateAccent(value);
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
