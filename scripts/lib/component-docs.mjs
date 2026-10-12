import { readFile } from "node:fs/promises";
import { posix } from "node:path";
import ts from "typescript";
import { registryCommand } from "./registry-command.mjs";
import { defaultRegistryUrl, normalizeRegistryUrl } from "./theme.mjs";

const previewPaths = [
  "components/overview/control-previews.tsx",
  "components/overview/navigation-previews.tsx",
  "components/overview/overlay-previews.tsx",
  "components/overview/display-previews.tsx",
  "components/overview/calendar-preview.tsx",
  "components/overview/questionnaire-preview.tsx",
  "components/overview/chart-preview.tsx",
  "components/overview/carousel-preview.tsx",
  "components/overview/layout-previews.tsx",
];

const previewMaps = [
  "components/overview/control-previews.tsx",
  "components/overview/navigation-previews.tsx",
  "components/overview/overlay-previews.tsx",
  "components/overview/display-previews.tsx",
];

function parseSource(path, content) {
  return ts.createSourceFile(
    path,
    content,
    ts.ScriptTarget.Latest,
    true,
    path.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS,
  );
}

function readPropertyName(name) {
  if (ts.isIdentifier(name)) return name.text;
  if (ts.isStringLiteralLike(name) || ts.isNumericLiteral(name))
    return name.text;
  return undefined;
}

function unwrapExpression(expression) {
  while (
    ts.isParenthesizedExpression(expression) ||
    ts.isAsExpression(expression) ||
    ts.isSatisfiesExpression(expression) ||
    ts.isTypeAssertionExpression(expression)
  ) {
    expression = expression.expression;
  }
  return expression;
}

function topLevelDeclarations(source) {
  const declarations = new Map();
  for (const statement of source.statements) {
    if (
      (ts.isFunctionDeclaration(statement) ||
        ts.isClassDeclaration(statement) ||
        ts.isInterfaceDeclaration(statement) ||
        ts.isTypeAliasDeclaration(statement) ||
        ts.isEnumDeclaration(statement)) &&
      statement.name
    ) {
      declarations.set(statement.name.text, statement);
    } else if (ts.isVariableStatement(statement)) {
      for (const declaration of statement.declarationList.declarations) {
        if (ts.isIdentifier(declaration.name)) {
          declarations.set(declaration.name.text, statement);
        }
      }
    }
  }
  return declarations;
}

function moduleSpecifierFromDynamic(expression) {
  expression = unwrapExpression(expression);
  if (ts.isArrowFunction(expression) || ts.isFunctionExpression(expression)) {
    if (!expression.body || !ts.isExpression(expression.body)) return undefined;
    return moduleSpecifierFromDynamic(expression.body);
  }
  if (ts.isCallExpression(expression)) {
    if (expression.expression.kind === ts.SyntaxKind.ImportKeyword) {
      const specifier = expression.arguments[0];
      return specifier && ts.isStringLiteralLike(specifier)
        ? { path: specifier.text, exportName: "default" }
        : undefined;
    }
    if (
      ts.isPropertyAccessExpression(expression.expression) &&
      expression.expression.name.text === "then"
    ) {
      const imported = moduleSpecifierFromDynamic(
        expression.expression.expression,
      );
      if (!imported) return undefined;
      const callback = expression.arguments[0];
      if (
        !callback ||
        (!ts.isArrowFunction(callback) && !ts.isFunctionExpression(callback))
      ) {
        return imported;
      }
      let body = callback.body;
      if (ts.isBlock(body)) {
        const returned = body.statements.find(ts.isReturnStatement);
        body = returned?.expression;
      }
      if (body && ts.isPropertyAccessExpression(unwrapExpression(body))) {
        return {
          ...imported,
          exportName: unwrapExpression(body).name.text,
        };
      }
      return imported;
    }
    return expression.arguments[0]
      ? moduleSpecifierFromDynamic(expression.arguments[0])
      : undefined;
  }
  return undefined;
}

function findMapProperty(source, name) {
  for (const statement of source.statements) {
    if (!ts.isVariableStatement(statement)) continue;
    for (const declaration of statement.declarationList.declarations) {
      if (!ts.isIdentifier(declaration.name)) continue;
      const object =
        declaration.initializer && unwrapExpression(declaration.initializer);
      if (!object || !ts.isObjectLiteralExpression(object)) continue;
      for (const property of object.properties) {
        if (!ts.isPropertyAssignment(property) || !property.name) continue;
        if (readPropertyName(property.name) === name)
          return property.initializer;
      }
    }
  }
  return undefined;
}

