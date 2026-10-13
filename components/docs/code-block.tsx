import { CodeBlockHeader } from "./code-block-header";
import { HighlightedCode } from "./highlighted-code";

export function CodeBlock({
  code,
  label = "Code",
  language = "tsx",
}: {
  code: string;
  label?: string;
  language?: string;
}) {
  return (
    <div className="min-w-0 overflow-hidden rounded-lg border bg-card">
      <CodeBlockHeader code={code} label={label} />
      <HighlightedCode code={code} language={language} />
    </div>
  );
}
