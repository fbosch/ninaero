import { execFile } from "node:child_process";
import { once } from "node:events";
import {
  access,
  mkdir,
  mkdtemp,
  readFile,
  realpath,
  rm,
  symlink,
  writeFile,
} from "node:fs/promises";
import { createServer } from "node:http";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";

import { compile } from "tailwindcss";

import catalog from "../registry/ninaero/catalog.json" with { type: "json" };
import { theme } from "../registry/ninaero/theme.mjs";
import { readCatalogSources, resolveCatalog } from "./lib/catalog.mjs";
import {
  formatTypeScriptDiagnostics,
  releaseRegistryError,
  typescriptDiagnostics,
  validateCatalog,
  validateGeneratedRegistry,
} from "./lib/shadcn-check.mjs";
import { createRegistry, defaultRegistryUrl } from "./lib/theme.mjs";

const runFile = promisify(execFile);
const require = createRequire(import.meta.url);
const projectRoot = fileURLToPath(new URL("../", import.meta.url));

async function readPackageManifest(file) {
  try {
    return JSON.parse(await readFile(file, "utf8"));
  } catch (error) {
    throw new Error(`Unable to read package manifest ${file}.`, { cause: error });
  }
}

const manifest = await readPackageManifest(join(projectRoot, "package.json"));
const shadcnPackage = await readPackageManifest(
  new URL("../package.json", import.meta.resolve("shadcn")),
);
const release = process.argv.slice(2).includes("--release");
if (process.argv.slice(2).some((arg) => arg !== "--release") || process.argv.slice(2).length > 1) {
  throw new Error("Usage: node scripts/check-shadcn.mjs [--release]");
}
if (catalog.cliVersion !== shadcnPackage.version) {
  throw new Error(
    `Catalog baseline expects shadcn ${catalog.cliVersion}, but installed CLI is ${shadcnPackage.version}. Review the consumer fixture before updating the baseline.`,
  );
}

const registryUrl = process.env.REGISTRY_URL ?? defaultRegistryUrl;
if (release) {
  const error = releaseRegistryError(process.env.REGISTRY_URL);
  if (error) throw new Error(error);
}

const sources = await readCatalogSources(catalog, new URL("../", import.meta.url));
const components = resolveCatalog(catalog, sources);
const policyErrors = validateCatalog({
  catalog: { ...catalog, items: components },
  sources,
  dependencies: manifest.dependencies,
});
if (policyErrors.length) throw new Error(`Registry policy failed:\n${policyErrors.join("\n")}`);
const registry = createRegistry(theme, manifest.dependencies, components, registryUrl);
const outputErrors = validateGeneratedRegistry(registry, {
  catalogItems: components,
  packageVersions: manifest.dependencies,
  registryUrl,
});
if (outputErrors.length)
  throw new Error(`Generated registry policy failed:\n${outputErrors.join("\n")}`);

const tempRoot = await mkdtemp(join(tmpdir(), "ninaero-shadcn-check-"));
const cli = require.resolve("shadcn");
async function runCli(args, cwd, env = {}) {
  try {
    await runFile(process.execPath, [cli, ...args], {
      cwd,
      env: { ...process.env, ...env },
      timeout: 90_000,
      maxBuffer: 4 * 1024 * 1024,
    });
  } catch (error) {
    throw new Error(
      `shadcn ${args.join(" ")} failed:\n${error.stdout ?? ""}${error.stderr ?? error.message}`,
      { cause: error },
    );
  }
}

