import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { once } from "node:events";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { createServer } from "node:http";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import test from "node:test";
import { promisify } from "node:util";

import { compile } from "tailwindcss";

import { styles as highlightedCode } from "../../../registry/ninaero/hooks/styles/use-highlighted-code.mjs";
import { styles as calendar } from "../../../registry/ninaero/ui/styles/calendar.mjs";
import { styles as progress } from "../../../registry/ninaero/ui/styles/progress.mjs";
import { buildConsumerCss } from "../consumer-css.mjs";

const exec = promisify(execFile);
const require = createRequire(import.meta.url);
const manifest = JSON.parse(await readFile(new URL("../../../package.json", import.meta.url)));
const palette = await readFile(new URL("./fixtures/shadcn-neutral.json", import.meta.url));

for (const [name, css] of Object.entries({
  "use-highlighted-code": highlightedCode,
  calendar,
  progress,
})) {
  test(`${name} styles survive CLI installation and CSS optimization without warnings`, async (t) => {
    const root = await mkdtemp(join(tmpdir(), "ninaero-installed-css-"));
    const source = join(root, "src");
    const server = createServer((request, response) => {
      if (request.url === "/r/colors/neutral.json") {
        response.writeHead(200, { "Content-Type": "application/json" }).end(palette);
      } else {
        response.writeHead(404).end("Unexpected registry request.");
      }
    });
    try {
      server.listen(0, "127.0.0.1");
      await once(server, "listening");
      const address = server.address();
      await mkdir(source);
      await Promise.all([
        writeFile(
          join(root, "package.json"),
          JSON.stringify({
            name: "ninaero-css-consumer",
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
          JSON.stringify({
            compilerOptions: { baseUrl: ".", paths: { "@/*": ["./src/*"] } },
          }),
        ),
        writeFile(join(source, "styles.css"), '@import "tailwindcss";\n'),
        writeFile(join(root, "style.json"), JSON.stringify({ name, type: "registry:style", css })),
      ]);
      await exec(
        process.execPath,
        [
          require.resolve("shadcn"),
          "add",
          join(root, "style.json"),
          "--cwd",
          root,
          "--yes",
          "--silent",
        ],
        {
          timeout: 20000,
          maxBuffer: 1024 * 1024,
          env: {
            ...process.env,
            REGISTRY_URL: `http://127.0.0.1:${address.port}/r`,
            NO_PROXY: "127.0.0.1,localhost",
            no_proxy: "127.0.0.1,localhost",
            npm_config_offline: "true",
          },
        },
      );
      const installed = await readFile(join(source, "styles.css"), "utf8");
      const compiler = await compile(installed, {
        base: source,
        async loadStylesheet(id, base) {
          const path = require.resolve(id === "tailwindcss" ? "tailwindcss/index.css" : id, {
            paths: [base, dirname(require.resolve("tailwindcss"))],
          });
          return { path, base: dirname(path), content: await readFile(path, "utf8") };
        },
      });
      const warnings = [];
      t.mock.method(console, "warn", (...args) => warnings.push(args.join(" ")));
      const result = buildConsumerCss(compiler, source);
      assert.equal(warnings.length, 0, `Invalid installed ${name} CSS:\n${warnings.join("\n")}`);
      assert.ok(result.sizes.minified > 0);
    } finally {
      server.closeAllConnections();
      await new Promise((resolve) => server.close(resolve));
      await rm(root, { recursive: true, force: true });
    }
  });
}
