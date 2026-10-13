import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { theme } from "../../../registry/ninaero/theme.mjs";
import { renderThemeCss } from "../theme.mjs";

const source = await readFile(
  new URL("../../../registry/ninaero/ui/textarea.tsx", import.meta.url),
  "utf8",
);
const classes = source.match(/className=\{cn\(\s*"([^"]+)"/)[1].split(" ");
const components = theme.css["@layer components"];
const fields = (suffix = "") => {
  const selectSuffix = suffix === "::placeholder" ? "[data-placeholder]" : suffix;
  const selectors = `.ninaero-input${suffix}, .ninaero-textarea${suffix}, .ninaero-select-trigger${selectSuffix}`;
  if (suffix === ":disabled") return `${selectors}, .ninaero-select-trigger[data-disabled]`;
  if (suffix === "[aria-invalid=true]")
    return `${selectors}, .ninaero-select-trigger[data-invalid]`;
  return selectors;
};

test("Textarea shares Input's material recipe instead of maintaining a separate field style", () => {
  assert.ok(classes.includes("ninaero-textarea"));
  assert.equal(components[".ninaero-textarea"], undefined);
  assert.equal(components[".ninaero-input"], undefined);
  const shared = components[fields()];
  assert.ok(shared);
  assert.equal(shared["--input-corner"], "0.875rem");
  assert.equal(shared["corner-shape"], "squircle");
  assert.equal(shared.border, "1px solid var(--input-edge)");
  assert.equal(shared["background-color"], "var(--card)");
  assert.equal(shared.color, "var(--card-foreground)");
  assert.equal(
    shared["box-shadow"],
    "inset 0 1px 2px var(--input-recess-shade), inset 0 -1px 0 var(--input-recess-highlight)",
  );
  assert.match(
    renderThemeCss(theme),
    /\.ninaero-input, \.ninaero-textarea, \.ninaero-select-trigger \{[^}]*corner-shape: squircle;/,
  );
  assert.ok(
    !classes.some((value) =>
      /(^|:)(bg-|border|rounded-|ring-|shadow-|opacity-|outline-)/.test(value),
    ),
  );
});

test("Textarea shares Input's placeholder, invalid, focus, disabled, and accessibility overrides", () => {
  assert.equal(components[fields("::placeholder")].color, "var(--input-placeholder)");
  assert.equal(components[fields(":focus-visible")]["outline-color"], "var(--ring)");
  assert.equal(components[fields("[aria-invalid=true]")]["border-color"], "var(--destructive)");
  assert.equal(components[fields(":disabled")]["background-color"], "var(--input-disabled-fill)");
  assert.equal(components[fields(":disabled")].color, "var(--muted-foreground)");
  assert.equal(components[fields(":disabled")]["box-shadow"], "none");
  assert.equal(components["@media (prefers-reduced-motion: reduce)"][fields()].transition, "none");
  const forced = components["@media (forced-colors: active)"];
  assert.equal(forced[fields()]["background-color"], "Canvas");
  assert.equal(forced[fields()]["box-shadow"], "none");
  assert.equal(forced[fields("::placeholder")].color, "GrayText");
  assert.equal(forced[fields(":focus-visible")]["outline-color"], "Highlight");
  assert.equal(forced[fields("[aria-invalid=true]")]["border-color"], "CanvasText");
  assert.equal(forced[fields(":disabled")].color, "GrayText");
});

test("Textarea retains its native element, multiline sizing, props, and consumer class overrides", () => {
  for (const fragment of [
    "<textarea",
    'React.ComponentProps<"textarea">',
    'data-slot="textarea"',
    "{...props}",
    "export { Textarea }",
    "className,",
  ]) {
    assert.ok(source.includes(fragment), fragment);
  }
  for (const value of [
    "field-sizing-content",
    "min-h-16",
    "w-full",
    "min-w-0",
    "px-3",
    "py-2",
    "text-base",
    "md:text-sm",
    "disabled:cursor-not-allowed",
  ]) {
    assert.ok(classes.includes(value), value);
  }
  assert.ok(!classes.some((value) => value.startsWith("resize-")));
  assert.ok(!source.includes("ResizeObserver"));
});

test("InputGroupTextarea lets its group own the frame and focus indicator", async () => {
  const group = await readFile(
    new URL("../../../registry/ninaero/ui/input-group.tsx", import.meta.url),
    "utf8",
  );
  const control = group.slice(
    group.indexOf("function InputGroupTextarea("),
    group.indexOf("export {"),
  );
  for (const value of [
    "resize-none",
    "rounded-none",
    "border-0",
    "bg-transparent",
    "shadow-none",
    "outline-none",
  ]) {
    assert.ok(control.includes(value), value);
  }
});

test("published Textarea source contains the aligned component and shared theme dependency", async () => {
  const published = JSON.parse(
    await readFile(new URL("../../../public/r/textarea.json", import.meta.url), "utf8"),
  );
  const file = published.files.find((entry) => entry.path.endsWith("/textarea.tsx"));
  assert.ok(file);
  assert.equal(file.content, source);
  assert.ok(
    published.registryDependencies.some((dependency) => dependency.endsWith("/theme.json")),
  );
});
