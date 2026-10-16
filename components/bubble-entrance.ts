import { maxBubbleRadius, type Bubble } from "@/lib/bubble-physics.mjs";
import { ambientMotionRate } from "@/lib/home-motion.mjs";

export function createBubbleEntrances(lenses: Element[], surfaces: Element[]) {
  const active = new Map<Bubble, Animation[]>();

  function reveal(bubble: Bubble) {
    const animations = active.get(bubble);
    if (!animations) return;
    active.delete(bubble);
    for (const animation of animations) animation.cancel();
  }

  function clear() {
    for (const bubble of active.keys()) reveal(bubble);
  }

  function start(bubbles: Bubble[]) {
    clear();
    const targets = bubbles.map((bubble, index) => ({
      bubble,
      lens: lenses[index],
      surface: surfaces[index],
      lensOpacity: getComputedStyle(lenses[index]).opacity,
      surfaceOpacity: getComputedStyle(surfaces[index]).opacity,
    }));
    targets.forEach(({ bubble, lens, surface, lensOpacity, surfaceOpacity }, index) => {
      const progress = index / Math.max(1, targets.length - 1);
      const spread = Math.min(2400, targets.length * 400);
      const variation = (index * 0.61803398875) % 1;
      const duration = Math.round(
        (1000 + Math.min(bubble.radius / maxBubbleRadius, 1) * 500 + variation * 140) /
          ambientMotionRate,
      );
      const delay = Math.round(
        (spread * progress ** 0.75 + Math.sin(index * 2.4) * 65) / ambientMotionRate,
      );
      const timing: KeyframeAnimationOptions = {
        duration,
        delay,
        easing: "cubic-bezier(0.32, 0, 0.2, 1)",
        fill: "backwards",
      };
      // Fading a common ancestor would isolate the lens from the page backdrop.
      const animations = [
        lens.animate([{ opacity: 0 }, { opacity: lensOpacity }], {
          ...timing,
          duration: Math.round(duration * 0.85),
          delay: delay + Math.round(duration * 0.12),
          easing: "cubic-bezier(0.4, 0, 0.25, 1)",
        }),
        surface.animate([{ opacity: 0 }, { opacity: surfaceOpacity }], timing),
      ];
      active.set(bubble, animations);
      for (const animation of animations) {
        animation.onfinish = () => {
          if (animations.every((entry) => entry.playState === "finished")) reveal(bubble);
        };
      }
    });
  }

  function sync(paused: boolean, disabled: boolean) {
    if (disabled) {
      clear();
      return;
    }
    for (const animations of active.values()) {
      for (const animation of animations) {
        if (animation.playState === "finished") continue;
        if (paused && animation.playState !== "paused") animation.pause();
        else if (!paused && animation.playState === "paused") animation.play();
      }
    }
  }

  return { start, reveal, clear, sync };
}
