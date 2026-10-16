import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import ts from "typescript";

import catalog from "../../registry/ninaero/catalog.json" with { type: "json" };
import { componentGuides } from "../../scripts/lib/component-guides.mjs";

const source = await readFile(new URL("../component-overview.ts", import.meta.url), "utf8");
// Keep metadata tests independent of Node's version-specific TypeScript loader.
const compiled = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.ESNext,
    target: ts.ScriptTarget.ES2022,
  },
}).outputText;
const { componentGroups, componentTitle, isComponentName, matchesComponent, overviewItems } =
  await import(`data:text/javascript;base64,${Buffer.from(compiled).toString("base64")}`);

const expected = [
  ...catalog.items.filter((item) => item.type === "registry:ui").map((item) => item.name),
  ...componentGuides.map((guide) => guide.name),
].sort();

test("the overview covers the component catalogue and composed guides exactly once", () => {
  const names = overviewItems.map((item) => item.name);
  assert.deepEqual(names.toSorted(), expected);
  assert.equal(new Set(names).size, names.length);
  assert.ok(!names.includes("form"));
});

test("documentation routes accept only component and guide names", () => {
  for (const name of expected) assert.equal(isComponentName(name), true);
  for (const name of [
    "form",
    "theme",
    "../package.json",
    "__proto__",
    "constructor",
    "<script>",
    "Button",
    "button/other",
  ]) {
    assert.equal(isComponentName(name), false, name);
  }
});

test("group anchors are unique and every item has meaningful metadata", () => {
  assert.equal(new Set(componentGroups.map((group) => group.id)).size, componentGroups.length);
  for (const group of componentGroups) {
    assert.match(group.id, /^[a-z-]+$/);
    assert.ok(group.title.length > 0);
    assert.ok(group.description.length > 0);
    assert.ok(group.items.length > 0);
    for (const item of group.items) {
      assert.ok(componentTitle(item.name).length > 0);
      assert.ok(item.description.length > 0);
    }
  }
});

test("search matches names, display titles, and descriptions without case or surrounding whitespace", () => {
  const input = overviewItems.find((item) => item.name === "input");
  const keyboard = overviewItems.find((item) => item.name === "kbd");
  assert.equal(matchesComponent(input, " INPUT "), true);
  assert.equal(matchesComponent(input, "single-line"), true);
  assert.equal(matchesComponent(keyboard, "keyboard"), true);
  assert.equal(matchesComponent(input, "no-such-component"), false);
  assert.equal(
    overviewItems.filter((item) => matchesComponent(item, "  ")).length,
    expected.length,
  );
  assert.equal(overviewItems.filter((item) => matchesComponent(item, "button")).length > 0, true);
  assert.equal(
    overviewItems.filter((item) => matchesComponent(item, "no-such-component")).length,
    0,
  );
});

test("display names preserve technical abbreviations", () => {
  assert.equal(componentTitle("input-otp"), "Input OTP");
  assert.equal(componentTitle("kbd"), "Kbd");
  assert.equal(componentTitle("button-group"), "Button Group");
});
