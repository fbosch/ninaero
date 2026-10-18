import {
  CodeBlockActions,
  CodeBlockCopyButton,
  CodeBlockHeader as CodeBlockHeaderRoot,
  CodeBlockTitle,
} from "@/registry/ninaero/ui/code-block";

export function CodeBlockHeader({ code, label }: { code: string; label: string }) {
  return (
    <CodeBlockHeaderRoot>
      <CodeBlockTitle>{label}</CodeBlockTitle>
      <CodeBlockActions>
        <CodeBlockCopyButton key={code} value={code} size="icon-sm" aria-label={`Copy ${label}`} />
      </CodeBlockActions>
    </CodeBlockHeaderRoot>
  );
}
