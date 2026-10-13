import { readFile } from "node:fs/promises";

import type { Metadata } from "next";
import Link from "next/link";

import { CodeBlock } from "@/components/docs/code-block";
import { SettingsPreview } from "@/components/examples/settings-preview";
import { settingsExampleSource } from "@/lib/example-source";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/registry/ninaero/ui/tabs";

export const metadata: Metadata = {
  title: "Settings example | Ninaero",
  description: "A compact settings form with a live preview and copyable source.",
};

const related = ["button", "input", "label", "tabs", "popover", "switch"];

export default async function SettingsExamplePage() {
  const [preview, state] = await Promise.all([
    readFile("components/examples/settings-preview.tsx", "utf8"),
    readFile("components/examples/settings-state.ts", "utf8"),
  ]);
  const code = settingsExampleSource(preview, state);

  return (
    <main id="main" className="mx-auto max-w-5xl space-y-8 px-5 py-12 sm:px-8">
      <header className="space-y-3">
        <Link href="/examples" className="text-sm text-muted-foreground hover:text-foreground">
          Examples
        </Link>
        <h1 className="text-3xl font-semibold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          A local settings preview. Nothing is sent to a server.
        </p>
      </header>
      <Tabs defaultValue="preview" className="gap-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <TabsList variant="line" aria-label="Example view">
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="code">Code</TabsTrigger>
          </TabsList>
          <Link
            href="/examples/settings/preview"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Open preview
          </Link>
        </div>
        <TabsContent value="preview">
          <div className="flex justify-center rounded-xl bg-muted/30 p-4 sm:p-8">
            <SettingsPreview />
          </div>
        </TabsContent>
        <TabsContent value="code">
          <CodeBlock code={code} label="settings-preview.tsx" />
        </TabsContent>
      </Tabs>
      <nav
        aria-label="Related components"
        className="flex flex-wrap gap-4 border-t pt-6 text-sm text-muted-foreground"
      >
        {related.map((name) => (
          <Link key={name} href={`/docs/${name}`} className="hover:text-foreground">
            {name.charAt(0).toUpperCase() + name.slice(1)}
          </Link>
        ))}
      </nav>
    </main>
  );
}
