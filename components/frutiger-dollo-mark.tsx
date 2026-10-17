import {
  frutigerDolloBodyStops,
  frutigerDolloHighlightStops,
  frutigerDolloPaths,
  frutigerDolloShadowStops,
  frutigerDolloViewBox,
} from "@/lib/frutiger-dollo-mark";

type FrutigerDolloMarkProps = {
  className?: string;
};

function Stops({
  stops,
}: {
  stops: readonly { offset: string; token: string; fallback: string; opacity?: string }[];
}) {
  return stops.map(({ offset, token, fallback, opacity }) => (
    <stop
      key={offset}
      offset={offset}
      stopColor={`var(--${token}, ${fallback})`}
      stopOpacity={opacity}
    />
  ));
}

export function FrutigerDolloMark({ className }: FrutigerDolloMarkProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
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
          x1="228.07"
          y1="175.45"
          x2="228.24"
          y2="192.51"
          gradientTransform="translate(-39.7 -281.31) rotate(23.23) scale(1.08 1.15)"
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
      </defs>
      <g>
        <path fill="url(#frutiger-dollo-body)" d={frutigerDolloPaths.body} />
        <path fill="url(#frutiger-dollo-shadow)" d={frutigerDolloPaths.shadow} />
        <path fill="url(#frutiger-dollo-highlight)" d={frutigerDolloPaths.highlight} />
        <path fill="url(#frutiger-dollo-tail-highlight)" d={frutigerDolloPaths.tailHighlight} />
      </g>
    </svg>
  );
}
