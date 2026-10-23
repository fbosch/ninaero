import type { CSSProperties } from "react";

import { highlightCodeLines } from "@/lib/syntax-highlighting.mjs";

import { HighlightedCodeBody } from "./highlighted-code-content";

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
  const initialLines = lines.map((tokens) =>
    tokens.map((token) => (
      <span
        key={token.offset}
        style={token.style as CSSProperties | undefined}
        className="ninaero-syntax-token"
      >
        {token.content}
      </span>
    )),
  );
  return (
    <HighlightedCodeBody
      code={code}
      language={language}
      className={className}
      initialLines={initialLines}
    />
  );
}
