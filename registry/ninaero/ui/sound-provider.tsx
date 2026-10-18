"use client";

import type { CueName as SoundCue, ThemeName as SoundTheme } from "@foleyjs/core";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

import {
  createSoundPlayer,
  defaultSoundSettings,
  type CueOptions as SoundOptions,
} from "./sound-runtime";

type SoundContextValue = {
  enabled: boolean;
  play: (cue: SoundCue, options?: SoundOptions) => void;
};

const silentSounds: SoundContextValue = { enabled: false, play: () => {} };
const SoundContext = createContext<SoundContextValue>(silentSounds);

type SoundProviderProps = {
  children: ReactNode;
  enabled?: boolean;
  volume?: number;
  theme?: SoundTheme;
  onError?: (error: unknown) => void;
};

function SoundProvider({
  children,
  enabled = defaultSoundSettings.enabled,
  volume = defaultSoundSettings.volume,
  theme = defaultSoundSettings.theme,
  onError,
}: SoundProviderProps) {
  const [player] = useState(() => createSoundPlayer());
  const reportError = useCallback(
    (error: unknown) => {
      player.stop();
      if (onError) onError(error);
      else console.error("Ninaero could not play sound effects.", error);
    },
    [onError, player],
  );

  useEffect(() => {
    let active = true;
    void player.configure({ enabled, volume, theme }).catch((error: unknown) => {
      if (active) reportError(error);
    });
    return () => {
      active = false;
      player.stop();
    };
  }, [enabled, volume, theme, reportError, player]);

  const play = useCallback(
    (cue: SoundCue, options?: SoundOptions) => {
      if (!enabled) return;
      try {
        player.play(cue, options);
      } catch (error) {
        reportError(error);
      }
    },
    [enabled, player, reportError],
  );
  const value = useMemo(() => ({ enabled, play }), [enabled, play]);

  return <SoundContext.Provider value={value}>{children}</SoundContext.Provider>;
}

function useSound() {
  return useContext(SoundContext);
}

export { SoundProvider, useSound };
export type { SoundCue, SoundOptions, SoundProviderProps, SoundTheme };
