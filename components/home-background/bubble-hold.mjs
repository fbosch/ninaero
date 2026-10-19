export function bubbleHoldOutcome(action, created) {
  if (action === "launch") return "launch";
  if (action === "pop") return "pop";
  if (created) return "pop";
  return "release";
}
