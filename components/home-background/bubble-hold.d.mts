export type BubbleHoldAction = "launch" | "cancel" | "pop";
export type BubbleHoldOutcome = "launch" | "release" | "pop";

export function bubbleHoldOutcome(action: BubbleHoldAction, created: boolean): BubbleHoldOutcome;
