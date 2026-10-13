export function settingsExampleSource(preview: string, state: string): string {
  const stateImport = /^import \{[^}]+\} from "\.\/settings-state";\r?\n/m;
  if (!stateImport.test(preview)) {
    throw new Error("Settings preview is missing its state import");
  }
  return preview
    .replaceAll("@/registry/ninaero/ui/", "@/components/ui/")
    .replace(stateImport, `${state}\n`);
}
