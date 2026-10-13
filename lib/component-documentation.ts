import documentation from "@/generated/component-docs.json";
import { registryCommand } from "@/scripts/lib/registry-command.mjs";

import type { ComponentName } from "./component-overview";

export const docsRegistryUrl = documentation.registryUrl;
export const presetInstallCommand = registryCommand("init", "ninaero", docsRegistryUrl);

export function getComponentDocumentation(name: ComponentName) {
  const item = documentation.items.find((entry) => entry.name === name);
  if (!item)
    throw new Error(`Missing generated documentation for ${name}. Run pnpm registry:build.`);
  return item;
}