function findImportedPreview(mapPath, mapSource, name, previewSources) {
  const property = findMapProperty(mapSource, name);
  if (!property) return undefined;
  const value = unwrapExpression(property);
  if (ts.isFunctionExpression(value) || ts.isArrowFunction(value)) {
    return {
      path: mapPath,
      source: mapSource,
      node: value,
      exportName: undefined,
    };
  }
  if (!ts.isIdentifier(value)) return undefined;

  const declarations = topLevelDeclarations(mapSource);
  const declaration = declarations.get(value.text);
  if (declaration && ts.isFunctionDeclaration(declaration)) {
    return {
      path: mapPath,
      source: mapSource,
      node: declaration,
      exportName: undefined,
    };
  }
  if (!declaration || !ts.isVariableStatement(declaration)) return undefined;

  const binding = declaration.declarationList.declarations.find(
    (candidate) =>
      ts.isIdentifier(candidate.name) && candidate.name.text === value.text,
  );
  if (!binding?.initializer) return undefined;
  const dynamic = moduleSpecifierFromDynamic(binding.initializer);
  if (!dynamic) return undefined;

  const targetPath = posix.normalize(
    posix.join(posix.dirname(mapPath), dynamic.path),
  );
  const resolvedPath =
    targetPath.endsWith(".tsx") || targetPath.endsWith(".ts")
      ? targetPath
      : `${targetPath}.tsx`;
  const targetContent = previewSources[resolvedPath];
  if (targetContent === undefined) {
    throw new Error(`Missing preview source for ${name}: ${resolvedPath}`);
  }
  const targetSource = parseSource(resolvedPath, targetContent);
  const targetNode = findExportedPreview(targetSource, dynamic.exportName);
  if (!targetNode) {
    throw new Error(
      `Cannot resolve ${dynamic.exportName} preview export for ${name} in ${resolvedPath}`,
    );
  }
  return {
    path: resolvedPath,
    source: targetSource,
    node: targetNode,
    exportName: dynamic.exportName,
  };
}

function findExportedPreview(source, exportName) {
  for (const statement of source.statements) {
    if (exportName === "default" && ts.isFunctionDeclaration(statement)) {
      if (
        statement.modifiers?.some(
          (modifier) => modifier.kind === ts.SyntaxKind.DefaultKeyword,
        )
      ) {
        return statement;
      }
    }
    if (
      ts.isFunctionDeclaration(statement) &&
      statement.name?.text === exportName
    ) {
      return statement;
    }
    if (ts.isVariableStatement(statement)) {
      for (const declaration of statement.declarationList.declarations) {
        if (
          ts.isIdentifier(declaration.name) &&
          declaration.name.text === exportName &&
          declaration.initializer
        ) {
          return declaration;
        }
      }
    }
  }
  return undefined;
}

function referencedNames(node) {
  const names = new Set();
  function visit(current) {
    if (ts.isIdentifier(current)) names.add(current.text);
    ts.forEachChild(current, visit);
  }
  visit(node);
  return names;
}

function sourceDeclarationFor(statement, source) {
  const start = statement.modifiers?.length
    ? statement.modifiers.at(-1).end
    : statement.getStart(source);
  return source.text.slice(start, statement.end).trim();
}

function isInteractivePreview(node) {
  let functionLike = node;
  if (ts.isVariableDeclaration(node) && node.initializer) {
    functionLike = unwrapExpression(node.initializer);
  }
  if (!ts.isFunctionLike(functionLike) || !functionLike.parameters.length)
    return false;
  const parameter = functionLike.parameters[0];
  if (
    parameter.type &&
    ts.isTypeReferenceNode(parameter.type) &&
    ts.isIdentifier(parameter.type.typeName) &&
    parameter.type.typeName.text === "PreviewProps"
  ) {
    return true;
  }
  const binding = parameter.name;
  if (!ts.isObjectBindingPattern(binding)) return false;
  return binding.elements.some(
    (element) =>
      readPropertyName(element.propertyName ?? element.name) === "interactive",
  );
}

function aliasConsumerImport(specifier) {
  if (specifier.startsWith("@/registry/ninaero/ui/")) {
    return specifier.replace("@/registry/ninaero/ui/", "@/components/ui/");
  }
  if (specifier.startsWith("@/registry/ninaero/hooks/")) {
    return specifier.replace("@/registry/ninaero/hooks/", "@/hooks/");
  }
  return specifier;
}

function importLocalNames(importClause) {
  const names = [];
  if (importClause.name) names.push(importClause.name.text);
  if (
    importClause.namedBindings &&
    ts.isNamespaceImport(importClause.namedBindings)
  ) {
    names.push(importClause.namedBindings.name.text);
  } else if (importClause.namedBindings) {
    for (const element of importClause.namedBindings.elements)
      names.push(element.name.text);
  }
  return names;
}

