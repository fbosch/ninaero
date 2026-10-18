"use client";

import { usePathname } from "next/navigation";
import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { VolumeIcon, VolumeOffIcon } from "@/lib/icons";
import { Button } from "@/registry/ninaero/ui/button";
import { ButtonGroup } from "@/registry/ninaero/ui/button-group";
import { Slider } from "@/registry/ninaero/ui/slider";
import { SoundProvider, useSound } from "@/registry/ninaero/ui/sound-provider";
import { defaultSoundSettings } from "@/registry/ninaero/ui/sound-runtime";

import styles from "./home-background.module.css";

const HomeSoundContext = createContext<{
  enabled: boolean;
  setEnabled: (enabled: boolean) => void;
  volume: number;
  setVolume: (volume: number) => void;
} | null>(null);

export function HomeSoundProvider({ children }: { children: ReactNode }) {
  const [enabled, setEnabled] = useState(true);
  const [volume, setVolume] = useState(defaultSoundSettings.volume);
  const value = useMemo(() => ({ enabled, setEnabled, volume, setVolume }), [enabled, volume]);

  return (
    <HomeSoundContext.Provider value={value}>
      <SoundProvider enabled={enabled} volume={volume}>
        {children}
      </SoundProvider>
    </HomeSoundContext.Provider>
  );
}

export function PageSoundBoundary({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return pathname === "/" ? children : <SoundProvider enabled={false}>{children}</SoundProvider>;
}

export function HomeSoundToggle() {
  const { play } = useSound();
  const playRef = useRef(play);
  const tickFrame = useRef<number | null>(null);

  useEffect(() => {
    playRef.current = play;
  }, [play]);

  useEffect(
    () => () => {
      if (tickFrame.current !== null) cancelAnimationFrame(tickFrame.current);
    },
    [],
  );
  const settings = useContext(HomeSoundContext);
  if (!settings) throw new Error("HomeSoundToggle requires HomeSoundProvider.");

  const audible = settings.enabled && settings.volume > 0;

  return (
    <ButtonGroup
      aria-label="Audio controls"
      className={`ninaero-button--outline ${styles.soundControl}`}
    >
      <div className={styles.volumeReveal}>
        <div className={styles.volumeBar}>
          <Slider
            variant="simple"
            sound={false}
            aria-label="Sound effects volume"
            value={settings.enabled ? Math.round(settings.volume * 100) : 0}
            min={0}
            max={100}
            step={1}
            getAriaValueText={(_, value) => `${value}%`}
            onValueChange={(value) => {
              const volume = (Array.isArray(value) ? value[0] : value) / 100;
              settings.setVolume(volume);
              settings.setEnabled(volume > 0);

              if (tickFrame.current !== null) cancelAnimationFrame(tickFrame.current);
              if (volume > 0) {
                // Apply the provider's new gain before previewing it, coalescing rapid changes per frame.
                tickFrame.current = requestAnimationFrame(() => {
                  tickFrame.current = null;
                  playRef.current("tick");
                });
              }
            }}
          />
        </div>
      </div>
      <Button
        variant="ghost"
        className={styles.soundToggle}
        size="icon"
        aria-label="Sound effects"
        aria-pressed={audible}
        title={audible ? "Mute sound effects" : "Enable sound effects"}
        sound={false}
        onClick={() => {
          if (settings.volume === 0) settings.setVolume(defaultSoundSettings.volume);
          settings.setEnabled(!audible);
        }}
      >
        {audible ? <VolumeIcon /> : <VolumeOffIcon />}
      </Button>
    </ButtonGroup>
  );
}
