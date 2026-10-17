"use client";

import { useEffect, useId, useRef } from "react";

import { createBubbleEntrances } from "./bubble-entrance";
import {
  bubbleShape,
  createBubbles,
  dragBubble,
  growBubble,
  maxBubbleRadius,
  maxBubbles,
  releaseBubble,
  resizeBubbles,
  spawnBubble,
  stepBubbles,
  updateBubbleWarp,
  type Bubble,
} from "./bubble-physics.mjs";
import { clearBubblePops, showBubblePop } from "./bubble-pop";
import { bubbleRefractionTexture } from "./bubble-refraction";
import { bubbleRefractionStrength } from "./bubble-refraction.mjs";

import styles from "./home-bubbles.module.css";

const slots = Array.from({ length: maxBubbles }, (_, i) => i);
const rimWidth = 1.5;

type HeldBubble = {
  bubble: Bubble;
  pointerId: number;
  targetX: number;
  targetY: number;
  offsetX: number;
  offsetY: number;
  vx: number;
  vy: number;
  created: boolean;
  originalVelocity: { vx: number; vy: number };
};

export function HomeBubbles({ paused }: { paused: boolean }) {
  const refractionId = useId();
  const refractionImageRef = useRef<SVGFEImageElement>(null);
  const pausedRef = useRef(paused);
  const lensFieldRef = useRef<HTMLDivElement>(null);
  const fieldRef = useRef<HTMLDivElement>(null);
  const popLayerRef = useRef<HTMLDivElement>(null);
  const resumeRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const field = lensFieldRef.current;
    const map = refractionImageRef.current;
    if (!field || !map || !CSS.supports("backdrop-filter", `url("#${refractionId}")`)) return;
    const texture = bubbleRefractionTexture();
    if (!texture) return;
    let active = true;
    const image = new Image();
    image.src = texture;
    void image
      .decode()
      .then(() => {
        if (!active) return;
        map.setAttribute("href", texture);
        field.style.setProperty("--bubble-refraction", `url("#${refractionId}")`);
      })
      .catch(() => {
        // This optional enhancement leaves the plain glass fill intact if decoding fails.
        if (active) field.style.removeProperty("--bubble-refraction");
      });
    return () => {
      active = false;
      field.style.removeProperty("--bubble-refraction");
    };
  }, [refractionId]);

  useEffect(() => {
    const fieldElement = fieldRef.current;
    const lensField = lensFieldRef.current;
    const surfaceElement = fieldElement?.closest("main");
    const popElement = popLayerRef.current;
    if (!fieldElement || !lensField || !surfaceElement || !popElement) return;
    const field = fieldElement;
    const surface = surfaceElement;
    const popLayer = popElement;

    const elements = Array.from(field.querySelectorAll<HTMLSpanElement>(":scope > span"));
    const lensElements = Array.from(lensField.querySelectorAll<HTMLSpanElement>(":scope > span"));
    const layers = elements.map((element, index) => [element, lensElements[index]]);
    const outlines = Array.from(field.querySelectorAll("ellipse"));
    const entrances = createBubbleEntrances(
      Array.from(lensField.getElementsByClassName(styles.bubbleLens)),
      Array.from(field.getElementsByClassName(styles.bubbleSurface)),
    );
    const painted = elements.map(() => ({ radius: NaN, angle: NaN, scaleX: NaN, scaleY: NaN }));
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const forcedColors = window.matchMedia("(forced-colors: active)");
    let bubbles: Bubble[] = [];
    let width = 0;
    let height = 0;
    let frame = 0;
    let previousTime: number | null = null;
    let simulationTime = 0;
    let held: HeldBubble | null = null;

    function paint() {
      layers.forEach((pair, index) => {
        const bubble = bubbles[index];
        for (const element of pair) {
          if (element.hidden !== !bubble) element.hidden = !bubble;
        }
        if (!bubble) return;
        const previous = painted[index];
        const radiusChanged = previous.radius !== bubble.radius;
        const shape = bubbleShape(bubble);
        const transform = `translate(${bubble.x - bubble.radius}px, ${bubble.y - bubble.radius}px)`;
        for (const element of pair) {
          const style = element.style;
          if (radiusChanged) {
            style.width = `${bubble.radius * 2}px`;
            style.height = `${bubble.radius * 2}px`;
          }
          style.transform = transform;
          if (previous.angle !== shape.angle) {
            style.setProperty("--bubble-angle", `${shape.angle}rad`);
            style.setProperty("--bubble-counter-angle", `${-shape.angle}rad`);
          }
          if (previous.scaleX !== shape.scaleX) {
            style.setProperty("--bubble-scale-x", String(shape.scaleX));
            style.setProperty("--bubble-inverse-x", String(1 / shape.scaleX));
          }
          if (previous.scaleY !== shape.scaleY) {
            style.setProperty("--bubble-scale-y", String(shape.scaleY));
            style.setProperty("--bubble-inverse-y", String(1 / shape.scaleY));
          }
        }
        const outline = outlines[index];
        if (radiusChanged) {
          outline.setAttribute("cx", String(bubble.radius));
          outline.setAttribute("cy", String(bubble.radius));
        }
        if (radiusChanged || previous.scaleX !== shape.scaleX) {
          outline.setAttribute(
            "rx",
            String(Math.max(0, bubble.radius * shape.scaleX - rimWidth / 2)),
          );
        }
        if (radiusChanged || previous.scaleY !== shape.scaleY) {
          outline.setAttribute(
            "ry",
            String(Math.max(0, bubble.radius * shape.scaleY - rimWidth / 2)),
          );
        }
        previous.radius = bubble.radius;
        previous.angle = shape.angle;
        previous.scaleX = shape.scaleX;
        previous.scaleY = shape.scaleY;
      });
    }

    function enabled() {
      return (
        !pausedRef.current && !document.hidden && !reducedMotion.matches && !forcedColors.matches
      );
    }

    function endHold(action: "launch" | "cancel" | "pop") {
      if (!held) return;
      const current = held;
      const { bubble, pointerId } = current;
      held = null;
      if (action === "launch") {
        const velocity = Math.hypot(current.vx, current.vy) > 8 ? current : undefined;
        releaseBubble(bubble, velocity);
      } else if (action === "pop" || current.created) {
        if (action === "pop" && enabled()) {
          showBubblePop(
            popLayer,
            { ...bubble, vx: current.vx, vy: current.vy },
            {
              pop: styles.pop,
              popRing: styles.popRing,
              popDroplet: styles.popDroplet,
            },
          );
        }
        bubbles.splice(bubbles.indexOf(bubble), 1);
      } else {
        releaseBubble(bubble, current.originalVelocity);
      }
      if (surface.hasPointerCapture(pointerId)) surface.releasePointerCapture(pointerId);
      paint();
    }

    function sampleDrag(elapsed: number) {
      if (!held || elapsed <= 0) return;
      const movement = dragBubble(
        held.bubble,
        bubbles,
        width,
        height,
        held.targetX,
        held.targetY,
        elapsed,
      );
      const smoothing = 1 - Math.exp(-18 * elapsed);
      held.vx += (movement.dx / elapsed - held.vx) * smoothing;
      held.vy += (movement.dy / elapsed - held.vy) * smoothing;
    }

    function animate(time: number) {
      frame = 0;
      if (!enabled()) return;
      const elapsed = previousTime === null ? 0 : Math.min((time - previousTime) / 1000, 0.05);
      previousTime = time;
      if (held && elapsed > 0) {
        sampleDrag(elapsed);
        updateBubbleWarp(held.bubble, held.vx, held.vy, elapsed);
        if (held.created) {
          growBubble(held.bubble, bubbles, width, height, elapsed);
          if (held.bubble.radius >= maxBubbleRadius) endHold("pop");
        }
      }
      stepBubbles(bubbles, width, height, elapsed, simulationTime);
      simulationTime += elapsed;
      paint();
      if (enabled()) frame = requestAnimationFrame(animate);
    }

    function syncAnimation() {
      cancelAnimationFrame(frame);
      previousTime = null;
      entrances.sync(
        pausedRef.current || document.hidden,
        reducedMotion.matches || forcedColors.matches,
      );
      if (!enabled()) {
        endHold("cancel");
        clearBubblePops(popLayer);
      }
      if (enabled()) frame = requestAnimationFrame(animate);
    }

    function onPointerDown(event: PointerEvent) {
      if (!enabled() || held || !event.isPrimary || event.button !== 0) return;
      const target = event.target;
      if (!(target instanceof HTMLElement) || !target.matches("main, div, section")) return;
      if (
        target.closest("a, button, input, textarea, select, pre, code, [role], [contenteditable]")
      )
        return;
      const bounds = field.getBoundingClientRect();
      const x = event.clientX - bounds.left;
      const y = event.clientY - bounds.top;
      const existing = bubbles.find(
        (bubble) => Math.hypot(x - bubble.x, y - bubble.y) <= bubble.radius,
      );
      const bubble = existing ?? spawnBubble(bubbles, width, height, x, y);
      if (!bubble) return;
      entrances.reveal(bubble);
      held = {
        bubble,
        pointerId: event.pointerId,
        targetX: bubble.x,
        targetY: bubble.y,
        offsetX: bubble.x - x,
        offsetY: bubble.y - y,
        vx: 0,
        vy: 0,
        created: !existing,
        originalVelocity: { vx: bubble.vx, vy: bubble.vy },
      };
      bubble.held = true;
      bubble.vx = 0;
      bubble.vy = 0;
      bubble.dragVX = 0;
      bubble.dragVY = 0;
      surface.setPointerCapture(event.pointerId);
      if (event.pointerType === "mouse") event.preventDefault();
      paint();
      syncAnimation();
    }

    function onPointerMove(event: PointerEvent) {
      if (!held || held.pointerId !== event.pointerId) return;
      const bounds = field.getBoundingClientRect();
      held.targetX = event.clientX - bounds.left + held.offsetX;
      held.targetY = event.clientY - bounds.top + held.offsetY;
    }

    function onPointerUp(event: PointerEvent) {
      if (event.pointerId !== held?.pointerId) return;
      onPointerMove(event);
      const elapsed = Math.max(
        1 / 240,
        Math.min(0.05, (performance.now() - (previousTime ?? performance.now())) / 1000),
      );
      sampleDrag(elapsed);
      endHold("launch");
      syncAnimation();
    }

    function onPointerCancel(event: PointerEvent) {
      if (event.pointerId !== held?.pointerId) return;
      endHold("cancel");
      syncAnimation();
    }

    function cancelHold() {
      endHold("cancel");
      syncAnimation();
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") cancelHold();
    }

    const observer = new ResizeObserver(([entry]) => {
      const nextWidth = entry.contentRect.width;
      const nextHeight = entry.contentRect.height;
      if (nextWidth <= 0 || nextHeight <= 0 || (nextWidth === width && nextHeight === height))
        return;
      const initialLayout = width === 0;
      endHold("launch");
      clearBubblePops(popLayer);
      if (width === 0) bubbles = createBubbles(nextWidth, nextHeight);
      else {
        const popped = resizeBubbles(bubbles, nextWidth, nextHeight);
        if (popped.length) entrances.clear();
        if (enabled()) {
          for (const bubble of popped) {
            showBubblePop(
              popLayer,
              {
                ...bubble,
                x: Math.min(nextWidth, Math.max(0, bubble.x)),
                y: Math.min(nextHeight, Math.max(0, bubble.y)),
              },
              {
                pop: styles.pop,
                popRing: styles.popRing,
                popDroplet: styles.popDroplet,
              },
            );
          }
        }
      }
      width = nextWidth;
      height = nextHeight;
      paint();
      if (initialLayout && !reducedMotion.matches && !forcedColors.matches) {
        entrances.start(bubbles);
      }
      syncAnimation();
    });
    observer.observe(field);
    resumeRef.current = syncAnimation;
    reducedMotion.addEventListener("change", syncAnimation);
    forcedColors.addEventListener("change", syncAnimation);
    document.addEventListener("visibilitychange", syncAnimation);
    surface.addEventListener("pointerdown", onPointerDown);
    surface.addEventListener("pointermove", onPointerMove);
    surface.addEventListener("pointerup", onPointerUp);
    surface.addEventListener("pointercancel", onPointerCancel);
    surface.addEventListener("lostpointercapture", onPointerCancel);
    window.addEventListener("blur", cancelHold);
    window.addEventListener("scroll", cancelHold, { passive: true });
    window.addEventListener("keydown", onKeyDown);

    return () => {
      cancelAnimationFrame(frame);
      endHold("cancel");
      clearBubblePops(popLayer);
      observer.disconnect();
      entrances.clear();
      resumeRef.current = null;
      reducedMotion.removeEventListener("change", syncAnimation);
      forcedColors.removeEventListener("change", syncAnimation);
      document.removeEventListener("visibilitychange", syncAnimation);
      surface.removeEventListener("pointerdown", onPointerDown);
      surface.removeEventListener("pointermove", onPointerMove);
      surface.removeEventListener("pointerup", onPointerUp);
      surface.removeEventListener("pointercancel", onPointerCancel);
      surface.removeEventListener("lostpointercapture", onPointerCancel);
      window.removeEventListener("blur", cancelHold);
      window.removeEventListener("scroll", cancelHold);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  useEffect(() => {
    pausedRef.current = paused;
    resumeRef.current?.();
  }, [paused]);

  return (
    <>
      <svg className={styles.filterDefinitions} aria-hidden="true" focusable="false">
        <defs>
          <filter
            id={refractionId}
            x="-10%"
            y="-10%"
            width="120%"
            height="120%"
            filterUnits="objectBoundingBox"
            primitiveUnits="objectBoundingBox"
            colorInterpolationFilters="sRGB"
          >
            <feImage
              ref={refractionImageRef}
              x="0"
              y="0"
              width="1"
              height="1"
              preserveAspectRatio="none"
              result="displacement"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="displacement"
              scale={bubbleRefractionStrength}
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>
      <div ref={lensFieldRef} className={styles.lensField} aria-hidden="true">
        {slots.map((slot) => (
          <span key={slot} className={styles.bubble} hidden>
            <span className={styles.bubbleLens} />
          </span>
        ))}
      </div>
      <div ref={fieldRef} className={styles.field} aria-hidden="true">
        {slots.map((slot) => (
          <span key={slot} className={styles.bubble} hidden>
            <span className={styles.bubbleSurface}>
              <span className={styles.bubbleShape} />
              <svg className={styles.bubbleRim} aria-hidden="true" focusable="false">
                <ellipse strokeWidth={rimWidth} vectorEffect="non-scaling-stroke" />
              </svg>
            </span>
          </span>
        ))}
        <div ref={popLayerRef} className={styles.popLayer} />
      </div>
    </>
  );
}
