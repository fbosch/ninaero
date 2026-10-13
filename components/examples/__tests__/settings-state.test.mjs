import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import ts from "typescript";

const source = await readFile(new URL("../settings-state.ts", import.meta.url), "utf8");
const compiled = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.ESNext,
    target: ts.ScriptTarget.ES2022,
  },
}).outputText;
const { initialSettings, settingsMatch } = await import(
  `data:text/javascript;base64,${Buffer.from(compiled).toString("base64")}`
);

test("settings are not marked saved before the first submit", () => {
  assert.equal(settingsMatch(initialSettings, null), false);
  assert.equal(initialSettings.updates, false);
});

test("saving a snapshot acknowledges exactly the current settings", () => {
  const saved = { ...initialSettings };
  assert.equal(settingsMatch({ ...initialSettings }, saved), true);
});

for (const [field, value] of [
  ["displayName", "New name"],
  ["email", "new@example.com"],
  ["updates", true],
]) {
  test(`changing ${field} clears the saved state without mutating the snapshot`, () => {
    const saved = { ...initialSettings };
    const draft = { ...initialSettings, [field]: value };
    assert.equal(settingsMatch(draft, saved), false);
    assert.deepEqual(saved, initialSettings);
    assert.equal(settingsMatch({ ...saved }, saved), true);
  });
}
