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

test("Input uses an opaque neutral content fill in either theme", () => {
  assert.ok(classes.includes("bg-card"));
  assert.ok(classes.includes("text-card-foreground"));
  const fills = classes.filter((value) => /(^|:)bg-/.test(value) && !value.startsWith("file:"));
  assert.deepEqual(fills, ["bg-card", "disabled:bg-muted"]);
  for (const mode of ["light", "dark"]) {
    for (const token of ["card", "muted"]) {
      assert.ok(!/transparent|\//.test(theme[mode][token]));
    }
  }
});

test("disabled Input stays opaque and signals its state without fading the whole field", () => {
  assert.ok(classes.includes("disabled:bg-muted"));
  assert.ok(classes.includes("disabled:text-muted-foreground"));
  assert.ok(classes.includes("disabled:border-border"));
  assert.ok(classes.includes("disabled:cursor-not-allowed"));
  assert.ok(classes.includes("disabled:pointer-events-none"));
  assert.ok(!classes.some((value) => value.includes("opacity-")));
});

test("Input fill changes preserve focus and semantic invalid feedback", () => {
  for (const value of [
    "focus-visible:border-ring",
    "focus-visible:ring-3",
    "aria-invalid:border-destructive",
    "aria-invalid:ring-3",
  ]) {
    assert.ok(classes.includes(value), value);
  }
});

test("accent presets do not recolor Input's neutral fill", () => {
  for (const rules of Object.values(accentRules)) {
    for (const token of ["--card", "--card-foreground", "--muted"]) {
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
  assert.ok(file.content.includes("bg-card"));
});
