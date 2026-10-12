"use client";

import { CheckIcon, CopyIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/registry/ninaero/ui/button";

export function CodeBlock({
  code,
  label = "Code",
}: {
  code: string;
  label?: string;
}) {
  const [result, setResult] = useState<{
    code: string;
    state: "copying" | "copied" | "error";
  } | null>(null);
  const state = result?.code === code ? result.state : null;

  async function copyCode() {
    setResult({ code, state: "copying" });
    try {
      await navigator.clipboard.writeText(code);
      setResult({ code, state: "copied" });
    } catch {
      setResult({ code, state: "error" });
    }
  }

  return (
    <div className="min-w-0 overflow-hidden rounded-lg border bg-card">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b px-4 py-2">
        <span className="text-xs font-medium text-muted-foreground">
          {label}
        </span>
        <div className="flex items-center gap-3">
          <output aria-live="polite" className="text-xs text-muted-foreground">
            {state === "copying"
              ? "Copying…"
              : state === "copied"
                ? "Code copied"
                : state === "error"
                  ? "Unable to copy code."
                  : ""}
          </output>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={copyCode}
            disabled={state === "copying"}
            aria-label={`Copy ${label}`}
          >
            {state === "copied" ? (
              <CheckIcon aria-hidden="true" />
            ) : (
              <CopyIcon aria-hidden="true" />
            )}{" "}
            Copy
          </Button>
        </div>
      </div>
      <pre className="max-h-[32rem] overflow-auto p-4 text-xs leading-relaxed sm:text-sm">
        <code>{code}</code>
      </pre>
    </div>
  );
}
