"use client";

import { useEffect, useRef, useState } from "react";

import { PauseIcon, PlayIcon } from "@/lib/icons";
import { Button } from "@/registry/ninaero/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/registry/ninaero/ui/tooltip";

import { watchAmbientActivity } from "./ambient-activity";
import { HomeBubbles } from "./home-bubbles";
import { HomeSky } from "./home-sky";
import { HomeSoundToggle } from "./home-sound";
import { HomeWaves } from "./home-waves";

import styles from "./home-background.module.css";

export function HomeBackground() {
  const [paused, setPaused] = useState(false);
  const [active, setActive] = useState(true);
  const controlsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scene = controlsRef.current?.closest("main");
    if (!scene) return;
    return watchAmbientActivity(scene, setActive);
  }, []);

  const motionPaused = paused || !active;

  const motionLabel = paused ? "Resume background animation" : "Pause background animation";
  return (
    <>
      <HomeSky />
      <HomeWaves paused={motionPaused} />
      <HomeBubbles paused={motionPaused} />
      <div
        ref={controlsRef}
        role="group"
        aria-label="Homepage controls"
        className={styles.controls}
      >
        <HomeSoundToggle />
        <Tooltip>
          <TooltipTrigger
            sound={false}
            render={
              <Button
                variant="outline"
                size="icon"
                className={styles.motionControl}
                aria-label={motionLabel}
                onClick={() => setPaused((value) => !value)}
              />
            }
          >
            {paused ? <PlayIcon /> : <PauseIcon />}
          </TooltipTrigger>
          <TooltipContent>{motionLabel}</TooltipContent>
        </Tooltip>
      </div>
    </>
  );
}
