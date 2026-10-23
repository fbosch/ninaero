// Ambient pacing only; pointer-driven physics and feedback retain real elapsed time.
export const ambientMotionRate = 2 / 3;

// Slow ambient drift reads the same at 30 fps, and each painted frame repaints the
// filtered and blended background layers, so cap it independently of the display rate.
export const ambientFrameRate = 30;
const ambientFrameInterval = 1000 / ambientFrameRate;

/**
 * Reports whether a rAF timestamp starts a new ambient frame since `previousTime`.
 * Timestamps are shared by every rAF callback in a frame, so quantizing them keeps
 * separate ambient loops painting on the same display frames.
 */
export function isAmbientFrame(time, previousTime) {
  if (previousTime === null) return true;
  return (
    Math.floor(time / ambientFrameInterval) !== Math.floor(previousTime / ambientFrameInterval)
  );
}

export function createAmbientPause() {
  const pauses = new Set();
  const listeners = new Set();
  const notify = () => {
    for (const listener of listeners) listener();
  };

  return {
    isPaused: () => pauses.size > 0,
    subscribe(listener) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    pause() {
      const token = {};
      pauses.add(token);
      if (pauses.size === 1) notify();
      return () => {
        if (pauses.delete(token) && pauses.size === 0) notify();
      };
    },
  };
}

// Keep the pause through exit; canceling a queued open must release it too.
export function createModalMotionGate(
  ambient,
  frames = {
    request: (callback) => requestAnimationFrame(callback),
    cancel: (frame) => cancelAnimationFrame(frame),
  },
) {
  let release = null;
  let frame = null;

  return {
    isPending: () => frame !== null,
    open(callback, immediate = false) {
      if (frame !== null) return;
      release ??= ambient.pause();
      if (immediate) {
        callback();
        return;
      }
      frame = frames.request(() => {
        frame = null;
        callback();
      });
    },
    finish() {
      if (frame !== null) {
        frames.cancel(frame);
        frame = null;
      }
      release?.();
      release = null;
    },
  };
}
