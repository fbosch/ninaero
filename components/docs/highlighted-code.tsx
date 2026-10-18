import type { CSSProperties } from "react";

import { type HighlightToken, highlightCode } from "@/lib/syntax-highlighting.mjs";
import { CodeBlockContent, CodeBlockLine } from "@/registry/ninaero/ui/code-block";

function renderTokens(tokens: HighlightToken[]) {
  return tokens.map((token) => (
    <span
      key={token.offset}
      style={token.style as CSSProperties | undefined}
      className="ninaero-syntax-token"
    >
      {token.content}
    </span>
  ));
}

export async function HighlightedCode({
  code,
  language,
  compact = false,
}: {
  code: string;
  language: string;
  compact?: boolean;
}) {
  const tokens: HighlightToken[] = await highlightCode(code, language);

  return (
    <section
      // biome-ignore lint/a11y/noNoninteractiveTabindex: The code region must support keyboard scrolling.
      tabIndex={0}
      aria-label={`${language} code`}
      data-language={language}
      className={`syntax-code overflow-auto text-xs leading-relaxed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring ${compact ? "rounded-md p-3" : "max-h-[32rem] p-4 sm:text-sm"}`}
    >
      <pre>
        <code>{renderTokens(tokens)}</code>
      </pre>
    </section>
  );
}

export async function HighlightedCodeContent({
  code,
  language,
}: {
  code: string;
  language: string;
}) {
  const tokens: HighlightToken[] = await highlightCode(code, language);

  return (
    <CodeBlockContent aria-label={`${language} code`} className="[tab-size:2]">
      <CodeBlockLine>{renderTokens(tokens)}</CodeBlockLine>
    </CodeBlockContent>
  );
}