try {
  const sourceRegistry = join(tempRoot, "registry.json");
  await writeFile(sourceRegistry, `${JSON.stringify(registry, null, 2)}\n`);
  await mkdir(join(tempRoot, "registry"), { recursive: true });
  await symlink(join(projectRoot, "registry/ninaero"), join(tempRoot, "registry/ninaero"), "dir");
  await symlink(join(projectRoot, "lib"), join(tempRoot, "lib"), "dir");

  await runCli(["registry", "validate", sourceRegistry, "--cwd", tempRoot], tempRoot);
  const builtRegistry = join(tempRoot, "public/r");
  await runCli(["build", sourceRegistry, "--cwd", tempRoot, "--output", builtRegistry], tempRoot);
  const builtItems = new Map(
    await Promise.all(
      registry.items.map(async ({ name }) => [
        name,
        JSON.parse(await readFile(join(builtRegistry, `${name}.json`), "utf8")),
      ]),
    ),
  );

  function dependencyName(address) {
    const name = new URL(address).pathname
      .split("/")
      .at(-1)
      ?.replace(/\.json$/, "");
    if (!builtItems.has(name)) {
      throw new Error(`Generated dependency is not a Ninaero item: ${address}`);
    }
    return name;
  }

  function itemClosure(name, found = new Set()) {
    if (found.has(name)) return found;
    const item = builtItems.get(name);
    if (!item) throw new Error(`Unknown consumer entry item: ${name}`);
    found.add(name);
    for (const address of item.registryDependencies ?? []) {
      itemClosure(dependencyName(address), found);
    }
    return found;
  }

  async function checkConsumer(name, env) {
    const selected = itemClosure(name);
    const consumer = join(tempRoot, `consumer-${name}`);
    const consumerRegistry = join(consumer, "registry");
    const consumerSource = join(consumer, "src");
    await mkdir(consumerRegistry, { recursive: true });
    await mkdir(consumerSource, { recursive: true });

    const dependencies = {};
    for (const selectedName of selected) {
      const item = builtItems.get(selectedName);
      for (const value of item.dependencies ?? []) {
        const split = value.lastIndexOf("@");
        dependencies[value.slice(0, split)] = value.slice(split + 1);
      }
      await writeFile(
        join(consumerRegistry, `${selectedName}.json`),
        `${JSON.stringify(
          {
            ...item,
            registryDependencies: (item.registryDependencies ?? []).map((address) =>
              join(consumerRegistry, `${dependencyName(address)}.json`),
            ),
          },
          null,
          2,
        )}\n`,
      );
    }

    for (const peer of ["react", "react-dom"]) dependencies[peer] = manifest.dependencies[peer];
    const devDependencies = Object.fromEntries(
      ["@types/react", "@types/react-dom", "typescript", "tailwindcss"].map((dependency) => [
        dependency,
        manifest.devDependencies[dependency],
      ]),
    );
    await writeFile(
      join(consumer, "package.json"),
      `${JSON.stringify(
        {
          name: `ninaero-isolated-${name}-consumer`,
          private: true,
          packageManager: manifest.packageManager,
          dependencies,
          devDependencies,
        },
        null,
        2,
      )}\n`,
    );
    for (const dependency of [...Object.keys(dependencies), ...Object.keys(devDependencies)]) {
      const installed = join(projectRoot, "node_modules", dependency);
      try {
        await access(installed);
      } catch {
        throw new Error(
          `Isolated consumer requires ${dependency}; install it in the project before running this check.`,
        );
      }
      const destination = join(consumer, "node_modules", dependency);
      await mkdir(dirname(destination), { recursive: true });
      await symlink(await realpath(installed), destination, "dir");
    }

    await writeFile(
      join(consumer, "components.json"),
      `${JSON.stringify(
        {
          $schema: "https://ui.shadcn.com/schema.json",
          style: catalog.style,
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
            components: "@/custom/components",
            utils: "@/custom/lib/utils",
            ui: "@/custom/ui",
            lib: "@/custom/lib",
            hooks: "@/custom/hooks",
          },
        },
        null,
        2,
      )}\n`,
    );
    await writeFile(
      join(consumer, "tsconfig.json"),
      `${JSON.stringify(
        {
          compilerOptions: {
            target: "ES2022",
            lib: ["DOM", "DOM.Iterable", "ESNext"],
            strict: true,
            skipLibCheck: true,
            noEmit: true,
            module: "ESNext",
            moduleResolution: "Bundler",
            jsx: "react-jsx",
            baseUrl: ".",
            paths: { "@/*": ["./src/*"] },
          },
          include: ["src/**/*.ts", "src/**/*.tsx"],
        },
        null,
        2,
      )}\n`,
    );
    await writeFile(join(consumerSource, "styles.css"), '@import "tailwindcss";\n');
    let fixture;
    if (name === "ninaero") {
      fixture = await readFile(
        join(projectRoot, "scripts/lib/__tests__/fixtures/shadcn-consumer.tsx.txt"),
        "utf8",
      );
    } else if (name === "theme") {
      fixture = "export const foundation = true;\n";
    } else {
      const directory = builtItems.get(name).type === "registry:hook" ? "hooks" : "ui";
      fixture = `import * as InstalledItem from "@/custom/${directory}/${name}";\nexport { InstalledItem };\n`;
    }
    await writeFile(join(consumerSource, "consumer-fixture.tsx"), fixture);

    await runCli(
      ["add", join(consumerRegistry, `${name}.json`), "--cwd", consumer, "--yes", "--silent"],
      consumer,
      env,
    );
    const diagnostics = typescriptDiagnostics(join(consumer, "tsconfig.json"));
    if (diagnostics.length) {
      throw new Error(
        `${name} consumer did not typecheck:\n${formatTypeScriptDiagnostics(diagnostics, consumer)}`,
      );
    }

    const consumerRequire = createRequire(join(consumer, "package.json"));
    const stylesheet = await readFile(join(consumerSource, "styles.css"), "utf8");
    const foundationUtilities = selected.has("theme")
      ? "bg-background text-foreground type-body ninaero-paper-ruled"
      : "font-mono";
    const compiler = await compile(
      `${stylesheet}\n.consumer-check { @apply ${foundationUtilities}; }\n`,
      {
        base: consumerSource,
        async loadStylesheet(id, base) {
          const path =
            id === "tw-animate-css"
              ? join(consumer, "node_modules/tw-animate-css/dist/tw-animate.css")
              : consumerRequire.resolve(id === "tailwindcss" ? "tailwindcss/index.css" : id, {
                  paths: [base],
                });
          return { path, base: dirname(path), content: await readFile(path, "utf8") };
        },
      },
    );
    await writeFile(
      join(consumerSource, "compiled.css"),
      compiler.build(["inline-flex", "bg-background", "font-sans", "dark:bg-background"]),
    );
    console.log(`Compiled ${name} consumer with ${selected.size} registry items.`);
  }

  // The CLI reads its base palette even when every install address is local.
  const palette = await readFile(
    join(projectRoot, "scripts/lib/__tests__/fixtures/shadcn-neutral.json"),
  );
  const unexpectedRequests = new Set();
  const server = createServer((request, response) => {
    if (request.url === "/r/colors/neutral.json") {
      response.writeHead(200, { "Content-Type": "application/json" }).end(palette);
    } else {
      unexpectedRequests.add(request.url);
      response.writeHead(404).end("No pinned registry fixture for this URL.");
    }
  });
  const consumers = [
    "theme",
    "button",
    "input",
    "checkbox",
    "dialog",
    "alert-dialog",
    "select",
    "radio-group",
    "calendar",
    "code-block",
    "use-highlighted-code",
    "ninaero",
  ];
  try {
    server.listen(0, "127.0.0.1");
    await once(server, "listening");
    const address = server.address();
    for (const name of consumers) {
      await checkConsumer(name, {
        REGISTRY_URL: `http://127.0.0.1:${address.port}/r`,
        NO_PROXY: "127.0.0.1,localhost",
        no_proxy: "127.0.0.1,localhost",
        npm_config_offline: "true",
      });
      if (unexpectedRequests.size) {
        throw new Error(
          `CLI requested unpinned registry inputs: ${[...unexpectedRequests].join(", ")}`,
        );
      }
    }
  } finally {
    server.closeAllConnections();
    await new Promise((done) => server.close(done));
  }
  console.log(
    `Validated ${builtItems.size} registry items and compiled ${consumers.length} installed consumers with TypeScript and Tailwind.`,
  );
} finally {
  await rm(tempRoot, { recursive: true, force: true });
}
