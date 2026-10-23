"use client";

import { cn } from "cn";
import type { ReactNode } from "react";

import { defaultAccent } from "@/registry/ninaero/hooks/accent-config.mjs";
import { useHighlightedCode } from "@/registry/ninaero/hooks/use-highlighted-code";
import { CodeBlockContent, CodeBlockLine } from "@/registry/ninaero/ui/code-block";

export function HighlightedCodeBody({
  code,
  language,
  className,
  initialLines,
}: {
  code: string;
  language: string;
  className?: string;
  initialLines: ReactNode[];
}) {
  const lines = useHighlightedCode(code, language, {
    value: code,
    language,
    accent: defaultAccent,
    lines: initialLines,
  });
  return (
    <CodeBlockContent aria-label={`${language} code`} className={cn("[tab-size:2]", className)}>
      {lines.map((line, index) => (
        <CodeBlockLine key={index}>{line}</CodeBlockLine>
      ))}
    </CodeBlockContent>
  );
}
