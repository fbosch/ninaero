import Link from "next/link";

import { ComponentPreview } from "@/components/overview/component-preview";
import { type ComponentName, componentTitle, overviewItems } from "@/lib/component-overview";
import { sourceLanguage } from "@/lib/syntax-highlighting.mjs";

import { CodeBlock } from "./code-block";
import { HighlightedCode } from "./highlighted-code";

export type ComponentDocumentation = {
  name: string;
  installCommand: string;
  example: string;
  files: { path: string; content: string }[];
  api: {
    name: string;
    kind: string;
    props: string;
    defaults: { name: string; value: string }[];
  }[];
  packages: string[];
  items: string[];
};

export function ComponentContent({
  name,
  description,
  documentation,
  registryUrl,
}: {
  name: ComponentName;
  description: string;
  documentation: ComponentDocumentation;
  registryUrl: string;
}) {
  const title = componentTitle(name);
  return (
    <article data-doc-component={name} className="min-w-0 space-y-12">
      <header className="space-y-4">
        <p className="text-xs font-medium text-muted-foreground">Component documentation</p>
        <h1 className="text-4xl font-semibold tracking-tight">{title}</h1>
        <p className="max-w-2xl text-base leading-relaxed text-muted-foreground">{description}</p>
        <nav
          aria-label="On this page"
          className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground"
        >
          <a href="#doc-preview" className="underline underline-offset-4">
            Preview
          </a>
          <a href="#doc-install" className="underline underline-offset-4">
            Installation
          </a>
          <a href="#doc-usage" className="underline underline-offset-4">
            Usage
          </a>
          <a href="#doc-api" className="underline underline-offset-4">
            API
          </a>
          <a href="#doc-source" className="underline underline-offset-4">
            Source
          </a>
        </nav>
      </header>

      <section
        id="doc-preview"
        aria-labelledby="doc-preview-heading"
        className="scroll-mt-6 space-y-4"
      >
        <h2 id="doc-preview-heading" className="text-xl font-semibold tracking-tight">
          Preview
        </h2>
        <div
          data-doc-preview={name}
          className="overview-live min-h-64 rounded-lg border bg-card p-6"
        >
          <ComponentPreview name={name} interactive />
        </div>
        <p className="text-sm text-muted-foreground">
          The same example as the component overview, with interaction enabled.
        </p>
      </section>

      <section
        id="doc-install"
        aria-labelledby="doc-install-heading"
        className="scroll-mt-6 space-y-4"
      >
        <h2 id="doc-install-heading" className="text-xl font-semibold tracking-tight">
          Installation
        </h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Run this in an initialized shadcn/ui project. The CLI copies the component source and
          resolves its shared theme and dependencies.
        </p>
        <CodeBlock code={documentation.installCommand} label="Install command" language="bash" />
        {documentation.packages.length > 0 ? (
          <p className="text-xs leading-relaxed text-muted-foreground">
            Packages: {documentation.packages.join(", ")}
          </p>
        ) : null}
        {documentation.items.length > 0 ? (
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm">
            <span className="text-muted-foreground">Related registry items:</span>
            {documentation.items.map((dependency) => {
              const item = overviewItems.find((entry) => entry.name === dependency);
              return item ? (
                <Link
                  key={dependency}
                  href={`/docs/${item.name}`}
                  className="underline underline-offset-4"
                >
                  {componentTitle(item.name)}
                </Link>
              ) : (
                <a
                  key={dependency}
                  href={`${registryUrl}/${dependency}.json`}
                  className="underline underline-offset-4"
                >
                  {dependency}
                </a>
              );
            })}
          </div>
        ) : null}
      </section>

      <section id="doc-usage" aria-labelledby="doc-usage-heading" className="scroll-mt-6 space-y-4">
        <h2 id="doc-usage-heading" className="text-xl font-semibold tracking-tight">
          Usage
        </h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          This standalone example is generated from the live preview. It uses the standard{" "}
          <code className="text-foreground">@/components/ui</code> alias; adjust imports if your
          project uses another path.
        </p>
        <CodeBlock code={documentation.example} label={`${title} example`} />
      </section>

      <section id="doc-api" aria-labelledby="doc-api-heading" className="scroll-mt-6 space-y-4">
        <h2 id="doc-api-heading" className="text-xl font-semibold tracking-tight">
          API
        </h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Exported components and wrapper props, read from the installed source. Native HTML and
          upstream component props are inherited; referenced types and variants are defined in the
          source below.
        </p>
        <div className="divide-y rounded-lg border">
          {documentation.api.map((entry) => (
            <div key={entry.name} className="min-w-0 space-y-3 p-4">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="font-mono text-sm font-medium">{entry.name}</h3>
                <span className="text-xs text-muted-foreground">{entry.kind}</span>
              </div>
              {entry.props ? (
                <HighlightedCode code={entry.props} language="typescript" compact />
              ) : null}
              {entry.defaults.length > 0 ? (
                <dl className="grid gap-2 text-xs sm:grid-cols-2">
                  {entry.defaults.map((value) => (
                    <div key={value.name} className="flex flex-wrap gap-2">
                      <dt className="font-mono text-muted-foreground">{value.name}</dt>
                      <dd className="font-mono">{value.value}</dd>
                    </div>
                  ))}
                </dl>
              ) : null}
            </div>
          ))}
        </div>
      </section>

      <section
        id="doc-source"
        aria-labelledby="doc-source-heading"
        className="scroll-mt-6 space-y-4"
      >
        <h2 id="doc-source-heading" className="text-xl font-semibold tracking-tight">
          Source
        </h2>
        <p className="text-sm text-muted-foreground">
          The registry source before the CLI rewrites import aliases for your project.
        </p>
        {documentation.files.map((file) => (
          <CodeBlock
            key={file.path}
            code={file.content}
            label={file.path}
            language={sourceLanguage(file.path)}
          />
        ))}
        <a
          href={`${registryUrl}/${name}.json`}
          className="inline-block text-sm underline underline-offset-4"
        >
          Registry JSON
        </a>
      </section>
    </article>
  );
}
