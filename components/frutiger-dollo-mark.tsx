import {
  frutigerDolloBodyStops,
  frutigerDolloHighlightStops,
  frutigerDolloPaths,
  frutigerDolloShadowStops,
  frutigerDolloStopColor,
  type FrutigerDolloStop,
  frutigerDolloViewBox,
} from "@/lib/frutiger-dollo-mark";
import { cn } from "@/lib/utils";

import styles from "./frutiger-dollo-mark.module.css";

type FrutigerDolloMarkProps = {
  className?: string;
};

function Stops({ stops }: { stops: readonly FrutigerDolloStop[] }) {
  return stops.map(({ offset, sourceColor, opacity }) => (
    <stop
      key={offset}
      offset={offset}
      stopColor={frutigerDolloStopColor(sourceColor)}
      stopOpacity={opacity}
    />
  ));
}

export function FrutigerDolloMark({ className }: FrutigerDolloMarkProps) {
  return (
    <svg
      aria-hidden="true"
      className={cn(styles.mark, className)}
      width={24}
      height={20}
      viewBox={frutigerDolloViewBox}
    >
      <defs>
        <linearGradient
          id="frutiger-dollo-body"
          x1="130.88"
          y1="-45.76"
          x2="133.45"
          y2="219.92"
          gradientUnits="userSpaceOnUse"
        >
          <Stops stops={frutigerDolloBodyStops} />
        </linearGradient>
        <linearGradient
          id="frutiger-dollo-shadow"
          x1="0"
          y1="110.66"
          x2="266.04"
          y2="110.66"
          gradientUnits="userSpaceOnUse"
        >
          <Stops stops={frutigerDolloShadowStops} />
        </linearGradient>
        <linearGradient
          id="frutiger-dollo-highlight"
          x1="231.41"
          y1="178.1"
          x2="231.55"
          y2="192.8"
          gradientTransform="translate(-7.49 -294.91) rotate(29.31) scale(1.08 1.15)"
          gradientUnits="userSpaceOnUse"
        >
          <Stops stops={frutigerDolloHighlightStops} />
        </linearGradient>
        <linearGradient
          id="frutiger-dollo-tail-highlight"
          x1="-17.03"
          y1="-175.55"
          x2="-16.57"
          y2="-127.29"
          gradientTransform="translate(96.13 202.53) rotate(42.19) scale(1.08 1.15)"
          href="#frutiger-dollo-highlight"
        />
        <filter id="frutiger-dollo-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="24" />
        </filter>
        <linearGradient
          id="frutiger-dollo-rim"
          x1="0"
          y1="0"
          x2="0"
          y2="221.32"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="white" stopOpacity=".38" />
          <stop offset=".42" stopColor="white" stopOpacity=".18" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path className={styles.glow} fill="var(--button-primary-fill)" d={frutigerDolloPaths.body} />
      <g>
        <path fill="url(#frutiger-dollo-body)" d={frutigerDolloPaths.body} />
        <path fill="url(#frutiger-dollo-shadow)" d={frutigerDolloPaths.shadow} />
        <path fill="url(#frutiger-dollo-highlight)" d={frutigerDolloPaths.highlight} />
        <path fill="url(#frutiger-dollo-tail-highlight)" d={frutigerDolloPaths.tailHighlight} />
      </g>
      <path
        className={styles.material}
        fill="none"
        stroke="url(#frutiger-dollo-rim)"
        strokeWidth="3"
        d={frutigerDolloPaths.body}
      />
    </svg>
  );
}
