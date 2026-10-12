import { defaultRegistryUrl, normalizeRegistryUrl } from "./theme.mjs";

export function registryCommand(
  action,
  name,
  registryUrl = defaultRegistryUrl,
) {
  if (action !== "add" && action !== "init")
    throw new Error("Unsupported shadcn action.");
  if (!/^[a-z][a-z0-9-]*$/.test(name))
    throw new Error("Invalid registry item name.");
  const url = `${normalizeRegistryUrl(registryUrl)}/${name}.json`;
  const quoted = url.replaceAll("'", "'\\''");
  return `pnpm dlx shadcn@latest ${action} '${quoted}'`;
}
