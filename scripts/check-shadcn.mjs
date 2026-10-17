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
const manifest = JSON.parse(await readFile(join(projectRoot, "package.json"), "utf8"));
const shadcnPackage = JSON.parse(
  await readFile(new URL("../package.json", import.meta.resolve("shadcn")), "utf8"),
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

  await runCli(["registry", "validate", sourceRegistry], tempRoot);
  const builtRegistry = join(tempRoot, "public/r");
  await runCli(["build", sourceRegistry, "--output", builtRegistry], tempRoot);

  const consumer = join(tempRoot, "consumer");
  const consumerRegistry = join(consumer, "registry");
  const consumerSource = join(consumer, "src");
  await mkdir(consumerRegistry, { recursive: true });
  await mkdir(consumerSource, { recursive: true });

  const builtNames = registry.items.map(({ name }) => name);
  for (const name of builtNames) {
    const itemPath = join(builtRegistry, `${name}.json`);
    const item = JSON.parse(await readFile(itemPath, "utf8"));
    item.registryDependencies = (item.registryDependencies ?? []).map((address) => {
      const target = new URL(address).pathname
        .split("/")
        .at(-1)
        ?.replace(/\.json$/, "");
      if (!target || !builtNames.includes(target)) {
        throw new Error(`${name}: generated dependency is not a Ninaero item: ${address}`);
      }
      return join(consumerRegistry, `${target}.json`);
    });
    await writeFile(join(consumerRegistry, `${name}.json`), `${JSON.stringify(item, null, 2)}\n`);
  }

  const dependencies = {};
  for (const name of builtNames) {
    const item = JSON.parse(await readFile(join(consumerRegistry, `${name}.json`), "utf8"));
    for (const value of item.dependencies ?? []) {
      const split = value.lastIndexOf("@");
      const packageName = value.slice(0, split);
      const version = value.slice(split + 1);
      dependencies[packageName] = version;
    }
  }
  const peerDependencies = ["react", "react-dom"];
  const devDependencies = Object.fromEntries(
    ["@types/react", "@types/react-dom", "typescript"].map((name) => [
      name,
      manifest.devDependencies[name],
    ]),
  );
  for (const name of peerDependencies) dependencies[name] = manifest.dependencies[name];
  const packageJson = {
    name: "ninaero-isolated-consumer",
    private: true,
    packageManager: manifest.packageManager,
    dependencies,
    devDependencies,
  };
  await writeFile(join(consumer, "package.json"), `${JSON.stringify(packageJson, null, 2)}\n`);
  for (const name of [...Object.keys(dependencies), ...Object.keys(devDependencies)]) {
    const installed = join(projectRoot, "node_modules", name);
    try {
      await access(installed);
    } catch {
      throw new Error(
        `Isolated consumer requires ${name}; install it in the project before running this check.`,
      );
    }
    const destination = join(consumer, "node_modules", name);
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
  await writeFile(
    join(consumerSource, "consumer-fixture.tsx"),
    await readFile(
      join(projectRoot, "scripts/lib/__tests__/fixtures/shadcn-consumer.tsx.txt"),
      "utf8",
    ),
  );

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
  try {
    server.listen(0, "127.0.0.1");
    await once(server, "listening");
    const address = server.address();
    await runCli(
      ["add", join(consumerRegistry, "ninaero.json"), "--cwd", consumer, "--yes", "--silent"],
      consumer,
      {
        REGISTRY_URL: `http://127.0.0.1:${address.port}/r`,
        NO_PROXY: "127.0.0.1,localhost",
        no_proxy: "127.0.0.1,localhost",
        npm_config_offline: "true",
      },
    );
    if (unexpectedRequests.size) {
      throw new Error(
        `CLI requested unpinned registry inputs: ${[...unexpectedRequests].join(", ")}`,
      );
    }
  } finally {
    server.closeAllConnections();
    await new Promise((done) => server.close(done));
  }
  const diagnostics = typescriptDiagnostics(join(consumer, "tsconfig.json"));
  if (diagnostics.length) {
    throw new Error(
      `Installed consumer did not typecheck:\n${formatTypeScriptDiagnostics(diagnostics, consumer)}`,
    );
  }
  console.log(
    `Validated ${builtNames.length} registry items and compiled the installed Base UI consumer.`,
  );
} finally {
  await rm(tempRoot, { recursive: true, force: true });
}
