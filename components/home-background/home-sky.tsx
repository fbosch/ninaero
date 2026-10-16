import { useId } from "react";

import styles from "./home-background.module.css";

export function HomeSky() {
  const id = useId();

  return (
    <div className={styles.sky} aria-hidden="true">
      <svg
        className={styles.clouds}
        viewBox="0 0 1440 900"
        preserveAspectRatio="none"
        focusable="false"
      >
        <defs>
          <filter
            id={`${id}-clouds`}
            x="-8%"
            y="-40%"
            width="116%"
            height="180%"
            colorInterpolationFilters="sRGB"
          >
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.006 0.02"
              numOctaves="3"
              seed="12"
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="64"
              xChannelSelector="R"
              yChannelSelector="G"
              result="outline"
            />
            <feGaussianBlur in="outline" stdDeviation="10" result="soft-cloud" />
            <feColorMatrix
              in="noise"
              type="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 1.6 0 -0.2"
              result="density"
            />
            <feComposite in="soft-cloud" in2="density" operator="in" />
          </filter>
        </defs>
        <g fill="var(--sky-cloud)" filter={`url(#${id}-clouds)`}>
          <ellipse cx="220" cy="180" rx="290" ry="58" />
          <ellipse cx="1160" cy="265" rx="230" ry="48" />
          <ellipse cx="940" cy="525" rx="300" ry="55" />
        </g>
      </svg>
    </div>
  );
}
