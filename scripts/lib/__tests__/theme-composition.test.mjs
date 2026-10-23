import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { dirname } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { compile } from "tailwindcss";

import { theme } from "../../../registry/ninaero/theme.mjs";
import { renderThemeCss } from "../theme.mjs";

const require = createRequire(import.meta.url);
const root = fileURLToPath(new URL("../../../", import.meta.url));

async function compilePreview(styles, utilities) {
  const compiler = await compile(
    `${renderThemeCss(theme, styles)}\n.consumer { @apply ${utilities}; }\n`,
    {
      base: root,
      async loadStylesheet(id, base) {
        const path =
          id === "tw-animate-css"
            ? fileURLToPath(
                new URL(
                  "../../../node_modules/tw-animate-css/dist/tw-animate.css",
                  import.meta.url,
                ),
              )
            : require.resolve(id === "tailwindcss" ? "tailwindcss/index.css" : id, {
                paths: [base],
              });
        return { path, base: dirname(path), content: await readFile(path, "utf8") };
      },
    },
  );
  assert.doesNotThrow(() => compiler.build([]));
}

test("preview composition retains foundation utilities and every item's utilities", async () => {
  await compilePreview(
    [
      { "@utility first-item": { display: "block" } },
      { "@utility second-item": { "text-wrap": "balance" } },
    ],
    "bg-background ninaero-paper-ruled first-item second-item",
  );
});

test("preview composition retains tokens contributed to the same block by separate items", async () => {
  await compilePreview(
    [
      { "@theme": { "--color-first-item": "red" } },
      { "@theme": { "--color-second-item": "blue" } },
    ],
    "bg-first-item text-second-item",
  );
});
