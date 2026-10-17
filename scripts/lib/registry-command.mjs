import { defaultRegistryUrl, normalizeRegistryUrl } from "./theme.mjs";

const packageManagerRunners = new Map([
  ["npm", "npx"],
  ["pnpm", "pnpm dlx"],
  ["yarn", "yarn dlx"],
  ["bun", "bunx --bun"],
]);

export function registryCommand(
  action,
  name,
  registryUrl = defaultRegistryUrl,
  packageManager = "pnpm",
) {
  if (action !== "add" && action !== "init") throw new Error("Unsupported shadcn action.");
  if (!/^[a-z][a-z0-9-]*$/.test(name)) throw new Error("Invalid registry item name.");
  const runner = packageManagerRunners.get(packageManager);
  if (!runner) throw new Error("Unsupported package manager.");
  const url = `${normalizeRegistryUrl(registryUrl)}/${name}.json`;
  const quoted = url.replaceAll("'", "'\\''");
  return `${runner} shadcn@latest ${action} '${quoted}'`;
}
