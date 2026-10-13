import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { theme } from "../../../registry/ninaero/theme.mjs";
import { renderThemeCss } from "../theme.mjs";

const components = theme.css["@layer components"];
const input = components[".ninaero-input"];

test("Input uses smaller native squircle corners than Button without clipping", () => {
  assert.equal(input["corner-shape"], "squircle");
  assert.equal(input["border-radius"], "var(--input-corner)");
  assert.equal(input["--input-corner"], "0.5rem");
  assert.ok(
    Number.parseFloat(input["--input-corner"]) <
      Number.parseFloat(components[".ninaero-button"]["--button-corner"]),
  );
  for (const property of [
    "clip-path",
    "mask",
    "overflow",
    "box-shadow",
    "background-image",
    "transform",
  ]) {
    assert.equal(input[property], undefined, property);
  }
  assert.match(renderThemeCss(theme), /\.ninaero-input \{[^}]*corner-shape: squircle;/);
});

test("Input keeps focus immediate and removes material transitions under reduced motion", () => {
  assert.equal(input.transition, "background-color 80ms ease-out, border-color 80ms ease-out");
  assert.equal(
    components["@media (prefers-reduced-motion: reduce)"][".ninaero-input"].transition,
    "none",
  );
  assert.equal(components[".ninaero-input:focus-visible"]["outline-color"], "var(--ring)");
});

test("forced-colors Input uses system boundaries, disabled ink, and keyboard focus", () => {
  const forced = components["@media (forced-colors: active)"];
  assert.deepEqual(forced[".ninaero-input"], {
    "border-color": "CanvasText",
    "background-color": "Canvas",
    color: "CanvasText",
  });
  assert.equal(forced[".ninaero-input[aria-invalid=true]"]["border-color"], "CanvasText");
  assert.equal(forced[".ninaero-input:focus-visible"]["outline-color"], "Highlight");
  assert.deepEqual(forced[".ninaero-input:disabled"], {
    "border-color": "GrayText",
    "background-color": "Canvas",
    color: "GrayText",
  });
});

test("Input preserves its primitive, dimensions, file styling, exports, and native props", async () => {
  const source = await readFile(
    new URL("../../../registry/ninaero/ui/input.tsx", import.meta.url),
    "utf8",
  );
  assert.ok(source.includes('from "@base-ui/react/input"'));
  assert.ok(source.includes('React.ComponentProps<"input">'));
  assert.ok(source.includes("export { Input }"));
  assert.ok(source.includes("{...props}"));
  for (const value of [
    "h-8",
    "w-full",
    "min-w-0",
    "file:inline-flex",
    "placeholder:text-muted-foreground",
  ]) {
    assert.ok(source.includes(value), value);
  }
  assert.ok(!source.includes("rounded-"));
  assert.ok(!source.includes("ResizeObserver"));
});

test("InputGroupInput suppresses the inner outline so its group owns focus", async () => {
  const source = await readFile(
    new URL("../../../registry/ninaero/ui/input-group.tsx", import.meta.url),
    "utf8",
  );
  const control = source.slice(
    source.indexOf("function InputGroupInput("),
    source.indexOf("function InputGroupTextarea("),
  );
  for (const value of ["rounded-none", "border-0", "bg-transparent", "outline-none"]) {
    assert.ok(control.includes(value), value);
  }
});
