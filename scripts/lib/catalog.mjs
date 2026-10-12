import { readFile } from "node:fs/promises";
import { posix } from "node:path";
import ts from "typescript";

function withoutExtension(path) {
  return path.replace(/\.[cm]?[jt]sx?$/, "");
}

function imports(path, content) {
  const source = ts.createSourceFile(
    path,
    content,
    ts.ScriptTarget.Latest,
    true,
  );
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

export async function readCatalogSources(catalog, root) {
  const paths = [
    ...new Set(
      catalog.items.flatMap((item) => item.files.map((file) => file.path)),
    ),
  ];
  return Object.fromEntries(
    await Promise.all(
      paths.map(async (path) => [
        path,
        await readFile(new URL(path, root), "utf8"),
      ]),
    ),
  );
}

export function resolveCatalog(catalog, sources) {
  const names = new Set(catalog.items.map((item) => item.name));
  const owners = new Map(
    catalog.items.flatMap((item) =>
      item.files.map((file) => [withoutExtension(file.path), item.name]),
    ),
  );

  return catalog.items.map((item) => {
    const packages = new Set(item.packages);
    const items = new Set(item.items);
    for (const file of item.files) {
      const content = sources[file.path];
      if (content === undefined)
        throw new Error(`Missing catalogue source: ${file.path}`);
      for (const specifier of imports(file.path, content)) {
        if (specifier.startsWith("@/") || specifier.startsWith(".")) {
          const path = specifier.startsWith("@/")
            ? specifier.slice(2)
            : posix.join(posix.dirname(file.path), specifier);
          const owner = owners.get(withoutExtension(path));
          if (!owner)
            throw new Error(
              `Unregistered import in ${file.path}: ${specifier}`,
            );
          if (owner !== item.name) items.add(owner);
        } else if (
          specifier !== "react" &&
          !specifier.startsWith("react/") &&
          specifier !== "react-dom" &&
          !specifier.startsWith("react-dom/") &&
          !specifier.startsWith("node:")
        ) {
          packages.add(
            specifier.startsWith("@")
              ? specifier.split("/").slice(0, 2).join("/")
              : specifier.split("/")[0],
          );
        }
      }
    }
    for (const dependency of items) {
      if (!names.has(dependency)) {
        throw new Error(
          `Unknown registry dependency of ${item.name}: ${dependency}`,
        );
      }
    }
    return {
      ...item,
      packages: [...packages].sort(),
      items: [...items].sort(),
    };
  });
}
