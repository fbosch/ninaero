import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { theme } from "../../../registry/ninaero/theme.mjs";
import { renderThemeCss } from "../theme.mjs";

const source = await readFile(
  new URL("../../../registry/ninaero/ui/dialog.tsx", import.meta.url),
  "utf8",
);
const components = theme.css["@layer components"];
const content = source.slice(
  source.indexOf("function DialogContent("),
  source.indexOf("function DialogHeader("),
);
const footer = source.slice(
  source.indexOf("function DialogFooter("),
  source.indexOf("function DialogTitle("),
);
const classes = (section) => section.match(/className=\{cn\(\s*"([^"]+)"/)[1].split(" ");

test("Dialog uses broad native squircle corners without clipping focus or shadows", () => {
  const frame = components[".ninaero-dialog"];
  assert.equal(frame["--dialog-corner"], "3rem");
  assert.equal(frame["border-radius"], "var(--dialog-corner)");
  assert.equal(frame["corner-shape"], "squircle");
  assert.ok(classes(content).includes("ninaero-dialog"));
  assert.ok(!classes(content).some((value) => /^(rounded-|overflow-|clip-|mask-)/.test(value)));
  for (const property of ["overflow", "clip-path", "mask"])
    assert.equal(frame[property], undefined);
});

test("Dialog footer shares the panel instead of adding a separate band", () => {
  assert.equal(components[".ninaero-dialog-footer"], undefined);
  for (const value of ["-mx-6", "-mb-6", "p-6", "border-t", "bg-muted/50", "ninaero-dialog-footer"])
    assert.ok(!classes(footer).includes(value));
  assert.ok(classes(footer).includes("[&>button]:min-w-24"));
  assert.ok(classes(footer).includes("gap-2"));
  assert.ok(!classes(footer).some((value) => value.startsWith("rounded-")));
});

test("Dialog groups content with one 24px outer inset and reserves room for the close control", () => {
  assert.ok(classes(content).includes("p-6"));
  assert.ok(classes(content).includes("gap-6"));
  assert.match(content, /className="absolute top-4 right-4"/);
  assert.deepEqual(
    components['.ninaero-dialog:has(> [data-slot="dialog-close"]) [data-slot="dialog-header"]'],
    { "padding-inline-end": "2rem" },
  );
  assert.match(source, /font-heading text-xl leading-6 font-medium/);
});

test("Dialog uses a continuous neutral material with shallow lighting and layered elevation", () => {
  const frame = components[".ninaero-dialog"];
  assert.equal(
    frame.border,
    "1px solid color-mix(in oklab, var(--foreground) 18%, var(--popover))",
  );
  assert.equal(frame["background-color"], "var(--popover)");
  assert.equal(
    frame["background-image"],
    "linear-gradient(180deg, var(--popover), var(--dialog-fill-shade))",
  );
  assert.match(
    frame["box-shadow"],
    /^inset 0 1px 0 var\(--dialog-highlight\), inset 0 -1px 2px var\(--dialog-shade\), /,
  );
  assert.ok(frame["box-shadow"].includes(theme.theme["shadow-xl"]));
  for (const mode of ["light", "dark"]) {
    assert.match(
      theme[mode]["dialog-fill-shade"],
      /^color-mix\(in oklab, var\(--popover\) \d+%, black\)$/,
    );
    assert.equal(theme[mode]["dialog-highlight"].slice(1, 7), "ffffff");
    assert.equal(theme[mode]["dialog-shade"].slice(1, 7), "000000");
  }
  assert.ok(!classes(content).some((value) => /^(bg-|shadow-|ring-)/.test(value)));
});

test("Dialog keeps responsive bounds, caller overrides, and Base UI primitives", () => {
  for (const value of ["text-popover-foreground", "max-w-[calc(100%-2rem)]", "sm:max-w-sm"])
    assert.ok(classes(content).includes(value));
  assert.match(content, /<DialogPrimitive\.Popup/);
  assert.match(content, /<DialogPrimitive\.Close/);
  assert.match(content, /showCloseButton = true/);
  assert.match(content, /className,\s*\)/);
});

