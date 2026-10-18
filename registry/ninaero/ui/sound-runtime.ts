import type {
  CueName,
  PlayHandle,
  PlayOptions,
  Spec,
  ThemeName,
  ThemeTransform,
} from "@foleyjs/core";

type SoundCue = CueName;
type SoundTheme = ThemeName;
export type CueOptions = Pick<PlayOptions, "pitch" | "volume">;

export const defaultSoundSettings = {
  enabled: false,
  volume: 1,
  theme: "glass" as SoundTheme,
};

type CueProfile = {
  source?: SoundCue;
  notes?: readonly number[];
  pace?: number;
  level?: number;
  transform: ThemeTransform;
};

// Page-change/back intervals are shortened and lowered for frequent UI feedback.
const cueProfiles: Partial<Record<SoundCue, CueProfile>> = {
  hover: {
    source: "tick",
    transform: {
      pitch: 0.5,
      attack: 0.5,
      decay: 1.3,
      noiseLvl: 0.35,
      noiseF: 0.25,
      q: 0.45,
    },
  },
  tick: {
    source: "tick",
    transform: { pitch: 0.96, attack: 0.25, decay: 0.35, noiseLvl: 0.7 },
  },
  tap: {
    level: 0.625,
    notes: [739.99],
    transform: { attack: 0.5, decay: 1.25, noiseLvl: 0.25, noiseF: 0.5 },
  },
  on: {
    notes: [369.99, 554.37],
    pace: 0.6,
    level: 0.65,
    transform: { attack: 0.5, decay: 0.9 },
  },
  off: {
    notes: [554.37, 369.99],
    pace: 0.6,
    level: 0.65,
    transform: { attack: 0.5, decay: 0.9 },
  },
  ping: {
    source: "ready",
    notes: [369.99, 554.37],
    level: 1,
    transform: { attack: 0.5, decay: 0.3 },
  },
  success: {
    notes: [739.99, 830.61, 987.77],
    pace: 0.55,
    level: 0.7,
    transform: { attack: 0.5, decay: 0.45 },
  },
  complete: {
    source: "success",
    notes: [659.25, 987.77, 1318.5],
    pace: 0.55,
    level: 0.7,
    transform: { attack: 0.5, decay: 0.65 },
  },
  warning: {
    notes: [1165.5, 1165.5],
    pace: 0.55,
    level: 0.65,
    transform: { attack: 0.5, decay: 0.45 },
  },
  error: {
    notes: [1165.5, 830.61],
    pace: 0.55,
    level: 1,
    transform: { attack: 0.5, decay: 0.45 },
  },
  loading: {
    notes: [369.99, 415.3, 493.88],
    pace: 0.7,
    level: 1,
    transform: { attack: 0.5, decay: 0.7 },
  },
};

function profileSpec(spec: Spec, profile: CueProfile): Spec {
  if (
    profile.notes &&
    spec.filter((layer) => layer.kind === "tone").length !== profile.notes.length
  ) {
    throw new RangeError("Sound profile must match the source cue's tone count.");
  }
  let tone = 0;
  return spec.map((layer) => {
    const next = {
      ...layer,
      at: layer.at * (profile.pace ?? 1),
      peak: layer.peak * (profile.level ?? 1),
    };
    const f = next.kind === "tone" ? profile.notes?.[tone++] : undefined;
    return f === undefined ? next : { ...next, f, f2: null };
  });
}

export function getSoundPitch(value: number, min: number, max: number) {
  if (![value, min, max].every(Number.isFinite) || max <= min) {
    throw new RangeError("Pitch mapping requires finite values and an increasing range.");
  }
  const position = Math.max(0, Math.min(1, (value - min) / (max - min)));
  return -6 + position * 12;
}

type HoverVisit = {
  played: boolean;
  rearm?: ReturnType<typeof setTimeout>;
};

export function createHoverSoundGate() {
  const visits = new WeakMap<Element, HoverVisit>();

  return {
    enter(target: Element, play: () => boolean) {
      const visit: HoverVisit = visits.get(target) ?? { played: false };
      visits.set(target, visit);
      clearTimeout(visit.rearm);
      visit.rearm = undefined;
      if (!visit.played) visit.played = play();
    },
    leave(target: Element) {
      const visit = visits.get(target);
      if (!visit) return;
      clearTimeout(visit.rearm);
      visit.rearm = setTimeout(() => visits.delete(target), 200);
    },
    dispose(target: Element) {
      const visit = visits.get(target);
      if (!visit) return;
      clearTimeout(visit.rearm);
      visits.delete(target);
    },
  };
}

type SoundEngine = Pick<typeof import("@foleyjs/core"), "play" | "set" | "getSpec">;
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
      const profile = settings.theme === "glass" ? cueProfiles[cue] : undefined;
      if (profile) {
        const spec = profileSpec(engine.getSpec(profile.source ?? cue), profile);
        engine.set({
          theme: {
            transform: {
              send: 0,
              shimmer: false,
              wave: { triangle: "sine", sawtooth: "sine" },
              ...profile.transform,
            },
            cues: { [cue]: spec },
          },
        });
      }
      const next = engine.play(cue, options);
      if (next) {
        current?.stop();
        current = next;
      }
    },
    stop,
  };
}
