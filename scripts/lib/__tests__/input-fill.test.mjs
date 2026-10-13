import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { accentRules } from "../../../registry/ninaero/accents.mjs";
import { theme } from "../../../registry/ninaero/theme.mjs";

const source = await readFile(
  new URL("../../../registry/ninaero/ui/input.tsx", import.meta.url),
  "utf8",
);
const classes = source.match(/className=\{cn\(\s*"([^"]+)"/)[1].split(" ");

const components = theme.css["@layer components"];
const input = components[".ninaero-input, .ninaero-textarea, .ninaero-select-trigger"];
const disabled =
  components[
    ".ninaero-input:disabled, .ninaero-textarea:disabled, .ninaero-select-trigger:disabled, .ninaero-select-trigger[data-disabled]"
  ];
test("Input uses an opaque neutral content fill in either theme", () => {
  assert.ok(classes.includes("ninaero-input"));
  assert.equal(input["background-color"], "var(--card)");
  assert.equal(input.color, "var(--card-foreground)");
  assert.equal(input.border, "1px solid var(--input-edge)");
  assert.ok(!classes.some((value) => /(^|:)bg-/.test(value) && !value.startsWith("file:")));
  for (const mode of ["light", "dark"]) {
    for (const token of ["card", "muted"]) {
      assert.ok(!/transparent|\//.test(theme[mode][token]));
    }
  }
});

test("disabled Input stays opaque and signals its state without fading the whole field", () => {
  assert.equal(disabled["background-color"], "var(--input-disabled-fill)");
  assert.equal(disabled.color, "var(--muted-foreground)");
  assert.equal(disabled["border-color"], "var(--border)");
  assert.ok(classes.includes("disabled:cursor-not-allowed"));
  assert.ok(classes.includes("disabled:pointer-events-none"));
  assert.equal(disabled.opacity, undefined);
  assert.ok(!classes.some((value) => value.includes("opacity-")));
});

test("Input preserves a separate focus outline and semantic invalid border", () => {
  assert.equal(
    components[
      ".ninaero-input:focus-visible, .ninaero-textarea:focus-visible, .ninaero-select-trigger:focus-visible"
    ]["outline-color"],
    "var(--ring)",
  );
  assert.equal(
    components[
      ".ninaero-input[aria-invalid=true], .ninaero-textarea[aria-invalid=true], .ninaero-select-trigger[aria-invalid=true], .ninaero-select-trigger[data-invalid]"
    ]["border-color"],
    "var(--destructive)",
  );
  assert.equal(input.outline, "2px solid transparent");
  assert.equal(input["outline-offset"], "3px");
  assert.ok(!classes.some((value) => value.includes("ring-")));
});

test("accent presets do not recolor Input's neutral fill", () => {
  for (const rules of Object.values(accentRules)) {
    for (const token of [
      "--card",
      "--card-foreground",
      "--muted",
      "--input-edge",
      "--input-placeholder",
      "--input-disabled-fill",
      "--input-recess-shade-weight",
      "--input-recess-highlight-weight",
    ]) {
      assert.equal(rules[token], undefined);
    }
  }
});

test("published Input source matches the installable opaque-fill component", async () => {
  const published = JSON.parse(
    await readFile(new URL("../../../public/r/input.json", import.meta.url), "utf8"),
  );
  const file = published.files.find((entry) => entry.path.endsWith("/input.tsx"));
  assert.ok(file);
  assert.equal(file.content, source);
  assert.ok(file.content.includes("ninaero-input"));
});
