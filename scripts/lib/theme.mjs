import { registrySchema } from "shadcn/schema";

export const defaultRegistryUrl = "http://localhost:3000/r";

function parseRegistryUrl(value) {
  let parsed;
  try {
    parsed = new URL(value);
  } catch (cause) {
    throw new Error("REGISTRY_URL must be an absolute HTTP(S) URL.", { cause });
  }
  if (
    !["http:", "https:"].includes(parsed.protocol) ||
    parsed.username ||
    parsed.password ||
    parsed.search ||
    parsed.hash
  ) {
    throw new Error(
      "REGISTRY_URL must be an HTTP(S) URL without credentials, query, or fragment.",
    );
  }
  return { url: parsed.href.replace(/\/$/, ""), origin: parsed.origin };
}

export function normalizeRegistryUrl(value) {
  return parseRegistryUrl(value).url;
}

function variables(values) {
  return Object.entries(values)
    .map(([name, value]) => `  --${name}: ${value};`)
    .join("\n");
}

function rules(values, depth = 0) {
  const indent = "  ".repeat(depth);
  return Object.entries(values)
    .map(([name, value]) => {
      if (typeof value === "string") return `${indent}${name}: ${value};`;
      if (Object.keys(value).length === 0) return `${indent}${name};`;
      return `${indent}${name} {\n${rules(value, depth + 1)}\n${indent}}`;
    })
    .join("\n");
}

export function renderThemeCss(theme) {
  return [
    "/* Generated from registry/ninaero/theme.mjs. Run pnpm registry:build. */",
    '@import "tailwindcss";',
    '@import "tw-animate-css";',
    '@import "shadcn/tailwind.css";',
    "@custom-variant dark (&:is(.dark *));",
    `@theme inline {\n${variables(theme.theme)}\n}`,
    `:root {\n${variables(theme.light)}\n}`,
    `.dark {\n${variables(theme.dark)}\n}`,
    rules(theme.css),
    "",
  ].join("\n\n");
}

export function createRegistry(
  theme,
  dependencies,
  components,
  registryUrl = defaultRegistryUrl,
) {
  const { url, origin } = parseRegistryUrl(registryUrl);
  const itemUrl = (name) => `${url}/${name}.json`;
  const packages = (names) =>
    names.map((name) => {
      if (!dependencies[name])
        throw new Error(`Missing package dependency: ${name}`);
      return `${name}@${dependencies[name]}`;
    });

  return registrySchema.parse({
    $schema: "https://ui.shadcn.com/schema/registry.json",
    name: "ninaero",
    homepage: origin,
    items: [
      {
        $schema: "https://ui.shadcn.com/schema/registry-item.json",
        name: "theme",
        title: "Ninaero theme",
        description:
          "Shared light and dark tokens with Ninaero squircle Button styling.",
        type: "registry:theme",
        dependencies: packages(["shadcn", "tw-animate-css"]),
        cssVars: { theme: theme.theme, light: theme.light, dark: theme.dark },
        css: theme.css,
      },
      ...components.map((component) => ({
        name: component.name,
        title: `Ninaero ${component.name}`,
        type: component.type,
        dependencies: packages(component.packages),
        registryDependencies: [
          ...(component.type === "registry:ui" ? ["theme"] : []),
          ...component.items,
        ].map(itemUrl),
        files: component.files,
      })),
      {
        name: "ninaero",
        title: "Ninaero baseline",
        description:
          "Complete Base UI component catalogue and shared theme tokens.",
        type: "registry:base",
        config: {
          style: "base-nova",
          iconLibrary: "lucide",
          tailwind: { baseColor: "neutral", cssVariables: true },
        },
        registryDependencies: [
          "theme",
          ...components.map(({ name }) => name),
        ].map(itemUrl),
      },
    ],
  });
}
