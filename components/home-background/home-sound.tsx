"use client";

import { cn } from "cn";
import { usePathname } from "next/navigation";
import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";

import { VolumeIcon, VolumeOffIcon } from "@/lib/icons";
import { Button } from "@/registry/ninaero/ui/button";
import { ButtonGroup } from "@/registry/ninaero/ui/button-group";
import { Field, FieldGroup, FieldLabel, FieldTitle } from "@/registry/ninaero/ui/field";
import { Slider } from "@/registry/ninaero/ui/slider";
import { SoundProvider, useSound } from "@/registry/ninaero/ui/sound-provider";
import { defaultSoundSettings } from "@/registry/ninaero/ui/sound-runtime";
import { Switch } from "@/registry/ninaero/ui/switch";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/registry/ninaero/ui/tooltip";

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

export function HomeSoundToggle({ inline = false }: { inline?: boolean }) {
  const id = useId();
  const volumeLabelId = `${id}-volume`;
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

  const volume = settings.enabled ? Math.round(settings.volume * 100) : 0;

  const setAudible = (enabled: boolean) => {
    if (enabled && settings.volume === 0) settings.setVolume(defaultSoundSettings.volume);
    settings.setEnabled(enabled);
  };

  const slider = (
    <Slider
      variant="simple"
      sound={false}
      aria-label={inline ? undefined : "Sound effects volume"}
      aria-labelledby={inline ? volumeLabelId : undefined}
      value={volume}
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
  );

  if (inline) {
    return (
      <FieldGroup className="gap-4">
        <Field orientation="horizontal" className="flex-wrap justify-between">
          <FieldLabel htmlFor={id}>Sound effects</FieldLabel>
          <Switch id={id} checked={audible} onCheckedChange={setAudible} sound={false} />
        </Field>
        <Field className="gap-2">
          <div className="flex items-center justify-between gap-3">
            <FieldTitle id={volumeLabelId}>Volume</FieldTitle>
            <span aria-hidden="true" className="text-xs tabular-nums text-muted-foreground">
              {volume}%
            </span>
          </div>
          {slider}
        </Field>
      </FieldGroup>
    );
  }

  return (
    <ButtonGroup
      aria-label="Audio controls"
      className={cn("ninaero-button--outline", styles.soundControl)}
    >
      <div className={styles.volumeReveal}>
        <div className={styles.volumeBar}>{slider}</div>
      </div>
      <Tooltip>
        <TooltipTrigger
          sound={false}
          render={
            <Button
              variant="ghost"
              className={styles.soundToggle}
              size="icon"
              aria-label="Sound effects"
              aria-pressed={audible}
              sound={false}
              onClick={() => setAudible(!audible)}
            />
          }
        >
          {audible ? <VolumeIcon /> : <VolumeOffIcon />}
        </TooltipTrigger>
        <TooltipContent>{audible ? "Mute sound effects" : "Enable sound effects"}</TooltipContent>
      </Tooltip>
    </ButtonGroup>
  );
}
