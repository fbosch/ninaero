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

test("the homepage preview frame uses neutral panel tokens instead of blue Button material", async () => {
  const site = await read("app/site.css");
  const shell = site.match(/\.home-preview-shell\s*\{([^}]+)\}/)?.[1];
  assert.ok(shell, "the homepage preview frame must have a CSS recipe");
  assert.match(shell, /background:\s*color-mix\(in oklab, var\(--card\) 60%, var\(--muted\)\)/);
  assert.match(shell, /border:\s*1px solid var\(--border\)/);
  assert.doesNotMatch(shell, /button-paper-fill|button-paper-edge/);
  const dark = site.match(/\.dark \.home-preview-shell\s*\{([^}]+)\}/)?.[1];
  assert.ok(dark, "dark mode must keep its existing preview fill");
  assert.match(dark, /background:\s*var\(--muted\)/);
  assert.match(
    site,
    /@media \(forced-colors: active\)\s*\{\s*\.home-preview-shell,\s*\.dark \.home-preview-shell\s*\{[^}]*background: Canvas/,
  );
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

test("the shared header separates its full-width material from the constrained navigation layout", async () => {
  const header = await read("components/site-header.tsx");
  assert.match(header, /<header className="site-header">/);
  assert.match(header, /<div className="mx-auto flex max-w-7xl flex-wrap/);
  assert.match(header, /aria-label="Main navigation"/);
  assert.match(header, /aria-current=/);
  assert.match(header, /<PopoverTrigger\s+render=\{\s*<Button\s+variant="secondary"/);
  assert.match(header, /className="site-appearance-trigger gap-2"/);
});

test("the header uses shallow neutral shading and the low-opacity layered cast shadow in both themes", async () => {
  const site = await read("app/site.css");
  const header = site.match(/\.site-header\s*\{([^}]+)\}/)?.[1];
  const dark = site.match(/\.dark \.site-header\s*\{([^}]+)\}/)?.[1];
  assert.ok(header, "the header must have a CSS material recipe");
  assert.ok(dark, "dark mode must retain overhead lighting");
  assert.match(header, /position:\s*relative/);
  assert.match(header, /z-index:\s*10/);
  assert.match(
    header,
    /border-bottom:\s*1px solid color-mix\(in oklab, var\(--border\) 50%, transparent\)/,
  );
  assert.doesNotMatch(header, /\bopacity\s*:/);
  assert.match(header, /linear-gradient\(to bottom, var\(--card\), var\(--muted\)\)/);
  assert.match(dark, /linear-gradient\(to bottom, var\(--muted\), var\(--card\)\)/);
  assert.match(header, /inset 0 -1px 0 var\(--card\)/);
  const layers = [
    ...header.matchAll(/0 (\d+)px (\d+)px hsl\(var\(--shadow-color\) \/ ([\d.]+)\)/g),
  ].map(([, offset, blur, opacity]) => ({
    offset: Number(offset),
    blur: Number(blur),
    opacity: Number(opacity),
  }));
  assert.equal(layers.length, 3, "the header must retain layered elevation");
  layers.forEach((layer, index) => {
    assert.ok(layer.blur >= layer.offset * 2, "blur must soften the downward offset");
    assert.ok(layer.opacity > 0 && layer.opacity <= 0.06);
    if (index > 0) {
      assert.ok(layer.offset > layers[index - 1].offset);
      assert.ok(layer.blur > layers[index - 1].blur);
      assert.ok(layer.opacity < layers[index - 1].opacity);
    }
  });
  const combinedOpacity =
    1 - layers.reduce((remaining, layer) => remaining * (1 - layer.opacity), 1);
  assert.ok(combinedOpacity >= 0.08 && combinedOpacity <= 0.12);
  assert.ok(layers.at(-1).offset <= 6);
  assert.doesNotMatch(
    header + dark,
    /--(?:primary|accent|button-)|backdrop-filter|overflow:\s*hidden/,
  );
});

test("Appearance keeps the shared Button geometry while lightening only its local cast-shadow color", async () => {
  const site = await read("app/site.css");
  const light = site.match(/\.site-appearance-trigger\s*\{([^}]+)\}/)?.[1];
  const dark = site.match(/\.dark \.site-appearance-trigger\s*\{([^}]+)\}/)?.[1];
  assert.ok(light, "Appearance must have a local receiving-material adjustment");
  assert.ok(dark, "dark mode must avoid a near-black Button shadow");
  assert.match(light, /--shadow-color:\s*0deg 0% 45%/);
  assert.match(dark, /--shadow-color:\s*0deg 0% 7%/);
  assert.doesNotMatch(light + dark, /\bopacity\s*:|box-shadow\s*:|button-highlight|button-recess/);
});
test("forced colors remove header decoration but retain its system-color edge", async () => {
  const site = await read("app/site.css");
  const forced = site.match(
    /@media \(forced-colors: active\)\s*\{\s*\.site-header,\s*\.dark \.site-header\s*\{([^}]+)\}/,
  )?.[1];
  assert.ok(forced, "the header must have a forced-colors override");
  assert.match(forced, /border-color:\s*CanvasText/);
  assert.match(forced, /background:\s*Canvas/);
  assert.match(forced, /box-shadow:\s*none/);
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
