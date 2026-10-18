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
  /** Loads Foley and enables playback when true. Defaults to false. */
  enabled?: boolean;
  /** Finite volume from 0 to 1, inclusive. Defaults to 1. */
  volume?: number;
  /** Defaults to `glass`, which uses Ninaero's tuned interaction cues. */
  theme?: SoundTheme;
  /**
   * Receives load, configuration, and playback errors after the provider stops its player.
   * Without this callback, the provider logs errors with `console.error`.
   */
  onError?: (error: unknown) => void;
};

/**
 * Provides opt-in Foley playback for descendants.
 *
 * Requests made before Foley loads are not queued. Browser autoplay restrictions apply.
 * When Foley accepts a cue, that cue replaces this provider's current cue.
 * Disabling or unmounting the provider stops playback.
 *
 * Nested providers use their own settings rather than inheriting the parent's settings.
 */
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
    // Ignore stale failures so `reportError` cannot stop a newer configuration.
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

/**
 * Returns the nearest provider's `enabled` prop and `play` function.
 *
 * `enabled` does not report whether Foley has loaded or audio can play.
 * Without a provider, `enabled` is false and `play` does nothing.
 *
 * `play` accepts pitch offsets in semitones and a volume multiplier from 0 to 1.
 */
function useSound() {
  return useContext(SoundContext);
}

export { SoundProvider, useSound };
export type { SoundCue, SoundOptions, SoundProviderProps, SoundTheme };
