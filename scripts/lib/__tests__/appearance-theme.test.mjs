import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { accentRules } from "../../../registry/ninaero/accents.mjs";
import { buttonRecessShadow, elevations, theme } from "../../../registry/ninaero/theme.mjs";

const components = theme.css["@layer components"];
const pressSelector =
  ".ninaero-toggle:active:not(:disabled):not([data-disabled]):not([aria-disabled=true])";
const disabledSelector =
  ".ninaero-toggle:disabled, .ninaero-toggle[data-disabled], .ninaero-toggle[aria-disabled=true]";

test("Toggle and Popover use native squircles without clipping focus or elevation", () => {
  for (const selector of [".ninaero-toggle", ".ninaero-popover"]) {
    const rules = components[selector];
    assert.equal(rules["corner-shape"], "squircle");
    assert.ok(rules["border-radius"]);
    assert.equal(rules["clip-path"], undefined);
    assert.equal(rules.mask, undefined);
    assert.equal(rules.overflow, undefined);
  }
  assert.equal(components[".ninaero-toggle"].outline, "2px solid transparent");
  assert.equal(components[".ninaero-toggle"]["outline-offset"], "3px");
});

test("Toggle is matte at rest and reserves accent edges for selection and focus", () => {
  assert.equal(components[".ninaero-toggle"].border, "1px solid transparent");
  assert.equal(components[".ninaero-toggle"]["box-shadow"], undefined);
  assert.equal(components[".ninaero-toggle--outline"]["border-color"], "var(--input)");
  const selected = components[".ninaero-toggle[aria-pressed=true]"];
  assert.equal(selected["background-color"], "var(--accent-soft)");
  assert.equal(selected.color, "var(--accent-foreground)");
  assert.equal(selected["border-color"], "var(--button-primary-edge)");
  assert.equal(selected["box-shadow"], "inset 0 1px 0 var(--button-highlight)");
  assert.equal(components[".ninaero-toggle:focus-visible"]["outline-color"], "var(--ring)");
  assert.equal(
    components[".ninaero-toggle[aria-invalid=true]"]["border-color"],
    "var(--button-destructive-edge)",
  );
});

test("Toggle press feedback is recessed, disabled-safe, and motion-independent", () => {
  assert.equal(components[pressSelector]["box-shadow"], buttonRecessShadow);
  assert.equal(components[pressSelector]["background-color"], "var(--button-recess-fill)");
  assert.equal(components[disabledSelector]["box-shadow"], "none");
  assert.equal(components[disabledSelector].opacity, "0.5");
  assert.equal(
    components["@media (prefers-reduced-motion: reduce)"][".ninaero-toggle"].transition,
    "none",
  );
  const hover = components["@media (hover: hover)"];
  const selector = Object.keys(hover).find((key) => key.startsWith(".ninaero-toggle:hover"));
  assert.ok(selector.includes(":not(:disabled)"));
  assert.ok(selector.includes(":not([data-disabled])"));
  assert.ok(selector.includes(":not([aria-disabled=true])"));
  assert.ok(selector.includes(":not([aria-pressed=true])"));
});

test("Popover uses opaque paper, a neutral frame, and the shared floating elevation", () => {
  const popover = components[".ninaero-popover"];
  assert.equal(popover.border, "1px solid var(--border)");
  assert.equal(popover["background-color"], "var(--popover)");
  assert.ok(popover["box-shadow"].endsWith(elevations.floating));
  assert.equal(popover["backdrop-filter"], undefined);
  for (const mode of ["light", "dark"]) {
    assert.equal(theme[mode].popover, "var(--button-paper-fill)");
    assert.equal(theme[mode]["popover-foreground"], "var(--button-paper-ink)");
  }
  for (const rules of Object.values(accentRules)) {
    assert.equal(rules["--popover"], undefined);
    assert.equal(rules["--popover-foreground"], undefined);
  }
});

test("forced colors keep selected, focused, pressed, disabled, and invalid states legible", () => {
  const forced = components["@media (forced-colors: active)"];
  assert.equal(forced[".ninaero-popover"]["box-shadow"], "none");
  assert.equal(forced[".ninaero-popover"]["border-color"], "CanvasText");
  assert.equal(forced[".ninaero-toggle[aria-pressed=true]"]["background-color"], "Highlight");
  assert.equal(forced[".ninaero-toggle[aria-pressed=true]"].color, "HighlightText");
  assert.equal(forced[".ninaero-toggle:focus-visible"]["outline-color"], "Highlight");
  assert.equal(forced[pressSelector]["box-shadow"], "none");
  assert.equal(forced[disabledSelector].color, "GrayText");
  assert.equal(forced[".ninaero-toggle[aria-invalid=true]"]["border-color"], "ButtonText");
});

test("the registry publishes the shared recipes and matching installable components", async () => {
  const publishedTheme = JSON.parse(
    await readFile(new URL("../../../public/r/theme.json", import.meta.url), "utf8"),
  );
  assert.deepEqual(publishedTheme.css, theme.css);
  for (const name of ["toggle", "toggle-group", "popover"]) {
    const source = await readFile(
      new URL(`../../../registry/ninaero/ui/${name}.tsx`, import.meta.url),
      "utf8",
    );
    const published = JSON.parse(
      await readFile(new URL(`../../../public/r/${name}.json`, import.meta.url), "utf8"),
    );
    const file = published.files.find((entry) => entry.path.endsWith(`/${name}.tsx`));
    assert.ok(file, name);
    assert.equal(file.content, source, name);
    if (name === "toggle") {
      assert.ok(source.includes("ninaero-toggle"));
      assert.ok(!source.includes("rounded-"));
      assert.ok(!source.includes("focus-visible:ring"));
    }
    if (name === "toggle-group") assert.ok(source.includes("toggleVariants({"));
    if (name === "popover") assert.ok(source.includes("ninaero-popover"));
  }
});
