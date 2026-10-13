import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import ts from "typescript";

const read = (path) => readFile(new URL(`../../${path}`, import.meta.url), "utf8");
const helper = await read("lib/example-source.ts");
const compiled = ts.transpileModule(helper, {
  compilerOptions: {
    module: ts.ModuleKind.ESNext,
    target: ts.ScriptTarget.ES2022,
  },
}).outputText;
const { settingsExampleSource } = await import(
  `data:text/javascript;base64,${Buffer.from(compiled).toString("base64")}`
);

test("the homepage contains one composition and no component-testing catalogue", async () => {
  const home = await read("app/page.tsx");
  assert.equal((home.match(/<SettingsPreview/g) ?? []).length, 1);
  assert.doesNotMatch(
    home,
    /ButtonPreview|DialogPreview|catalogComponents\.map|swatches|Semantic tokens/,
  );
  assert.match(home, /href="\/examples"/);
  assert.match(home, /href="\/docs"/);
});

test("the homepage combines a framed preview, live accents, and a real install command without repeated captions", async () => {
  const home = await read("app/page.tsx");
  const picker = await read("components/examples/hero-accent-picker.tsx");
  assert.match(home, /home-preview-shell/);
  assert.match(home, /<HeroAccentPicker/);
  assert.match(home, /code=\{presetInstallCommand\}/);
  assert.doesNotMatch(
    home,
    /Live example|Paper \+ ink|Explore Ninaero|softly framed|Nintendo|Paper-led/,
  );
  assert.match(picker, /aria-pressed=\{accent === name\}/);
  assert.match(picker, /setAccent\(name\)/);
});

test("composed examples have gallery, preview-code, and isolated preview routes", async () => {
  const gallery = await read("app/examples/page.tsx");
  const example = await read("app/examples/settings/page.tsx");
  const preview = await read("app/examples/settings/preview/page.tsx");
  assert.match(gallery, /href="\/examples\/settings"/);
  assert.match(example, /defaultValue="preview"/);
  assert.match(example, /value="code"/);
  assert.match(example, /<CodeBlock/);
  assert.match(example, /href="\/examples\/settings\/preview"/);
  assert.match(preview, /<SettingsPreview/);
  assert.doesNotMatch(preview, /<CodeBlock|<ButtonPreview/);
});

test("every workshop specimen has a focused route instead of another mixed page", async () => {
  const layout = await read("app/workshop/layout.tsx");
  for (const section of ["buttons", "inputs", "dialog", "tokens"]) {
    assert.ok(layout.includes(`"/workshop/${section}"`));
    assert.match(await read(`app/workshop/${section}/page.tsx`), /export default function/);
  }
  const index = await read("app/workshop/page.tsx");
  assert.doesNotMatch(index, /<ButtonPreview|<DialogPreview|<Input\s/);
});

test("navigation and appearance controls are shared rather than duplicated per route", async () => {
  const header = await read("components/site-header.tsx");
  const layout = await read("app/layout.tsx");
  assert.equal((layout.match(/<SiteHeader/g) ?? []).length, 1);
  assert.doesNotMatch(layout, /href="\/workshop"|<footer/);
  for (const destination of ["examples", "components", "docs"]) {
    assert.ok(header.includes(`"/${destination}"`));
  }
  assert.match(header, /Appearance/);
  assert.match(header, /<ThemeSwitcher/);
  for (const path of ["app/docs/layout.tsx", "app/components/page.tsx"]) {
    assert.doesNotMatch(await read(path), /ThemeSwitcher|Main navigation/);
  }
});

test("copyable settings source inlines its state and uses consumer component imports", async () => {
  const [preview, state] = await Promise.all([
    read("components/examples/settings-preview.tsx"),
    read("components/examples/settings-state.ts"),
  ]);
  const source = settingsExampleSource(preview, state);
  assert.doesNotMatch(source, /from "\.\/settings-state"|@\/registry\/ninaero\/ui/);
  assert.match(source, /export type Settings/);
  assert.match(source, /export function settingsMatch/);
  assert.match(source, /@\/components\/ui\/button/);
  const result = ts.transpileModule(source, {
    compilerOptions: { jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.ESNext },
    reportDiagnostics: true,
  });
  assert.deepEqual(result.diagnostics, []);
});

test("source assembly supports formatted imports and fails loudly if its input changes", () => {
  const formatted =
    'import {\n  initialSettings,\n  type Settings,\n  settingsMatch,\n} from "./settings-state";\n';
  assert.equal(
    settingsExampleSource(formatted, "export const state = {};"),
    "export const state = {};\n",
  );
  assert.throws(
    () => settingsExampleSource("export const unrelated = 1;", ""),
    /missing its state import/,
  );
});
