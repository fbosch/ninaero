import Link from "next/link";

import { ComponentPreview } from "@/components/overview/component-preview";
import { docsRegistryUrl } from "@/lib/component-documentation";
import {
  componentTitle,
  extraItems,
  upstreamItems,
  isComponentName,
  type ComponentName,
} from "@/lib/component-overview";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/registry/ninaero/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/registry/ninaero/ui/tabs";

import { CodeBlock } from "./code-block";

type ApiExport = {
  name: string;
  kind: string;
  props: string;
  defaults: { name: string; value: string }[];
};

type ComponentDocumentation = {
  name: string;
  kind: string;
  upstreamUrl: string;
  description?: string;
  installCommand: string;
  example: string;
  files: { path: string; content: string }[];
  api: ApiExport[];
  packages: string[];
  items: string[];
};

function ApiReference({ api }: { api: ApiExport[] }) {
  return (
    <div className="flex flex-col gap-6">
      {api.map((entry) => (
        <section key={entry.name} className="flex min-w-0 flex-col gap-3">
          <h3 className="font-mono text-base font-medium">{entry.name}</h3>
          {entry.props ? (
            <CodeBlock code={entry.props} label={`${entry.name} props`} language="typescript" />
          ) : (
            <p className="text-sm text-muted-foreground">
              {entry.kind === "type"
                ? "Exported type."
                : entry.kind === "value"
                  ? "Exported value."
                  : "Re-exported primitive; see the upstream API reference."}
            </p>
          )}
          {entry.defaults.length > 0 ? (
            <dl className="grid grid-cols-[max-content_minmax(0,1fr)] gap-x-6 gap-y-2 text-sm">
              {entry.defaults.map((prop) => (
                <div key={prop.name} className="contents">
                  <dt className="font-mono text-muted-foreground">{prop.name}</dt>
                  <dd className="min-w-0 break-words font-mono">{prop.value}</dd>
                </div>
              ))}
            </dl>
          ) : null}
        </section>
      ))}
    </div>
  );
}

