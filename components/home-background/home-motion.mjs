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
