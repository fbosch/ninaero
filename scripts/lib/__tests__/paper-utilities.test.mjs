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
  "ninaero-checker",
  "ninaero-checker-wide",
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
        `${name}-(number:--workshop-pattern-step)`,
        `md:${name}-16`,
        `dark:${name}-12`,
        `forced-colors:${name}-8`,
      ].join(" "),
    );
    assert.doesNotThrow(() => compiler.build([]));
  });
}

test("installed patterns compile semantic, palette, arbitrary, and variable ink colors with opacity", async () => {
  const colors = [
    "ninaero-pattern-ink-primary",
    "ninaero-pattern-ink-primary/20",
    "ninaero-pattern-ink-foreground/12.5",
    "ninaero-pattern-ink-slate-500/0",
    "ninaero-pattern-ink-slate-500/100",
    "ninaero-pattern-ink-[#5c7185]/35",
    "ninaero-pattern-ink-[oklch(0.7_0.15_200)]/30",
    "ninaero-pattern-ink-(color:--consumer-ink)/40",
    "ninaero-pattern-ink-transparent",
    "ninaero-pattern-ink-[currentColor]/[0.25]",
    "ninaero-pattern-ink-primary/[35%]",
    "dark:ninaero-pattern-ink-primary/30",
    "md:ninaero-pattern-ink-foreground/20",
  ];
  for (const pattern of [
    "ninaero-paper-ruled-8",
    "ninaero-paper-dotted-8",
    "ninaero-paper-grid-8",
    "ninaero-paper-notebook-8",
    "ninaero-dither-8",
    "ninaero-checker-8",
    "ninaero-checker-wide-8",
  ]) {
    const compiler = await compileConsumer([pattern, ...colors].join(" "));
    assert.doesNotThrow(() => compiler.build([]));
  }
});

test("zero and subpixel interval arguments compile for consumers", async () => {
  const compiler = await compileConsumer(
    "ninaero-paper-grid-0 ninaero-paper-notebook-0.5 ninaero-dither-0 ninaero-dither-12.5 ninaero-checker-0 ninaero-checker-0.5 ninaero-checker-wide-0 ninaero-checker-wide-0.5",
  );
  assert.doesNotThrow(() => compiler.build([]));
});

test("pattern size arguments reject nonnumeric values", async () => {
  await assert.rejects(compileConsumer("ninaero-paper-grid-large"), /unknown utility/i);
  await assert.rejects(compileConsumer("ninaero-checker-large"), /unknown utility/i);
  await assert.rejects(compileConsumer("ninaero-checker-wide-large"), /unknown utility/i);
});

test("ink utilities reject unknown colors and nonnumeric opacity modifiers", async () => {
  await assert.rejects(compileConsumer("ninaero-pattern-ink-loud"), /unknown utility/i);
  await assert.rejects(compileConsumer("ninaero-pattern-ink-primary/loud"), /unknown utility/i);
});
