import { useId, type ComponentProps } from "react";

export function NinaeroMark(props: ComponentProps<"svg">) {
  const gradientId = useId();

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      {...props}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--primary)" />
          <stop offset="100%" stopColor="var(--ring)" />
        </linearGradient>
        <radialGradient id={`${gradientId}-body`} cx="32%" cy="26%" r="78%">
          <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.08} />
          <stop offset="60%" stopColor="var(--primary)" stopOpacity={0.28} />
          <stop offset="100%" stopColor="var(--ring)" stopOpacity={0.4} />
        </radialGradient>
      </defs>
      <g
        fill="none"
        stroke={`url(#${gradientId})`}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx={12} cy={12} r={9.25} fill={`url(#${gradientId}-body)`} />
        <path d="M7 11a5 5 0 0 1 4-4" stroke="var(--button-highlight)" />
      </g>
    </svg>
  );
}
