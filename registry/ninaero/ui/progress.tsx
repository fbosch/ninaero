"use client";

import { Progress as ProgressPrimitive } from "@base-ui/react/progress";
import { cn } from "cn";
import { useEffect, useId, useRef } from "react";

import { useControlSound } from "./sound-feedback";

function Progress({
  className,
  children,
  value,
  min = 0,
  max = 100,
  variant = "linear",
  sound = true,
  ...props
}: ProgressPrimitive.Root.Props & { variant?: "linear" | "circular"; sound?: boolean }) {
  const gradientId = useId();
  const { play } = useControlSound(sound);
  const previous = useRef({ value, max });
  useEffect(() => {
    const before = previous.current;
    previous.current = { value, max };
    if (before.max === max && value === max && before.value !== max) play("complete");
  }, [value, max, play]);

  const percentage =
    value == null || !Number.isFinite(value)
      ? null
      : Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100 || 0));

  return (
    <ProgressPrimitive.Root
      value={value}
      min={min}
      max={max}
      data-slot="progress"
      className={cn(
        "flex flex-wrap gap-3",
        variant === "circular" && "w-fit items-center",
        className,
      )}
      {...props}
    >
      {children}
      {variant === "circular" ? (
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          strokeWidth="3"
          className="ninaero-progress-circular size-5 shrink-0"
        >
          <defs>
            <linearGradient id={`${gradientId}-track`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" className="ninaero-progress-track-shade" />
              <stop offset="0.5" className="ninaero-progress-track-fill" />
              <stop offset="1" className="ninaero-progress-track-highlight" />
            </linearGradient>
            <linearGradient id={`${gradientId}-indicator`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" className="ninaero-progress-indicator-highlight" />
              <stop offset="0.5" className="ninaero-progress-indicator-middle" />
              <stop offset="1" className="ninaero-progress-indicator-fill" />
            </linearGradient>
          </defs>
          <circle
            cx="12"
            cy="12"
            r="9"
            strokeWidth="4.5"
            className="ninaero-progress-circular-edge"
          />
          <circle
            cx="12"
            cy="12"
            r="9"
            stroke={`url(#${gradientId}-track)`}
            className="ninaero-progress-circular-track"
          />
          <g
            strokeDasharray={percentage === null ? "25 75" : "100"}
            strokeDashoffset={percentage === null ? 0 : 100 - percentage}
            strokeLinecap={percentage === 0 ? "butt" : "round"}
            data-indeterminate={percentage === null ? "" : undefined}
            className="ninaero-progress-circular-indicator"
          >
            <path
              d="M12 3a9 9 0 1 1 0 18a9 9 0 1 1 0-18"
              pathLength="100"
              strokeWidth="4.5"
              className="ninaero-progress-circular-rim"
            />
            <path
              d="M12 3a9 9 0 1 1 0 18a9 9 0 1 1 0-18"
              pathLength="100"
              stroke={`url(#${gradientId}-indicator)`}
            />
          </g>
        </svg>
      ) : (
        <ProgressTrack>
          <ProgressIndicator />
        </ProgressTrack>
      )}
    </ProgressPrimitive.Root>
  );
}

function ProgressTrack({ className, ...props }: ProgressPrimitive.Track.Props) {
  return (
    <ProgressPrimitive.Track
      className={cn(
        "relative flex h-1 w-full items-center overflow-x-hidden rounded-full bg-muted",
        className,
      )}
      data-slot="progress-track"
      {...props}
    />
  );
}

function ProgressIndicator({ className, ...props }: ProgressPrimitive.Indicator.Props) {
  return (
    <ProgressPrimitive.Indicator
      data-slot="progress-indicator"
      className={cn("h-full bg-primary transition-all", className)}
      {...props}
    />
  );
}

function ProgressLabel({ className, ...props }: ProgressPrimitive.Label.Props) {
  return (
    <ProgressPrimitive.Label
      className={cn("text-sm font-medium", className)}
      data-slot="progress-label"
      {...props}
    />
  );
}

function ProgressValue({ className, ...props }: ProgressPrimitive.Value.Props) {
  return (
    <ProgressPrimitive.Value
      className={cn("ml-auto text-sm text-muted-foreground tabular-nums", className)}
      data-slot="progress-value"
      {...props}
    />
  );
}

export { Progress, ProgressTrack, ProgressIndicator, ProgressLabel, ProgressValue };
