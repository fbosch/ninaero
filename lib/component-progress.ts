export function parseComponentProgress(markdown: string, componentNames: readonly string[]) {
  const expected = new Set(componentNames);
  const entries = new Map<string, boolean>();

  for (const line of markdown.split(/\r?\n/)) {
    if (!line.startsWith("- [")) continue;

    const match = /^- \[([ xX])\] `([a-z][a-z0-9-]*)`$/.exec(line);
    if (!match) throw new Error(`Malformed component checklist entry: ${line}`);

    const [, checked, name] = match;
    if (!expected.has(name)) throw new Error(`Unknown component in COMPONENTS.md: ${name}`);
    if (entries.has(name)) throw new Error(`Duplicate component in COMPONENTS.md: ${name}`);
    entries.set(name, checked.toLowerCase() === "x");
  }

  const missing = componentNames.filter((name) => !entries.has(name));
  if (missing.length) {
    throw new Error(`Missing components in COMPONENTS.md: ${missing.join(", ")}`);
  }

  return {
    themed: [...entries.values()].filter(Boolean).length,
    total: entries.size,
  };
}
