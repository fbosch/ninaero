export const ambientIdleTimeout = 60_000;

const inputEvents = ["pointermove", "keydown", "wheel", "touchstart"] as const;

/**
 * Reports whether ambient motion is worth rendering: the scene is on screen, the window
 * has focus, and the visitor has interacted within `ambientIdleTimeout`. A held pointer
 * never goes idle. Returns a cleanup function.
 */
export function watchAmbientActivity(
  scene: Element,
  onChange: (active: boolean) => void,
  idleTimeout = ambientIdleTimeout,
) {
  let lastInput = performance.now();
  let pressed = false;
  let idle = false;
  let focused = document.hasFocus();
  let visible = true;
  let reported: boolean | null = null;
  let timer = 0;

  function report() {
    const active = visible && focused && !idle;
    if (active === reported) return;
    reported = active;
    onChange(active);
  }

  function scheduleIdle(delay: number) {
    window.clearTimeout(timer);
    timer = window.setTimeout(checkIdle, delay);
  }

  // Inputs only record a timestamp; the single timer re-arms for the remaining time.
  function checkIdle() {
    if (pressed) return;
    const remaining = lastInput + idleTimeout - performance.now();
    if (remaining > 0) {
      scheduleIdle(remaining);
      return;
    }
    idle = true;
    report();
  }

  function onInput() {
    lastInput = performance.now();
    if (!idle) return;
    idle = false;
    report();
    scheduleIdle(idleTimeout);
  }

  function onPointerDown() {
    pressed = true;
    onInput();
  }

  function onPointerRelease() {
    pressed = false;
    onInput();
    scheduleIdle(idleTimeout);
  }

  function onFocus() {
    focused = true;
    onInput();
    report();
  }

  function onBlur() {
    focused = false;
    report();
  }

  const observer = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    report();
  });
  observer.observe(scene);

  const options = { capture: true, passive: true };
  for (const type of inputEvents) window.addEventListener(type, onInput, options);
  window.addEventListener("scroll", onInput, options);
  window.addEventListener("pointerdown", onPointerDown, options);
  window.addEventListener("pointerup", onPointerRelease, options);
  window.addEventListener("pointercancel", onPointerRelease, options);
  window.addEventListener("focus", onFocus);
  window.addEventListener("blur", onBlur);
  scheduleIdle(idleTimeout);
  report();

  return () => {
    window.clearTimeout(timer);
    observer.disconnect();
    for (const type of inputEvents) window.removeEventListener(type, onInput, options);
    window.removeEventListener("scroll", onInput, options);
    window.removeEventListener("pointerdown", onPointerDown, options);
    window.removeEventListener("pointerup", onPointerRelease, options);
    window.removeEventListener("pointercancel", onPointerRelease, options);
    window.removeEventListener("focus", onFocus);
    window.removeEventListener("blur", onBlur);
  };
}