test("Generated theme CSS includes Dialog material and a forced-colors boundary", () => {
  const css = renderThemeCss(theme);
  assert.match(
    css,
    /\.ninaero-dialog \{[^}]*--dialog-corner: 3rem;[^}]*border-radius: var\(--dialog-corner\);[^}]*corner-shape: squircle;/,
  );
  assert.ok(css.includes("inset 0 1px 0 var(--dialog-highlight)"));
  assert.deepEqual(components["@media (forced-colors: active)"][".ninaero-dialog"], {
    "border-color": "CanvasText",
    "background-color": "Canvas",
    "background-image": "none",
    color: "CanvasText",
    "box-shadow": "none",
  });
});

test("Dialog opening uses an elastic transform with a bounded single overshoot", () => {
  const frame = components[".ninaero-dialog"];
  assert.equal(
    frame.transition,
    "opacity 140ms ease-out, transform 260ms cubic-bezier(0.22, 2.2, 0.35, 1)",
  );
  assert.equal(frame["transform-origin"], "center");
  assert.deepEqual(components[".ninaero-dialog[data-starting-style]"], {
    opacity: "0",
    transform: "translateY(8px) scale(0.92)",
  });
  const [, y1, , y2] = frame.transition
    .match(/cubic-bezier\(([^)]+)\)/)[1]
    .split(",")
    .map(Number);
  const curve = (t) => 3 * (1 - t) ** 2 * t * y1 + 3 * (1 - t) * t ** 2 * y2 + t ** 3;
  const peak = Math.max(...Array.from({ length: 201 }, (_, i) => curve(i / 200)));
  const peakScale = 0.92 + 0.08 * peak;
  assert.ok(peakScale > 1.01 && peakScale < 1.03);
  assert.equal(curve(1), 1);
});

test("Dialog dismissal uses interruptible transitions without canned animations", () => {
  assert.deepEqual(components[".ninaero-dialog[data-ending-style]"], {
    opacity: "0",
    transform: "translateY(4px) scale(0.96)",
    transition: "opacity 140ms ease-in, transform 140ms ease-in",
  });
  assert.equal(components[".ninaero-dialog"].animation, undefined);
  assert.ok(!classes(content).some((value) => /animate-|zoom-|fade-|duration-/.test(value)));
  const overlay = source.slice(
    source.indexOf("function DialogOverlay("),
    source.indexOf("function DialogContent("),
  );
  assert.ok(classes(overlay).includes("ninaero-dialog-overlay"));
  assert.ok(!classes(overlay).some((value) => /animate-|fade-|duration-/.test(value)));
});

test("Dialog scrim fades without bouncing and shares the shorter exit timing", () => {
  assert.deepEqual(components[".ninaero-dialog-overlay"], {
    opacity: "1",
    transition: "opacity 160ms ease-out",
  });
  assert.equal(components[".ninaero-dialog-overlay[data-starting-style]"].opacity, "0");
  assert.deepEqual(components[".ninaero-dialog-overlay[data-ending-style]"], {
    opacity: "0",
    "transition-duration": "140ms",
  });
});

test("Reduced motion removes Dialog movement and fades across every lifecycle state", () => {
  const selector =
    ".ninaero-dialog, .ninaero-dialog[data-starting-style], .ninaero-dialog[data-ending-style], .ninaero-dialog-overlay, .ninaero-dialog-overlay[data-starting-style], .ninaero-dialog-overlay[data-ending-style]";
  assert.deepEqual(components["@media (prefers-reduced-motion: reduce)"][selector], {
    animation: "none",
    transition: "none",
    transform: "none",
    opacity: "1",
  });
  assert.match(renderThemeCss(theme), /@media \(prefers-reduced-motion: reduce\)/);
});