function renderImport(statement, source, refs) {
  const clause = statement.importClause;
  const rewritten = JSON.stringify(
    aliasConsumerImport(statement.moduleSpecifier.text),
  );
  const suffix = source.text.slice(
    statement.moduleSpecifier.end,
    statement.end,
  );
  if (!clause) return `import ${rewritten}${suffix}`;

  const bindings = [];
  if (clause.name && refs.has(clause.name.text))
    bindings.push(clause.name.text);
  if (clause.namedBindings && ts.isNamespaceImport(clause.namedBindings)) {
    if (refs.has(clause.namedBindings.name.text)) {
      bindings.push(clause.namedBindings.getText(source));
    }
  } else if (clause.namedBindings) {
    const elements = clause.namedBindings.elements.filter((element) =>
      refs.has(element.name.text),
    );
    if (elements.length) {
      bindings.push(
        `{ ${elements.map((element) => element.getText(source)).join(", ")} }`,
      );
    }
  }
  if (!bindings.length) return undefined;

  return `import${clause.isTypeOnly ? " type" : ""} ${bindings.join(", ")} from ${rewritten}${suffix}`;
}

function buildExample(componentName, preview) {
  const { path, source, node } = preview;
  const declarations = topLevelDeclarations(source);
  const includedStatements = new Set();
  const pending = [node];
  const includedNodes = new Set();

  while (pending.length) {
    const current = pending.pop();
    if (includedNodes.has(current)) continue;
    includedNodes.add(current);
    const names = referencedNames(current);
    for (const name of names) {
      const statement = declarations.get(name);
      if (
        !statement ||
        statement === current ||
        includedStatements.has(statement)
      )
        continue;
      includedStatements.add(statement);
      pending.push(statement);
    }
  }

  const refs = new Set();
  for (const current of includedNodes) {
    for (const name of referencedNames(current)) refs.add(name);
  }
  const imports = [];
  let needsPreviewProps = false;
  for (const statement of source.statements) {
    if (
      !ts.isImportDeclaration(statement) ||
      !ts.isStringLiteralLike(statement.moduleSpecifier)
    )
      continue;
    const specifier = statement.moduleSpecifier.text;
    if (specifier === "@/lib/component-overview") {
      if (
        statement.importClause &&
        importLocalNames(statement.importClause).includes("PreviewProps") &&
        refs.has("PreviewProps")
      ) {
        needsPreviewProps = true;
      }
      continue;
    }
    if (specifier === "next/dynamic") continue;
    const rendered = renderImport(statement, source, refs);
    if (rendered) imports.push(rendered);
  }

  const dependencySource = [...includedStatements]
    .map((statement) => sourceDeclarationFor(statement, source))
    .filter(Boolean);
  const previewText = sourceDeclarationFor(node, source);
  if (!previewText)
    throw new Error(
      `Cannot serialize preview function for ${componentName} (${path})`,
    );

  const renderName =
    ts.isFunctionDeclaration(node) && node.name
      ? node.name.text
      : ts.isVariableDeclaration(node) && ts.isIdentifier(node.name)
        ? node.name.text
        : ts.isFunctionExpression(node) && node.name
          ? node.name.text
          : `${componentName.replace(/(^|-)([a-z])/g, (_, __, letter) => letter.toUpperCase())}Preview`;
  const previewDeclaration =
    ts.isFunctionExpression(node) || ts.isArrowFunction(node)
      ? `const ${renderName} = ${previewText};`
      : previewText;
  const directive =
    source.statements[0] &&
    ts.isExpressionStatement(source.statements[0]) &&
    ts.isStringLiteral(source.statements[0].expression) &&
    source.statements[0].expression.text === "use client"
      ? '"use client";'
      : undefined;
  const demo = `export default function Demo() {\n  return <${renderName}${isInteractivePreview(node) ? " interactive" : ""} />;\n}`;

  return [
    directive,
    needsPreviewProps
      ? "type PreviewProps = { interactive?: boolean };"
      : undefined,
    ...imports,
    ...dependencySource,
    previewDeclaration,
    demo,
  ]
    .filter(Boolean)
    .join("\n\n");
}

