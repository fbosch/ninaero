import { isIP } from "node:net";
import { dirname, posix } from "node:path";

import ts from "typescript";

const sourceRoots = {
  "registry:ui": "registry/ninaero/ui/",
  "registry:hook": "registry/ninaero/hooks/",
  "registry:lib": "lib/",
};
const acceptedFileTypes = new Set([
  "registry:ui",
  "registry:hook",
  "registry:lib",
  "registry:file",
  "registry:page",
]);

function sourceKey(path) {
  return path.replace(/\.[cm]?[jt]sx?$/, "");
}

export function importsInSource(path, content) {
  const source = ts.createSourceFile(path, content, ts.ScriptTarget.Latest, true);
  const specifiers = new Set();

  function visit(node) {
    if (
      (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) &&
      node.moduleSpecifier &&
      ts.isStringLiteralLike(node.moduleSpecifier)
    ) {
      specifiers.add(node.moduleSpecifier.text);
    }
    if (
      ts.isCallExpression(node) &&
      node.expression.kind === ts.SyntaxKind.ImportKeyword &&
      node.arguments.length === 1 &&
      ts.isStringLiteralLike(node.arguments[0])
    ) {
      specifiers.add(node.arguments[0].text);
    }
    ts.forEachChild(node, visit);
  }

  visit(source);
  return specifiers;
}

function packageName(specifier) {
  return specifier.startsWith("@")
    ? specifier.split("/").slice(0, 2).join("/")
    : specifier.split("/")[0];
}

function localImportPath(filePath, specifier) {
  const path = specifier.startsWith("@/")
    ? specifier.slice(2)
    : posix.join(dirname(filePath), specifier);
  const normalized = posix.normalize(path);
  if (normalized.startsWith("../") || normalized === ".." || normalized.startsWith("/")) {
    return null;
  }
  return sourceKey(normalized);
}

