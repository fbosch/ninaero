"use client";

import { useHighlightedCode } from "@/registry/ninaero/hooks/use-highlighted-code";
import {
  CodeBlock,
  CodeBlockActions,
  CodeBlockContent,
  CodeBlockCopyButton,
  CodeBlockFooter,
  CodeBlockHeader,
  CodeBlockLine,
  CodeBlockTitle,
} from "@/registry/ninaero/ui/code-block";

const source =
  'import { Button } from "@/components/ui/button"\n\nexport function SaveButton() {\n  return <Button>Save changes</Button>\n}';
const longOutput =
  "pnpm dlx shadcn@latest add https://example.com/r/code-block.json --overwrite --yes";

export function CodeBlockSpecimens() {
  const highlighted = useHighlightedCode(source, "tsx");

  return (
    <div className="flex min-w-0 flex-col gap-8">
      <section aria-labelledby="code-block-highlighted" className="flex min-w-0 flex-col gap-3">
        <h2 id="code-block-highlighted" className="text-xl type-heading">
          Highlighted code
        </h2>
        <CodeBlock>
          <CodeBlockHeader>
            <CodeBlockTitle>save-button.tsx</CodeBlockTitle>
            <CodeBlockActions>
              <CodeBlockCopyButton value={source} />
            </CodeBlockActions>
          </CodeBlockHeader>
          <CodeBlockContent lineNumbers>
            {highlighted.map((line, index) => (
              <CodeBlockLine key={index} variant={index === 3 ? "highlighted" : "default"}>
                {line}
              </CodeBlockLine>
            ))}
          </CodeBlockContent>
          <CodeBlockFooter className="text-xs">TSX · 5 lines</CodeBlockFooter>
        </CodeBlock>
      </section>
      <section aria-labelledby="code-block-diff" className="flex min-w-0 flex-col gap-3">
        <h2 id="code-block-diff" className="text-xl type-heading">
          Diff and line numbers
        </h2>
        <CodeBlock size="sm">
          <CodeBlockContent lineNumbers startLine={12}>
            <CodeBlockLine>export const theme = {"{"}</CodeBlockLine>
            <CodeBlockLine variant="removed"> accent: "blue",</CodeBlockLine>
            <CodeBlockLine variant="added"> accent: "ocean",</CodeBlockLine>
            <CodeBlockLine variant="highlighted"> appearance: "ninaero",</CodeBlockLine>
            <CodeBlockLine>{"}"}</CodeBlockLine>
          </CodeBlockContent>
        </CodeBlock>
      </section>
      <section aria-labelledby="code-block-overflow" className="flex min-w-0 flex-col gap-3">
        <h2 id="code-block-overflow" className="text-xl type-heading">
          Long output
        </h2>
        <div className="grid min-w-0 gap-4 md:grid-cols-2">
          <CodeBlock size="sm">
            <CodeBlockHeader>
              <CodeBlockTitle>Scroll</CodeBlockTitle>
            </CodeBlockHeader>
            <CodeBlockContent>{longOutput}</CodeBlockContent>
          </CodeBlock>
          <CodeBlock size="sm">
            <CodeBlockHeader>
              <CodeBlockTitle>Wrap</CodeBlockTitle>
            </CodeBlockHeader>
            <CodeBlockContent wrap>{longOutput}</CodeBlockContent>
          </CodeBlock>
        </div>
      </section>
      <section aria-labelledby="code-block-error" className="flex min-w-0 flex-col gap-3">
        <h2 id="code-block-error" className="text-xl type-heading">
          Error output
        </h2>
        <CodeBlock variant="destructive" size="sm">
          <CodeBlockHeader>
            <CodeBlockTitle>Request failed</CodeBlockTitle>
          </CodeBlockHeader>
          <CodeBlockContent wrap>
            The request could not be completed because the service is temporarily unavailable.
          </CodeBlockContent>
          <CodeBlockFooter className="text-xs">HTTP 503</CodeBlockFooter>
        </CodeBlock>
      </section>
    </div>
  );
}
