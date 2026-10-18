import type { CueName, PlayHandle, PlayOptions, ThemeName } from "@foleyjs/core";

type SoundCue = CueName;
type SoundTheme = ThemeName;
export type CueOptions = Pick<PlayOptions, "pitch" | "volume">;

export const defaultSoundSettings = {
  enabled: false,
  volume: 0.35,
  theme: "glass" as SoundTheme,
};

export function getSoundPitch(value: number, min: number, max: number) {
  if (![value, min, max].every(Number.isFinite) || max <= min) {
    throw new RangeError("Pitch mapping requires finite values and an increasing range.");
  }
  const position = Math.max(0, Math.min(1, (value - min) / (max - min)));
  return -6 + position * 12;
}

type HoverVisit = {
  inside: boolean;
  played: boolean;
  pending?: ReturnType<typeof setTimeout>;
  rearm?: ReturnType<typeof setTimeout>;
};

export function createHoverSoundGate(now = () => performance.now()) {
  const visits = new WeakMap<object, HoverVisit>();
  let lastPlayedAt = -Infinity;

  function cancel(target: object) {
    const visit = visits.get(target);
    if (!visit) return;
    clearTimeout(visit.pending);
    visit.pending = undefined;
    visit.played = true;
  }

  return {
    enter(target: object, play: () => boolean) {
      const visit: HoverVisit = visits.get(target) ?? { inside: true, played: false };
      visits.set(target, visit);
      visit.inside = true;
      clearTimeout(visit.rearm);
      visit.rearm = undefined;
      if (visit.played || visit.pending !== undefined) return;
      visit.pending = setTimeout(() => {
        visit.pending = undefined;
        if (!visit.inside || visit.played) return;
        visit.played = true;
        const at = now();
        if (at - lastPlayedAt < 300) return;
        if (play()) lastPlayedAt = at;
      }, 100);
    },
    leave(target: object) {
      const visit = visits.get(target);
      if (!visit) return;
      visit.inside = false;
      clearTimeout(visit.pending);
      visit.pending = undefined;
      clearTimeout(visit.rearm);
      visit.rearm = setTimeout(() => visits.delete(target), 200);
    },
    cancel,
    dispose(target: object) {
      const visit = visits.get(target);
      if (!visit) return;
      clearTimeout(visit.pending);
      clearTimeout(visit.rearm);
      visits.delete(target);
    },
  };
}

type SoundEngine = Pick<typeof import("@foleyjs/core"), "play" | "set">;
type SoundSettings = typeof defaultSoundSettings;

export function createSoundPlayer(
  load: () => Promise<SoundEngine> = () => import("@foleyjs/core"),
) {
  let settings = defaultSoundSettings;
  let engine: SoundEngine | undefined;
  let loading: Promise<SoundEngine> | undefined;
  let current: PlayHandle | undefined;
  let generation = 0;
  let active = false;

  function stop() {
    active = false;
    generation++;
    current?.stop();
    current = undefined;
  }

  return {
    async configure(options: Partial<SoundSettings> = {}) {
      const next = { ...defaultSoundSettings, ...options };
      if (!Number.isFinite(next.volume) || next.volume < 0 || next.volume > 1) {
        throw new RangeError("Sound volume must be between 0 and 1.");
      }
      settings = next;
      if (!next.enabled) {
        stop();
        return;
      }
      active = true;
      const request = ++generation;
      if (!loading) {
        loading = load().catch((error: unknown) => {
          loading = undefined;
          throw error;
        });
      }
      const loaded = await loading;
      if (active && generation === request) engine = loaded;
    },
    play(cue: SoundCue, options?: CueOptions) {
      if (!active || !engine) return;
      if (
        options?.volume !== undefined &&
        (!Number.isFinite(options.volume) || options.volume < 0 || options.volume > 1)
      ) {
        throw new RangeError("Cue volume must be between 0 and 1.");
      }
      if (options?.pitch !== undefined && !Number.isFinite(options.pitch)) {
        throw new RangeError("Cue pitch must be finite.");
      }
      // Foley shares one engine. Apply this provider's settings at the point of playback.
      engine.set({ theme: settings.theme, volume: settings.volume });
      const next = engine.play(cue, options);
      if (next) {
        current?.stop();
        current = next;
      }
    },
    stop,
  };
}
