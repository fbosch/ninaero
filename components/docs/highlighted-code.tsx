import { cn } from "cn";
import type { CSSProperties } from "react";

import { highlightCodeLines } from "@/lib/syntax-highlighting.mjs";
import { CodeBlockContent, CodeBlockLine } from "@/registry/ninaero/ui/code-block";

export async function HighlightedCodeContent({
  code,
  language,
  className,
}: {
  code: string;
  language: string;
  className?: string;
}) {
  const lines = await highlightCodeLines(code, language);

  return (
    <CodeBlockContent aria-label={`${language} code`} className={cn("[tab-size:2]", className)}>
      {lines.map((tokens, index) => (
        <CodeBlockLine key={index}>
          {tokens.map((token) => (
            <span
              key={token.offset}
              style={token.style as CSSProperties | undefined}
              className="ninaero-syntax-token"
            >
              {token.content}
            </span>
          ))}
        </CodeBlockLine>
      ))}
    </CodeBlockContent>
  );
}
