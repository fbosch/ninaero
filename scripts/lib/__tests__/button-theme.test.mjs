import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { theme } from "../../../registry/ninaero/theme.mjs";
import { renderThemeCss } from "../theme.mjs";

const components = theme.css["@layer components"];
const button = components[".ninaero-button"];

function luminance(hex) {
  const channels = hex
    .slice(1)
    .match(/.{2}/g)
    .map((channel) => Number.parseInt(channel, 16) / 255)
    .map((channel) =>
      channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4,
    );
  return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
}

function contrast(first, second) {
  const values = [luminance(first), luminance(second)].sort((a, b) => b - a);
  return (values[0] + 0.05) / (values[1] + 0.05);
}

test("Button uses native squircle curves without clipping its focus outline", () => {
  assert.equal(button["corner-shape"], "squircle");
  assert.equal(button["border-radius"], "var(--button-corner)");
  assert.equal(button["--button-corner"], "1rem");
  assert.equal(button.outline, "2px solid transparent");
  assert.equal(button["outline-offset"], "3px");
  assert.equal(button["clip-path"], undefined);
  assert.equal(button.mask, undefined);
  const css = renderThemeCss(theme);
  assert.ok(css.includes("corner-shape: squircle;"));
  assert.ok(css.includes("outline-offset: 3px;"));
});

test("Accent roles follow the palette while paper surfaces remain neutral", () => {
  assert.equal(theme.light.background, "oklch(1 0 0)");
  assert.equal(theme.dark.background, "oklch(0.145 0 0)");
  assert.equal(theme.light.primary, "var(--button-primary-fill)");
  assert.equal(theme.dark.primary, "var(--button-primary-fill)");
  for (const palette of [theme.light, theme.dark]) {
    assert.ok(palette["button-primary-fill"]);
    assert.ok(palette["button-paper-fill"]);
    assert.ok(palette["button-focus"]);
  }
});

for (const [mode, palette] of [
  ["light", theme.light],
  ["dark", theme.dark],
]) {
  test(`${mode} primary and paper labels meet 4.5:1 solid-fill contrast`, () => {
    for (const material of ["primary", "paper"]) {
      for (const state of ["fill", "hover"]) {
        const ratio = contrast(
          palette[`button-${material}-ink`],
          palette[`button-${material}-${state}`],
        );
        assert.ok(ratio >= 4.5, `${material} ${state}: ${ratio.toFixed(2)}:1`);
      }
    }
  });

  test(`${mode} focus and matte-control edges meet 3:1 on paper`, () => {
    const background = palette["button-paper-fill"];
    for (const token of [
      "button-focus",
      "button-paper-edge",
      "button-outline-edge",
    ]) {
      const value = palette[token];
      const ratio = contrast(value, background);
      assert.ok(ratio >= 3, `${token}: ${ratio.toFixed(2)}:1`);
    }
  });
}

test("reduced motion removes press movement without a specificity override", () => {
  const activeSelector = Object.keys(components).find((selector) =>
    selector.includes(":active:not(:disabled)"),
  );
  assert.ok(activeSelector.includes(":not([data-disabled])"));
  assert.ok(activeSelector.includes(":not([aria-disabled=true])"));
  assert.ok(activeSelector.includes(":not([aria-haspopup])"));
  assert.equal(button["--button-press-shift"], "1px");
  assert.equal(
    components[activeSelector].transform,
    "translateY(var(--button-press-shift))",
  );
  const reduced =
    components["@media (prefers-reduced-motion: reduce)"][".ninaero-button"];
  assert.equal(reduced.transition, "none");
  assert.equal(reduced["--button-press-shift"], "0px");
});

test("forced-color focus remains a visible system-color outline", () => {
  const forced = components["@media (forced-colors: active)"];
  assert.equal(forced[".ninaero-button"]["background-image"], "none");
  assert.equal(forced[".ninaero-button"]["border-color"], "ButtonText");
  assert.equal(
    forced[".ninaero-button:focus-visible"]["outline-color"],
    "Highlight",
  );
  assert.equal(
    components[
      ".ninaero-button:disabled, .ninaero-button[data-disabled], .ninaero-button[aria-disabled=true]"
    ]["box-shadow"],
    "none",
  );
});

test("Button keeps its primitive, public exports, variants, sizes, and prop forwarding", async () => {
  const source = await readFile(
    new URL("../../../registry/ninaero/ui/button.tsx", import.meta.url),
    "utf8",
  );
  assert.ok(source.includes('from "@base-ui/react/button"'));
  assert.ok(
    source.includes(
      "ButtonPrimitive.Props & VariantProps<typeof buttonVariants>",
    ),
  );
  assert.ok(source.includes("export { Button, buttonVariants }"));
  assert.ok(source.includes("{...props}"));
  for (const variant of [
    "default",
    "outline",
    "secondary",
    "ghost",
    "destructive",
    "link",
  ]) {
    assert.ok(source.includes(`${variant}:`), variant);
  }
  for (const size of ["default", "xs", "sm", "lg", "icon"]) {
    assert.ok(source.includes(`${size}:`), size);
  }
  for (const size of ["icon-xs", "icon-sm", "icon-lg"]) {
    assert.ok(source.includes(`"${size}":`), size);
  }
  assert.ok(!source.includes("rounded-"));
  assert.ok(!source.includes("ResizeObserver"));
});
