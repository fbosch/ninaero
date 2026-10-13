import type { CSSProperties } from "react";

import { type HighlightToken, highlightCode } from "@/lib/syntax-highlighting.mjs";

type TokenStyle = CSSProperties & {
  "--syntax-light"?: string;
  "--syntax-dark"?: string;
};

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
        <code>
          {tokens.map((token: HighlightToken) => {
            const style: TokenStyle = {
              "--syntax-light": token.light,
              "--syntax-dark": token.dark,
            };
            return (
              <span key={token.offset} style={style}>
                {token.content}
              </span>
            );
          })}
        </code>
      </pre>
    </section>
  );
}
