export type Bubble = {
  x: number;
  y: number;
  radius: number;
  vx: number;
  vy: number;
  dragVX?: number;
  dragVY?: number;
  held?: boolean;
  age?: number;
  warpX?: number;
  warpY?: number;
  warpVX?: number;
  warpVY?: number;
};

export const bubbleGap: number;
export const maxBubbles: number;
export const maxBubbleRadius: number;
export const maxThrowSpeed: number;
export function updateBubbleWarp(bubble: Bubble, vx: number, vy: number, elapsed: number): void;
export function bubbleShape(bubble: Bubble): { angle: number; scaleX: number; scaleY: number };
export function createBubbles(width: number, height: number, random?: () => number): Bubble[];
export function spawnBubble(
  bubbles: Bubble[],
  width: number,
  height: number,
  x: number,
  y: number,
): Bubble | null;
export function growBubble(
  bubble: Bubble,
  bubbles: Bubble[],
  width: number,
  height: number,
  elapsed: number,
): void;
export function releaseBubble(bubble: Bubble, velocity?: { vx: number; vy: number }): void;
export function dragBubble(
  bubble: Bubble,
  bubbles: Bubble[],
  width: number,
  height: number,
  x: number,
  y: number,
  elapsed: number,
): { dx: number; dy: number };
export function resizeBubbles(bubbles: Bubble[], width: number, height: number): Bubble[];
export function bubbleCurrent(
  x: number,
  y: number,
  width: number,
  height: number,
  time: number,
): { vx: number; vy: number };
export function stepBubbles(
  bubbles: Bubble[],
  width: number,
  height: number,
  elapsed: number,
  time?: number,
): void;
export function bubblesNeedFullFrameRate(bubbles: Bubble[]): boolean;
