import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { theme } from "../../../registry/ninaero/theme.mjs";
import { renderThemeCss } from "../theme.mjs";

const components = theme.css["@layer components"];
const input = components[".ninaero-input, .ninaero-textarea"];

test("Input uses smaller native squircle corners than Button without clipping", () => {
  assert.equal(input["corner-shape"], "squircle");
  assert.equal(input["border-radius"], "var(--input-corner)");
  assert.equal(input["--input-corner"], "0.875rem");
  assert.ok(
    Number.parseFloat(input["--input-corner"]) <
      Number.parseFloat(components[".ninaero-button"]["--button-corner"]),
  );
  for (const property of ["clip-path", "mask", "overflow", "background-image", "transform"]) {
    assert.equal(input[property], undefined, property);
  }
  assert.match(
    renderThemeCss(theme),
    /\.ninaero-input, \.ninaero-textarea \{[^}]*corner-shape: squircle;/,
  );
});

test("Input softens its neutral edge while retaining 3:1 contrast on paper and content fills", () => {
  const luminance = (hex) => {
    assert.match(hex, /^#([\da-f]{2})\1\1$/i);
    const channel = Number.parseInt(hex.slice(1, 3), 16) / 255;
    return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
  };
  assert.equal(input.border, "1px solid var(--input-edge)");
  for (const mode of ["light", "dark"]) {
    const palette = theme[mode];
    const edge = luminance(palette["input-edge"]);
    const shared = luminance(palette["neutral-input"]);
    assert.ok(mode === "light" ? edge > shared : edge < shared);
    const card = palette.card.match(/^oklch\(([\d.]+) 0 0\)$/);
    assert.ok(card);
    for (const fill of [luminance(palette["paper-fill"]), Number(card[1]) ** 3]) {
      const contrast = (Math.max(edge, fill) + 0.05) / (Math.min(edge, fill) + 0.05);
      assert.ok(contrast >= 3, `${mode} field edge: ${contrast.toFixed(2)}:1`);
    }
  }
});

test("Input derives a shallow recess from its opaque neutral fill without cast elevation", () => {
  assert.equal(
    input["--input-recess-shade"],
    "color-mix(in oklab, var(--card), black var(--input-recess-shade-weight))",
  );
  assert.equal(
    input["--input-recess-highlight"],
    "color-mix(in oklab, var(--card), white var(--input-recess-highlight-weight))",
  );
  assert.equal(
    input["box-shadow"],
    "inset 0 1px 2px var(--input-recess-shade), inset 0 -1px 0 var(--input-recess-highlight)",
  );
  assert.equal(theme.light["input-recess-shade-weight"], "4%");
  assert.equal(theme.dark["input-recess-shade-weight"], "6%");
  assert.equal(theme.light["input-recess-highlight-weight"], "6%");
  assert.equal(theme.dark["input-recess-highlight-weight"], "8%");
});

test("disabled Input removes its recess and does not brighten the dark fill", () => {
  assert.equal(
    components[".ninaero-input:disabled, .ninaero-textarea:disabled"]["box-shadow"],
    "none",
  );
  assert.equal(theme.light["input-disabled-fill"], "var(--muted)");
  assert.equal(theme.dark["input-disabled-fill"], "var(--card)");
});

test("Input text and placeholders retain contrast against both recessed edge tones", () => {
  for (const mode of ["light", "dark"]) {
    const palette = theme[mode];
    const lightness = (token) => {
      const alias = palette[token].match(/^var\(--([a-z-]+)\)$/);
      if (alias) return lightness(alias[1]);
      const match = palette[token].match(/^oklch\(([\d.]+) 0 0\)$/);
      assert.ok(match, token);
      return Number(match[1]);
    };
    const fill = lightness("card");
    const shade = fill * (1 - Number.parseFloat(palette["input-recess-shade-weight"]) / 100);
    const highlight =
      fill + ((1 - fill) * Number.parseFloat(palette["input-recess-highlight-weight"])) / 100;
    for (const token of ["card-foreground", "input-placeholder"]) {
      const ink = lightness(token) ** 3;
      for (const tone of [fill, shade, highlight]) {
        const luminance = tone ** 3;
        const contrast = (Math.max(ink, luminance) + 0.05) / (Math.min(ink, luminance) + 0.05);
        assert.ok(contrast >= 4.5, `${mode} ${token}: ${contrast.toFixed(2)}:1`);
      }
    }
  }
});

test("Input keeps focus immediate and removes material transitions under reduced motion", () => {
  assert.equal(input.transition, "background-color 80ms ease-out, border-color 80ms ease-out");
  assert.equal(
    components["@media (prefers-reduced-motion: reduce)"][".ninaero-input, .ninaero-textarea"]
      .transition,
    "none",
  );
  assert.equal(
    components[".ninaero-input:focus-visible, .ninaero-textarea:focus-visible"]["outline-color"],
    "var(--ring)",
  );
});

test("forced-colors Input uses system boundaries, disabled ink, and keyboard focus", () => {
  const forced = components["@media (forced-colors: active)"];
  assert.deepEqual(forced[".ninaero-input, .ninaero-textarea"], {
    "border-color": "CanvasText",
    "background-color": "Canvas",
    color: "CanvasText",
    "box-shadow": "none",
  });
  assert.equal(
    forced[".ninaero-input::placeholder, .ninaero-textarea::placeholder"].color,
    "GrayText",
  );
  assert.equal(
    forced[".ninaero-input[aria-invalid=true], .ninaero-textarea[aria-invalid=true]"][
      "border-color"
    ],
    "CanvasText",
  );
  assert.equal(
    forced[".ninaero-input:focus-visible, .ninaero-textarea:focus-visible"]["outline-color"],
    "Highlight",
  );
  assert.deepEqual(forced[".ninaero-input:disabled, .ninaero-textarea:disabled"], {
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
  for (const value of ["h-8", "w-full", "min-w-0", "px-3", "file:inline-flex"]) {
    assert.ok(source.includes(value), value);
  }
  assert.ok(!source.includes("rounded-"));
  assert.ok(!source.includes("ResizeObserver"));
  assert.equal(
    components[".ninaero-input::placeholder, .ninaero-textarea::placeholder"].color,
    "var(--input-placeholder)",
  );
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
  for (const value of [
    "rounded-none",
    "border-0",
    "bg-transparent",
    "shadow-none",
    "outline-none",
  ]) {
    assert.ok(control.includes(value), value);
  }
});