export function validateCatalog({ catalog, sources, dependencies }) {
  const errors = [];
  const names = new Set();
  const owners = new Map();
  const sourceRecords = [];

  for (const item of catalog.items ?? []) {
    if (!item || typeof item.name !== "string" || item.name.length === 0) {
      errors.push("Catalog item has no name.");
      continue;
    }
    if (names.has(item.name)) errors.push(`Duplicate catalog item name: ${item.name}.`);
    names.add(item.name);

    if (!Array.isArray(item.files) || item.files.length === 0) {
      errors.push(`${item.name}: expected at least one source file.`);
      continue;
    }
    if (!Array.isArray(item.packages) || !Array.isArray(item.items)) {
      errors.push(`${item.name}: packages and items must be arrays.`);
      continue;
    }

    const filePaths = new Set();
    for (const file of item.files) {
      if (!file || typeof file.path !== "string" || typeof file.type !== "string") {
        errors.push(`${item.name}: each file needs a path and type.`);
        continue;
      }
      const normalized = posix.normalize(file.path);
      if (
        normalized !== file.path ||
        normalized.startsWith("../") ||
        normalized.startsWith("/") ||
        file.path.includes("\\") ||
        /^[a-z]+:/i.test(file.path)
      ) {
        errors.push(`${item.name}: source path must be a normalized relative path: ${file.path}.`);
      }
      if (!file.path.startsWith("registry/ninaero/") && !file.path.startsWith("lib/")) {
        errors.push(`${item.name}: source is outside installable roots: ${file.path}.`);
      }
      if (!acceptedFileTypes.has(file.type)) {
        errors.push(`${item.name}: unsupported source file type ${file.type} at ${file.path}.`);
      }
      if (
        file.type !== item.type &&
        file.type !== "registry:file" &&
        file.type !== "registry:page"
      ) {
        errors.push(
          `${item.name}: file type ${file.type} does not match item type ${item.type} at ${file.path}.`,
        );
      }
      if ((file.type === "registry:file" || file.type === "registry:page") && !file.target) {
        errors.push(`${item.name}: ${file.type} requires a target (${file.path}).`);
      }
      if (
        file.target !== undefined &&
        (typeof file.target !== "string" ||
          file.target.trim() === "" ||
          file.target.includes("\\") ||
          file.target.split("/").includes("..") ||
          file.target.startsWith("/") ||
          /^[a-z]+:/i.test(file.target))
      ) {
        errors.push(
          `${item.name}: target must be a consumer-relative path or alias (${file.path}).`,
        );
      }
      if (sourceRoots[file.type] && !file.path.startsWith(sourceRoots[file.type])) {
        errors.push(
          `${item.name}: ${file.type} source must stay under ${sourceRoots[file.type]}: ${file.path}.`,
        );
      }
      if (filePaths.has(file.path))
        errors.push(`${item.name}: duplicate source file ${file.path}.`);
      filePaths.add(file.path);
      const key = sourceKey(file.path);
      if (owners.has(key)) {
        errors.push(
          `Source file has multiple registry owners: ${file.path} (${owners.get(key)} and ${item.name}).`,
        );
      } else {
        owners.set(key, item.name);
      }
      if (sources[file.path] === undefined)
        errors.push(`${item.name}: missing source file ${file.path}.`);
      sourceRecords.push({ item, file });
    }

    const packages = new Set(item.packages);
    for (const name of packages) {
      if (typeof name !== "string" || !name || !dependencies[name]) {
        errors.push(
          `${item.name}: package dependency ${String(name)} has no version in package.json dependencies.`,
        );
      }
    }
    for (const dependency of item.items) {
      if (typeof dependency !== "string" || !dependency || dependency === item.name) {
        errors.push(`${item.name}: invalid registry item dependency ${String(dependency)}.`);
      }
    }
  }

  for (const { item, file } of sourceRecords) {
    const content = sources[file.path];
    if (content === undefined) continue;
    const packages = new Set(item.packages);
    const registryItems = new Set(item.items);

    for (const specifier of importsInSource(file.path, content)) {
      if (specifier.startsWith("@/") || specifier.startsWith(".")) {
        const key = localImportPath(file.path, specifier);
        const owner = key && owners.get(key);
        if (!owner) {
          errors.push(
            `${item.name}: local import is outside registered installable sources in ${file.path}: ${specifier}.`,
          );
        } else if (owner !== item.name && !registryItems.has(owner)) {
          errors.push(
            `${item.name}: missing registry dependency ${owner} for import ${specifier} in ${file.path}.`,
          );
        }
        continue;
      }
      if (
        specifier === "react" ||
        specifier.startsWith("react/") ||
        specifier === "react-dom" ||
        specifier.startsWith("react-dom/") ||
        specifier.startsWith("node:")
      ) {
        continue;
      }
      const dependency = packageName(specifier);
      if (!packages.has(dependency)) {
        errors.push(
          `${item.name}: missing package dependency ${dependency} for import ${specifier} in ${file.path}.`,
        );
      }
      if (!dependencies[dependency]) {
        errors.push(
          `${item.name}: imported package ${dependency} has no version in package.json dependencies.`,
        );
      }
    }

    for (const dependency of registryItems) {
      if (!names.has(dependency)) {
        errors.push(`${item.name}: unknown registry item dependency ${dependency}.`);
      }
    }
  }

  return errors;
}

function registryItemAddress(value, registryUrl) {
  if (typeof value !== "string") return null;
  try {
    const url = new URL(value);
    const root = new URL(registryUrl);
    const prefix = `${root.pathname.replace(/\/$/, "")}/`;
    if (url.origin !== root.origin || url.username || url.password || url.search || url.hash)
      return null;
    if (!url.pathname.startsWith(prefix) || !url.pathname.endsWith(".json")) return null;
    return decodeURIComponent(url.pathname.slice(prefix.length, -".json".length));
  } catch {
    return null;
  }
}

