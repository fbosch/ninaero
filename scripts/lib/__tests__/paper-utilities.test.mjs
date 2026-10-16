import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { dirname } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { compile } from "tailwindcss";

import { theme } from "../../../registry/ninaero/theme.mjs";
import { createRegistry, renderThemeCss } from "../theme.mjs";

const require = createRequire(import.meta.url);
const root = fileURLToPath(new URL("../../../", import.meta.url));
const manifest = JSON.parse(await readFile(new URL("../../../package.json", import.meta.url)));
const registry = createRegistry(theme, manifest.dependencies, []);
const installedTheme = registry.items.find(({ name }) => name === "theme");
const consumerCss = renderThemeCss({
  ...theme,
  theme: installedTheme.cssVars.theme,
  light: installedTheme.cssVars.light,
  dark: installedTheme.cssVars.dark,
  css: installedTheme.css,
});

async function compileConsumer(utilities) {
  return compile(`${consumerCss}\n.specimen { @apply ${utilities}; }`, {
    base: root,
    async loadStylesheet(id, base) {
      const path =
        id === "tw-animate-css"
          ? fileURLToPath(
              new URL("../../../node_modules/tw-animate-css/dist/tw-animate.css", import.meta.url),
            )
          : require.resolve(id === "tailwindcss" ? "tailwindcss/index.css" : id, { paths: [base] });
      return { path, base: dirname(path), content: await readFile(path, "utf8") };
    },
  });
}

for (const name of [
  "ninaero-paper-ruled",
  "ninaero-paper-dotted",
  "ninaero-paper-grid",
  "ninaero-paper-notebook",
  "ninaero-dither",
]) {
  test(`${name} consumer utilities compile standalone defaults, numeric intervals, and variants`, async () => {
    const compiler = await compileConsumer(
      [
        name,
        `${name}-4`,
        `${name}-6`,
        `${name}-8`,
        `${name}-6.5`,
        `${name}-[10.5]`,
        `md:${name}-16`,
        `dark:${name}-12`,
        `forced-colors:${name}-8`,
      ].join(" "),
    );
    assert.doesNotThrow(() => compiler.build([]));
  });
}

test("zero and subpixel interval arguments compile for consumers", async () => {
  const compiler = await compileConsumer(
    "ninaero-paper-grid-0 ninaero-paper-notebook-0.5 ninaero-dither-0 ninaero-dither-12.5",
  );
  assert.doesNotThrow(() => compiler.build([]));
});

test("pattern size arguments reject nonnumeric values", async () => {
  await assert.rejects(compileConsumer("ninaero-paper-grid-large"), /unknown utility/i);
});