export function ComponentContent({
  name,
  description,
  documentation,
}: {
  name: ComponentName;
  description: string;
  documentation: ComponentDocumentation;
}) {
  const isGuide = documentation.kind === "guide";
  const navigation = [...upstreamItems, ...extraItems];
  const position = navigation.findIndex((item) => item.name === name);
  const previous = navigation[position - 1];
  const next = navigation[position + 1];
  const sections = [
    { id: "examples", label: "Examples" },
    { id: "installation", label: "Installation" },
    { id: "usage", label: "Usage" },
    ...(isGuide
      ? [{ id: "composition", label: "Composition" }]
      : [
          { id: "api-reference", label: "API Reference" },
          { id: "source", label: "Source" },
        ]),
  ];

  return (
    <div className="grid min-w-0 gap-10 xl:grid-cols-[minmax(0,1fr)_9rem]">
      <article className="flex min-w-0 flex-col gap-10">
        <header className="flex min-w-0 flex-col gap-4">
          <h1 className="text-4xl type-display">{componentTitle(name)}</h1>
          <p className="max-w-2xl type-prose text-muted-foreground">{description}</p>
          <a
            href={documentation.upstreamUrl}
            className="w-fit text-sm underline underline-offset-4"
          >
            Upstream documentation
          </a>
        </header>

        <section id="examples" aria-labelledby="examples-heading" className="min-w-0 scroll-mt-6">
          <h2 id="examples-heading" className="mb-4 text-xl type-heading">
            Examples
          </h2>
          <Tabs defaultValue="preview" className="min-w-0">
            <TabsList aria-label="Example view">
              <TabsTrigger value="preview">Preview</TabsTrigger>
              <TabsTrigger value="code">Code</TabsTrigger>
            </TabsList>
            <TabsContent value="preview">
              <div
                className="min-w-0 overflow-x-auto rounded-xl border bg-card p-5 sm:p-8"
                data-component-preview={name}
              >
                <ComponentPreview name={name} interactive />
              </div>
            </TabsContent>
            <TabsContent value="code">
              <CodeBlock code={documentation.example} label={`${componentTitle(name)} example`} />
            </TabsContent>
          </Tabs>
        </section>

        <section
          id="installation"
          aria-labelledby="installation-heading"
          className="flex min-w-0 scroll-mt-6 flex-col gap-4"
        >
          <h2 id="installation-heading" className="text-xl type-heading">
            Installation
          </h2>
          <p className="text-sm type-prose text-muted-foreground">
            {isGuide
              ? documentation.description
              : "Run the Ninaero registry command to install the component and its dependencies, including shared theme styles."}
          </p>
          <CodeBlock
            code={documentation.installCommand}
            label={isGuide ? "Install recipe dependencies" : `Install ${componentTitle(name)}`}
            language="bash"
          />
        </section>

        <section
          id="usage"
          aria-labelledby="usage-heading"
          className="flex min-w-0 scroll-mt-6 flex-col gap-4"
        >
          <h2 id="usage-heading" className="text-xl type-heading">
            Usage
          </h2>
          <p className="text-sm text-muted-foreground">
            A complete example using the installed component and hook paths.
          </p>
          <CodeBlock code={documentation.example} label={`${componentTitle(name)} usage`} />
        </section>

        {isGuide ? (
          <section
            id="composition"
            aria-labelledby="composition-heading"
            className="flex scroll-mt-6 flex-col gap-4"
          >
            <h2 id="composition-heading" className="text-xl type-heading">
              Composition
            </h2>
            <p className="text-sm type-prose text-muted-foreground">{documentation.description}</p>
            <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
              {documentation.items.map((item) => (
                <li key={item}>
                  <Link
                    href={item === "theme" ? "/docs/theme" : `/docs/${item}`}
                    className="underline underline-offset-4"
                  >
                    {item === "theme"
                      ? "Theme"
                      : isComponentName(item)
                        ? componentTitle(item)
                        : item}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : (
          <>
            <section
              id="api-reference"
              aria-labelledby="api-reference-heading"
              className="flex min-w-0 scroll-mt-6 flex-col gap-5"
            >
              <h2 id="api-reference-heading" className="text-xl type-heading">
                API Reference
              </h2>
              <p className="text-sm type-prose text-muted-foreground">
                Ninaero exports and local defaults are listed below. See the{" "}
                <a
                  href={`${documentation.upstreamUrl}#api-reference`}
                  className="underline underline-offset-4"
                >
                  upstream reference
                </a>{" "}
                for inherited primitive props and additional composition examples.
              </p>
              <ApiReference api={documentation.api} />
            </section>
            <section
              id="source"
              aria-labelledby="source-heading"
              className="flex min-w-0 scroll-mt-6 flex-col gap-4"
            >
              <h2 id="source-heading" className="text-xl type-heading">
                Source
              </h2>
              <Accordion>
                {documentation.files.map((file) => (
                  <AccordionItem key={file.path} value={file.path}>
                    <AccordionTrigger>{file.path.split("/").at(-1)}</AccordionTrigger>
                    <AccordionContent>
                      <CodeBlock code={file.content} label={file.path} />
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
              <a
                href={`${docsRegistryUrl}/${name}.json`}
                className="w-fit text-sm underline underline-offset-4"
              >
                Registry JSON
              </a>
            </section>
          </>
        )}

        <nav aria-label="Component pages" className="grid grid-cols-2 gap-4 border-t pt-6">
          {previous ? (
            <Link
              href={`/docs/${previous.name}`}
              className="flex flex-col gap-1 text-sm underline-offset-4 hover:underline"
            >
              <span className="text-xs text-muted-foreground">Previous</span>
              {componentTitle(previous.name)}
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link
              href={`/docs/${next.name}`}
              className="flex flex-col items-end gap-1 text-right text-sm underline-offset-4 hover:underline"
            >
              <span className="text-xs text-muted-foreground">Next</span>
              {componentTitle(next.name)}
            </Link>
          ) : null}
        </nav>
      </article>

      <aside className="hidden xl:block">
        <nav
          aria-label="On this page"
          className="sticky top-6 flex flex-col gap-3 text-sm text-muted-foreground"
        >
          <p className="font-medium text-foreground">On this page</p>
          {sections.map((section) => (
            <a key={section.id} href={`#${section.id}`} className="hover:text-foreground">
              {section.label}
            </a>
          ))}
        </nav>
      </aside>
    </div>
  );
}
