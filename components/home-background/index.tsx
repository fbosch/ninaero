"use client";

import { useState } from "react";

import { PauseIcon, PlayIcon } from "@/lib/icons";
import { Button } from "@/registry/ninaero/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/registry/ninaero/ui/tooltip";

import { HomeBubbles } from "./home-bubbles";
import { HomeSky } from "./home-sky";
import { HomeSoundToggle } from "./home-sound";
import { HomeWaves } from "./home-waves";

import styles from "./home-background.module.css";

export function HomeBackground() {
  const [paused, setPaused] = useState(false);

  const motionLabel = paused ? "Resume background animation" : "Pause background animation";
  return (
    <>
      <HomeSky />
      <HomeWaves paused={paused} />
      <HomeBubbles paused={paused} />
      <div role="group" aria-label="Homepage controls" className={styles.controls}>
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
