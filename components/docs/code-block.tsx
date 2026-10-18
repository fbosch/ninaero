import { CodeBlock as CodeBlockRoot } from "@/registry/ninaero/ui/code-block";

import { CodeBlockHeader } from "./code-block-header";
import { HighlightedCodeContent } from "./highlighted-code";

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
    <CodeBlockRoot>
      <CodeBlockHeader code={code} label={label} />
      <HighlightedCodeContent code={code} language={language} className="max-h-[32rem]" />
    </CodeBlockRoot>
  );
}