export function validateGeneratedRegistry(
  registry,
  { catalogItems, packageVersions, registryUrl },
) {
  const errors = [];
  const names = new Map();
  const owners = new Map();
  let rootUrl;
  try {
    rootUrl = new URL(registryUrl);
  } catch {
    return [`Invalid registry URL: ${registryUrl}.`];
  }

  for (const item of registry.items ?? []) {
    if (!item || typeof item.name !== "string") {
      errors.push("Generated registry item has no name.");
      continue;
    }
    if (names.has(item.name))
      errors.push(`Generated registry has duplicate item name ${item.name}.`);
    names.set(item.name, item);
    for (const file of item.files ?? []) {
      if (owners.has(file.path)) {
        errors.push(
          `Generated source file ${file.path} is owned by both ${owners.get(file.path)} and ${item.name}.`,
        );
      } else {
        owners.set(file.path, item.name);
      }
    }
  }
  for (const item of names.values()) {
    for (const dependency of item.registryDependencies ?? []) {
      const target = registryItemAddress(dependency, rootUrl.href);
      if (!target) {
        errors.push(
          `${item.name}: registry dependency must be a URL in this registry, not ${dependency}.`,
        );
      } else if (!names.has(target)) {
        errors.push(
          `${item.name}: registry dependency does not resolve to a published item: ${dependency}.`,
        );
      }
    }
  }
  for (const expected of catalogItems) {
    const item = names.get(expected.name);
    if (!item) {
      errors.push(`Generated registry is missing catalog item ${expected.name}.`);
      continue;
    }
    for (const dependency of expected.packages) {
      const address = `${dependency}@${packageVersions[dependency]}`;
      if (!(item.dependencies ?? []).includes(address)) {
        errors.push(`${expected.name}: generated item is missing package dependency ${address}.`);
      }
    }
    const dependencies = new Set(
      (item.registryDependencies ?? []).map((value) => registryItemAddress(value, registryUrl)),
    );
    for (const dependency of expected.items) {
      if (!dependencies.has(dependency)) {
        errors.push(
          `${expected.name}: generated item is missing registry dependency ${dependency}.`,
        );
      }
    }
  }
  return errors;
}

function isPrivateIpv4(host) {
  const parts = host.split(".").map(Number);
  const [first, second] = parts;
  return (
    first === 0 ||
    first === 10 ||
    first === 127 ||
    first >= 224 ||
    (first === 169 && second === 254) ||
    (first === 172 && second >= 16 && second <= 31) ||
    (first === 192 && second === 168) ||
    (first === 100 && second >= 64 && second <= 127) ||
    (first === 198 && (second === 18 || second === 19))
  );
}

export function releaseRegistryError(value) {
  if (typeof value !== "string" || value.trim() === "") {
    return "REGISTRY_URL must be set for release checks.";
  }
  let url;
  try {
    url = new URL(value);
  } catch {
    return "REGISTRY_URL must be an absolute HTTPS URL for release checks.";
  }
  if (
    url.protocol !== "https:" ||
    url.username ||
    url.password ||
    url.search ||
    url.hash ||
    url.pathname.replace(/\/$/, "") === ""
  ) {
    return "REGISTRY_URL must be an HTTPS registry directory without credentials, query, or fragment.";
  }
  if (url.pathname.replace(/\/$/, "").split("/").at(-1) !== "r") {
    return "REGISTRY_URL must end in /r for release checks.";
  }

  const hostname = url.hostname
    .toLowerCase()
    .replace(/^\[|\]$/g, "")
    .replace(/\.$/, "");
  const localSuffixes = [
    "localhost",
    "local",
    "localdomain",
    "internal",
    "lan",
    "home",
    "home.arpa",
    "test",
    "example",
    "invalid",
    "example.com",
    "example.net",
    "example.org",
  ];
  if (
    (!isIP(hostname) && !hostname.includes(".")) ||
    localSuffixes.some((suffix) => hostname === suffix || hostname.endsWith(`.${suffix}`))
  ) {
    return `REGISTRY_URL must use a public host, not ${hostname}.`;
  }
  if (isIP(hostname) === 4 && isPrivateIpv4(hostname)) {
    return `REGISTRY_URL must not use a private or reserved IPv4 address: ${hostname}.`;
  }
  if (isIP(hostname) === 6 && (!/^[23]/.test(hostname) || hostname.startsWith("2001:db8:"))) {
    return `REGISTRY_URL must not use a private or reserved IPv6 address: ${hostname}.`;
  }
  return null;
}

export function typescriptDiagnostics(configPath) {
  const config = ts.readConfigFile(configPath, ts.sys.readFile);
  if (config.error) return [config.error];
  const parsed = ts.parseJsonConfigFileContent(
    config.config,
    ts.sys,
    dirname(configPath),
    undefined,
    configPath,
  );
  const program = ts.createProgram({ rootNames: parsed.fileNames, options: parsed.options });
  return [...parsed.errors, ...ts.getPreEmitDiagnostics(program)];
}

export function formatTypeScriptDiagnostics(diagnostics, currentDirectory) {
  return ts.formatDiagnosticsWithColorAndContext(diagnostics, {
    getCurrentDirectory: () => currentDirectory,
    getCanonicalFileName: (fileName) => fileName,
    getNewLine: () => "\n",
  });
}
