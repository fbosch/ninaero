import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { promisify } from "node:util";

import { theme } from "../../../registry/ninaero/theme.mjs";
import { createRegistry } from "../theme.mjs";

const exec = promisify(execFile);
const require = createRequire(import.meta.url);
const manifest = JSON.parse(await readFile(new URL("../../../package.json", import.meta.url)));

test("consumer font installation appears in the dry run without editing the consumer stylesheet", async () => {
  const root = await mkdtemp(join(tmpdir(), "ninaero-font-install-"));
  try {
    const registry = createRegistry(theme, manifest.dependencies, []);
    const font = registry.items.find(({ name }) => name === "font-google-sans-code");
    const themeItem = registry.items.find(({ name }) => name === "theme");
    const fontPath = join(root, "font.json");
    const themePath = join(root, "theme.json");
    await mkdir(join(root, "src"));
    await Promise.all([
      writeFile(fontPath, JSON.stringify(font)),
      writeFile(themePath, JSON.stringify({ ...themeItem, registryDependencies: [fontPath] })),
      writeFile(
        join(root, "package.json"),
        JSON.stringify({
          name: "ninaero-font-consumer",
          private: true,
          packageManager: manifest.packageManager,
        }),
      ),
      writeFile(
        join(root, "components.json"),
        JSON.stringify({
          $schema: "https://ui.shadcn.com/schema.json",
          style: "base-nova",
          rsc: false,
          tsx: true,
          tailwind: {
            config: "",
            css: "src/styles.css",
            baseColor: "neutral",
            cssVariables: true,
            prefix: "",
          },
          aliases: {
            components: "@/components",
            utils: "@/lib/utils",
            ui: "@/components/ui",
            lib: "@/lib",
            hooks: "@/hooks",
          },
        }),
      ),
      writeFile(
        join(root, "tsconfig.json"),
        JSON.stringify({ compilerOptions: { baseUrl: ".", paths: { "@/*": ["./src/*"] } } }),
      ),
      writeFile(join(root, "src/styles.css"), '@import "tailwindcss";\n'),
    ]);

    const { stdout } = await exec(
      process.execPath,
      [
        require.resolve("shadcn"),
        "add",
        themePath,
        "--cwd",
        root,
        "--yes",
        "--dry-run",
        "--diff",
        "src/styles.css",
      ],
      { timeout: 20000, maxBuffer: 1024 * 1024 },
    );

    assert.ok(stdout.includes(theme.codeFont.stylesheet));
    assert.ok(stdout.includes(theme.codeFont.family));
    assert.equal(await readFile(join(root, "src/styles.css"), "utf8"), '@import "tailwindcss";\n');
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
