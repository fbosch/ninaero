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

export default function CodeBlockPreview() {
  const highlighted = useHighlightedCode(source, "tsx");

  return (
    <div className="flex w-full min-w-0 flex-col gap-6">
      <section className="min-w-0 space-y-2">
        <h3 className="text-sm type-title tracking-normal">Syntax highlighting and line numbers</h3>
        <CodeBlock>
          <CodeBlockHeader>
            <CodeBlockTitle>save-button.tsx</CodeBlockTitle>
            <CodeBlockActions>
              <CodeBlockCopyButton value={source} />
            </CodeBlockActions>
          </CodeBlockHeader>
          <CodeBlockContent lineNumbers>
            {highlighted.map((line, index) => (
              <CodeBlockLine key={index}>{line}</CodeBlockLine>
            ))}
          </CodeBlockContent>
          <CodeBlockFooter className="text-xs">
            Highlighting is optional. Plain text remains readable while the language loads.
          </CodeBlockFooter>
        </CodeBlock>
      </section>
      <section className="min-w-0 space-y-2">
        <h3 className="text-sm type-title tracking-normal">Diff</h3>
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
      <section className="min-w-0 space-y-2">
        <h3 className="text-sm type-title tracking-normal">Wrapped output and error state</h3>
        <CodeBlock variant="destructive" size="sm">
          <CodeBlockHeader>
            <CodeBlockTitle>Request failed</CodeBlockTitle>
          </CodeBlockHeader>
          <CodeBlockContent wrap>
            {
              "The request could not be completed because the service is temporarily unavailable. Check the service status before trying again."
            }
          </CodeBlockContent>
          <CodeBlockFooter className="text-xs">HTTP 503</CodeBlockFooter>
        </CodeBlock>
      </section>
    </div>
  );
}
