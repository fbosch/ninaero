"use client";

import {
  createContext,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
  useContext,
  useId,
  useMemo,
  useState,
} from "react";

import { Field, FieldLabel } from "@/registry/ninaero/ui/field";
import { Switch } from "@/registry/ninaero/ui/switch";

import { createAmbientPause, type AmbientPauseController } from "./home-motion.mjs";

const HomeMotionContext = createContext<{
  paused: boolean;
  ambientPause: AmbientPauseController;
  setPaused: Dispatch<SetStateAction<boolean>>;
} | null>(null);

export function HomeMotionProvider({ children }: { children: ReactNode }) {
  const [paused, setPaused] = useState(false);
  const [ambientPause] = useState(createAmbientPause);
  const value = useMemo(() => ({ paused, setPaused, ambientPause }), [paused, ambientPause]);

  return <HomeMotionContext.Provider value={value}>{children}</HomeMotionContext.Provider>;
}

export function useHomeMotion() {
  const settings = useContext(HomeMotionContext);
  if (!settings) throw new Error("useHomeMotion requires HomeMotionProvider.");
  return settings;
}

export function HomeMotionSettings() {
  const id = useId();
  const { paused, setPaused } = useHomeMotion();

  return (
    <Field
      orientation="horizontal"
      className="flex-wrap justify-between motion-reduce:hidden forced-colors:hidden"
    >
      <FieldLabel htmlFor={id}>Background animation</FieldLabel>
      <Switch
        id={id}
        checked={!paused}
        onCheckedChange={(enabled) => setPaused(!enabled)}
        sound={false}
      />
    </Field>
  );
}