function exportedBindings(source) {
  const declarations = topLevelDeclarations(source);
  const bindings = new Map();
  const add = (name, localName, isReExport = false) => {
    if (!bindings.has(name))
      bindings.set(name, { name, localName, isReExport });
  };

  for (const statement of source.statements) {
    const exported = statement.modifiers?.some(
      (modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword,
    );
    const isDefault = statement.modifiers?.some(
      (modifier) => modifier.kind === ts.SyntaxKind.DefaultKeyword,
    );
    if (
      exported &&
      (ts.isFunctionDeclaration(statement) ||
        ts.isClassDeclaration(statement) ||
        ts.isInterfaceDeclaration(statement) ||
        ts.isTypeAliasDeclaration(statement) ||
        ts.isEnumDeclaration(statement)) &&
      statement.name
    ) {
      add(isDefault ? "default" : statement.name.text, statement.name.text);
    } else if (exported && ts.isVariableStatement(statement)) {
      for (const declaration of statement.declarationList.declarations) {
        if (ts.isIdentifier(declaration.name))
          add(declaration.name.text, declaration.name.text);
      }
    } else if (
      ts.isExportDeclaration(statement) &&
      statement.exportClause &&
      ts.isNamedExports(statement.exportClause)
    ) {
      for (const element of statement.exportClause.elements) {
        const name = element.name.text;
        add(
          name,
          element.propertyName?.text ?? element.name.text,
          Boolean(statement.moduleSpecifier),
        );
      }
    } else if (ts.isExportAssignment(statement)) {
      add("default", undefined);
    }
  }
  return [...bindings.values()].map((binding) => ({
    ...binding,
    declaration: binding.isReExport
      ? undefined
      : declarations.get(binding.localName),
  }));
}

function functionLikeFor(declaration) {
  if (ts.isFunctionDeclaration(declaration)) return declaration;
  if (ts.isVariableStatement(declaration)) {
    const first = declaration.declarationList.declarations[0];
    if (first?.initializer) {
      const initializer = unwrapExpression(first.initializer);
      if (
        ts.isArrowFunction(initializer) ||
        ts.isFunctionExpression(initializer)
      )
        return initializer;
    }
  }
  if (ts.isVariableDeclaration(declaration) && declaration.initializer) {
    const initializer = unwrapExpression(declaration.initializer);
    if (ts.isArrowFunction(initializer) || ts.isFunctionExpression(initializer))
      return initializer;
  }
  return undefined;
}

function defaultsFor(functionLike, source) {
  if (!functionLike?.parameters.length) return [];
  const name = functionLike.parameters[0].name;
  if (!ts.isObjectBindingPattern(name)) return [];
  return name.elements.flatMap((element) => {
    if (!element.initializer) return [];
    const propName = readPropertyName(element.propertyName ?? element.name);
    if (!propName) return [];
    return [{ name: propName, value: element.initializer.getText(source) }];
  });
}

function apiForSource(path, content) {
  const source = parseSource(path, content);
  return exportedBindings(source).map(({ name, declaration, isReExport }) => {
    if (isReExport || !declaration) {
      return { name, kind: "re-export", props: "", defaults: [] };
    }
    if (
      ts.isTypeAliasDeclaration(declaration) ||
      ts.isInterfaceDeclaration(declaration)
    ) {
      return { name, kind: "type", props: "", defaults: [] };
    }
    const functionLike = functionLikeFor(declaration);
    if (functionLike) {
      const parameter = functionLike.parameters[0];
      return {
        name,
        kind: "function",
        props: parameter?.type?.getText(source) ?? "",
        defaults: defaultsFor(functionLike, source),
      };
    }
    return { name, kind: "value", props: "", defaults: [] };
  });
}

function sourceText(sources, path, description) {
  const content = sources[path];
  if (content === undefined) throw new Error(`Missing ${description}: ${path}`);
  return content;
}

export async function readPreviewSources(rootURL) {
  return Object.fromEntries(
    await Promise.all(
      previewPaths.map(async (path) => [
        path,
        await readFile(new URL(path, rootURL), "utf8"),
      ]),
    ),
  );
}

export function createComponentDocs(
  components,
  componentSources,
  previewSources,
  registryUrl = defaultRegistryUrl,
) {
  const normalizedRegistryUrl = normalizeRegistryUrl(registryUrl);
  const mapSources = new Map(
    previewMaps.map((path) => [
      path,
      parseSource(path, sourceText(previewSources, path, "preview source")),
    ]),
  );
  const items = components
    .filter((component) => component.type === "registry:ui")
    .map((component) => {
      const files = component.files.map(({ path }) => ({
        path,
        content: sourceText(componentSources, path, "component source"),
      }));
      const mapPath = previewMaps.find((path) =>
        findMapProperty(mapSources.get(path), component.name),
      );
      if (!mapPath)
        throw new Error(
          `Missing preview mapping for registry component: ${component.name}`,
        );
      const preview = findImportedPreview(
        mapPath,
        mapSources.get(mapPath),
        component.name,
        previewSources,
      );
      if (!preview)
        throw new Error(
          `Cannot resolve preview for registry component: ${component.name}`,
        );
      const api = files.flatMap(({ path, content }) =>
        apiForSource(path, content),
      );
      return {
        name: component.name,
        installCommand: registryCommand(
          "add",
          component.name,
          normalizedRegistryUrl,
        ),
        example: buildExample(component.name, preview),
        files,
        api,
        packages: component.packages,
        items: component.items,
      };
    });
  return { registryUrl: normalizedRegistryUrl, items };
}
