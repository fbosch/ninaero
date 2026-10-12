import type { Metadata } from "next";
import Link from "next/link";
import { CodeBlock } from "@/components/docs/code-block";
import { presetInstallCommand } from "@/lib/component-documentation";
import { overviewItems } from "@/lib/component-overview";

export const metadata: Metadata = {
  title: "Getting started | Ninaero",
  description:
    "Install Ninaero's shared theme and browse documentation for every component.",
};

const renderExample = `import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Example() {
  return (
    <Button nativeButton={false} render={<Link href="/components" />}>
      Browse components
    </Button>
  );
}`;

export default function DocsPage() {
  return (
    <article className="space-y-10">
      <header className="space-y-4">
        <p className="text-xs font-medium text-muted-foreground">
          Documentation
        </p>
        <h1 className="text-4xl font-semibold tracking-tight">
          Getting started
        </h1>
        <p className="max-w-2xl leading-relaxed text-muted-foreground">
          Install the Ninaero theme and components through the shadcn registry.
          Each of the {overviewItems.length} components has a page with a live
          preview, install command, usage example, API signatures, and source.
        </p>
      </header>

      <section aria-labelledby="docs-quick-start" className="space-y-4">
        <h2 id="docs-quick-start" className="text-xl font-semibold">
          Quick start
        </h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          For a new project, initialize shadcn with the complete Ninaero preset.
          It installs the shared theme, every component, and supporting hooks
          and utilities.
        </p>
        <CodeBlock code={presetInstallCommand} label="Complete preset" />
        <p className="text-sm text-muted-foreground">
          When using the local registry, keep the Ninaero server running while
          the CLI fetches its files.
        </p>
      </section>

      <section aria-labelledby="docs-component-install" className="space-y-4">
        <h2 id="docs-component-install" className="text-xl font-semibold">
          Install one component
        </h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          In an initialized shadcn/ui project, use the install command on the
          component's page. The CLI resolves its shared theme, package
          dependencies, and related registry items.
        </p>
        <div className="flex flex-wrap gap-4 text-sm">
          <Link href="/docs/button" className="underline underline-offset-4">
            Button documentation
          </Link>
          <Link href="/docs/dialog" className="underline underline-offset-4">
            Dialog documentation
          </Link>
          <Link href="/components" className="underline underline-offset-4">
            Component overview
          </Link>
        </div>
      </section>

      <section aria-labelledby="docs-source-ownership" className="space-y-4">
        <h2 id="docs-source-ownership" className="text-xl font-semibold">
          Edit the installed source
        </h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          The CLI copies component files into your project and merges theme
          tokens into the CSS file configured in{" "}
          <code className="text-foreground">components.json</code>. Those files
          are yours to edit. Documentation examples use the standard{" "}
          <code className="text-foreground">@/components/ui</code> alias.
        </p>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Base UI components use the{" "}
          <code className="text-foreground">render</code> prop to render another
          element. For a button rendered as a link, set{" "}
          <code className="text-foreground">nativeButton</code> to false.
        </p>
        <CodeBlock code={renderExample} label="Render a button as a link" />
      </section>

      <section aria-labelledby="docs-theme-guide" className="space-y-4">
        <h2 id="docs-theme-guide" className="text-xl font-semibold">
          Change the shared theme
        </h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          The preview and registry both use{" "}
          <code className="text-foreground">registry/ninaero/theme.mjs</code>.
          Read the{" "}
          <Link
            href="/docs/theme"
            className="text-foreground underline underline-offset-4"
          >
            theme guide
          </Link>{" "}
          before editing generated CSS.
        </p>
      </section>
    </article>
  );
}
