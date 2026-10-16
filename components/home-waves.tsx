"use client";

import { useEffect, useId, useRef } from "react";

import { createWavePaths, waveLayers, waveViewBox } from "@/lib/home-waves.mjs";

import styles from "./home-background.module.css";

const initialWaves = waveLayers.map((layer) => createWavePaths(layer, 0));

export function HomeWaves({ paused }: { paused: boolean }) {
  const id = useId();
  const fieldRef = useRef<HTMLDivElement>(null);
  const timeRef = useRef(0);

  useEffect(() => {
    const field = fieldRef.current;
    if (!field) return;
    const bodies = field.querySelectorAll<SVGPathElement>("[data-wave-body]");
    const crests = field.querySelectorAll<SVGPathElement>("[data-wave-crest]");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const forcedColors = window.matchMedia("(forced-colors: active)");
    let frame = 0;
    let previousTime: number | null = null;

    function canAnimate() {
      return !paused && !document.hidden && !reducedMotion.matches && !forcedColors.matches;
    }

    function animate(time: number) {
      if (!canAnimate()) return;
      if (previousTime !== null) timeRef.current += Math.min((time - previousTime) / 1000, 0.05);
      previousTime = time;
      waveLayers.forEach((layer, index) => {
        const paths = createWavePaths(layer, timeRef.current);
        bodies[index].setAttribute("d", paths.body);
        crests[index].setAttribute("d", paths.crest);
      });
      frame = requestAnimationFrame(animate);
    }

    function syncAnimation() {
      cancelAnimationFrame(frame);
      previousTime = null;
      if (canAnimate()) frame = requestAnimationFrame(animate);
    }

    syncAnimation();
    reducedMotion.addEventListener("change", syncAnimation);
    forcedColors.addEventListener("change", syncAnimation);
    document.addEventListener("visibilitychange", syncAnimation);

    return () => {
      cancelAnimationFrame(frame);
      reducedMotion.removeEventListener("change", syncAnimation);
      forcedColors.removeEventListener("change", syncAnimation);
      document.removeEventListener("visibilitychange", syncAnimation);
    };
  }, [paused]);

  return (
    <div ref={fieldRef} className={styles.waves} aria-hidden="true">
      <svg
        viewBox={`0 0 ${waveViewBox.width} ${waveViewBox.height}`}
        preserveAspectRatio="none"
        focusable="false"
      >
        <defs>
          <linearGradient id={`${id}-body`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="var(--wave-highlight)" stopOpacity="0.5" />
            <stop offset="0.04" stopColor="var(--wave-color)" stopOpacity="0.25" />
            <stop offset="0.3" stopColor="var(--wave-color)" stopOpacity="0.12" />
            <stop offset="1" stopColor="var(--wave-color)" stopOpacity="0.04" />
          </linearGradient>
          <linearGradient id={`${id}-rim`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="var(--wave-highlight)" stopOpacity="0.2" />
            <stop offset="0.35" stopColor="var(--wave-highlight)" stopOpacity="0.85" />
            <stop offset="1" stopColor="var(--wave-color)" stopOpacity="0.35" />
          </linearGradient>
          {initialWaves.map(({ crest }, index) => (
            <path key={index} id={`${id}-crest-${index}`} data-wave-crest="" d={crest} />
          ))}
        </defs>
        {initialWaves.map(({ body }, index) => (
          <g key={index} className={styles.ribbon}>
            <path data-wave-body="" d={body} fill={`url(#${id}-body)`} />
            <use
              href={`#${id}-crest-${index}`}
              className={styles.glow}
              fill="none"
              stroke={`url(#${id}-rim)`}
              strokeWidth="10"
              vectorEffect="non-scaling-stroke"
            />
            <use
              href={`#${id}-crest-${index}`}
              fill="none"
              stroke={`url(#${id}-rim)`}
              strokeWidth="1.5"
              vectorEffect="non-scaling-stroke"
            />
          </g>
        ))}
      </svg>
    </div>
  );
}
