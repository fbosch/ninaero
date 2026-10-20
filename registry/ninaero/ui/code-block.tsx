"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";
import * as React from "react";

import { CheckIcon, CopyIcon, TriangleAlertIcon } from "@/lib/icons";
import { Button } from "@/registry/ninaero/ui/button";

const codeBlockVariants = cva(
  "ninaero-code-block group/code-block relative flex w-full min-w-0 flex-col overflow-hidden rounded-xl text-sm has-[>[data-slot=code-block-content]:focus-visible]:outline-2 has-[>[data-slot=code-block-content]:focus-visible]:outline-offset-2 has-[>[data-slot=code-block-content]:focus-visible]:outline-ring data-[size=sm]:text-xs",
  {
    variants: {
      variant: {
        default: "border border-border/70 bg-card text-foreground",
        destructive: "border border-destructive/50 bg-card text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function CodeBlock({
  className,
  variant = "default",
  size = "default",
  ...props
}: React.ComponentProps<"div"> &
  VariantProps<typeof codeBlockVariants> & { size?: "default" | "sm" }) {
  return (
    <div
      data-slot="code-block"
      data-variant={variant}
      data-size={size}
      className={cn(codeBlockVariants({ variant }), className)}
      {...props}
    />
  );
}

function CodeBlockHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="code-block-header"
      className={cn(
        "flex min-w-0 shrink-0 items-center gap-2 border-b border-border/50 px-4 py-2.5 text-muted-foreground group-data-[size=sm]/code-block:px-3 group-data-[size=sm]/code-block:py-2 group-data-[variant=destructive]/code-block:text-destructive *:has-[>[data-slot=code-block-title]]:min-w-0",
        className,
      )}
      {...props}
    />
  );
}

function CodeBlockTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="code-block-title"
      className={cn(
        "min-w-0 truncate font-sans text-sm type-label text-foreground group-data-[size=sm]/code-block:text-xs group-data-[size=sm]/code-block:leading-4 group-data-[variant=destructive]/code-block:text-destructive [&_svg]:pointer-events-none [&_svg]:inline-block [&_svg]:align-middle [&_svg:not([class*='size-'])]:size-3.5 *:[svg]:me-1.5",
        className,
      )}
      {...props}
    />
  );
}

function CodeBlockActions({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="code-block-actions"
      className={cn(
        "-my-1 ms-auto -me-1.5 flex shrink-0 items-center gap-1 [[data-slot=code-block]>&]:absolute [[data-slot=code-block]>&]:end-2 [[data-slot=code-block]>&]:top-2 [[data-slot=code-block]>&]:z-10 [[data-slot=code-block]>&]:m-0 [[data-slot=code-block]>&]:opacity-0 [[data-slot=code-block]>&]:transition-opacity [[data-slot=code-block]>&]:motion-reduce:transition-none [[data-slot=code-block]>&]:group-focus-within/code-block:opacity-100 [[data-slot=code-block]>&]:group-hover/code-block:opacity-100 group-data-[size=sm]/code-block:[[data-slot=code-block]>&]:end-1.5 group-data-[size=sm]/code-block:[[data-slot=code-block]>&]:top-1.5 [[data-slot=code-block]>&]:pointer-coarse:opacity-100 [[data-slot=code-block]>&]:*:[button]:bg-background [[data-slot=code-block]>&]:*:[button]:ring-1 [[data-slot=code-block]>&]:*:[button]:ring-foreground/10",
        className,
      )}
      {...props}
    />
  );
}

function CodeBlockCopyButton({
  value,
  variant = "ghost",
  size = "icon-xs",
  className,
  onClick,
  ...props
}: React.ComponentProps<typeof Button> & { value: string }) {
  const [copyState, setCopyState] = React.useState<"idle" | "copied" | "error">("idle");

  React.useEffect(() => {
    if (copyState === "idle") {
      return;
    }

    const timeout = setTimeout(() => setCopyState("idle"), 2000);
    return () => clearTimeout(timeout);
  }, [copyState]);

  async function copyToClipboard() {
    setCopyState("idle");

    try {
      await navigator.clipboard.writeText(value);
      setCopyState("copied");
    } catch {
      setCopyState("error");
    }
  }

  return (
    <>
      <Button
        data-slot="code-block-copy-button"
        data-copy-state={copyState}
        variant={variant}
        size={size}
        aria-label={
          copyState === "copied" ? "Copied" : copyState === "error" ? "Try copying again" : "Copy"
        }
        className={cn(className)}
        onClick={(event) => {
          onClick?.(event);
          if (!event.defaultPrevented) void copyToClipboard();
        }}
        {...props}
      >
        {copyState === "copied" ? (
          <CheckIcon />
        ) : copyState === "error" ? (
          <TriangleAlertIcon />
        ) : (
          <CopyIcon />
        )}
      </Button>
      <span aria-live="polite" className="sr-only">
        {copyState === "copied"
          ? "Copied to clipboard."
          : copyState === "error"
            ? "Unable to copy."
            : ""}
      </span>
    </>
  );
}

function CodeBlockContent({
  className,
  children,
  style,
  wrap = false,
  lineNumbers = false,
  startLine = 1,
  ...props
}: React.ComponentProps<"pre"> & {
  wrap?: boolean;
  lineNumbers?: boolean;
  startLine?: number;
}) {
  return (
    <pre
      data-slot="code-block-content"
      data-wrap={wrap || undefined}
      data-numbered={lineNumbers || undefined}
      dir="ltr"
      tabIndex={0}
      style={{ counterReset: `line ${startLine - 1}`, ...style }}
      className={cn(
        "ninaero-code-block-content min-h-0 min-w-0 scroll-fade-x scrollbar-thin overflow-auto px-4 py-3 text-start font-mono leading-relaxed outline-none group-has-data-[slot=code-block-footer]/code-block:pb-2 group-has-data-[slot=code-block-header]/code-block:pt-3 group-data-[size=sm]/code-block:px-3 group-data-[size=sm]/code-block:py-2.5 group-data-[size=sm]/code-block:group-has-data-[slot=code-block-header]/code-block:pt-2.5 data-wrap:scroll-fade-y data-wrap:wrap-break-word data-wrap:whitespace-pre-wrap",
        className,
      )}
      {...props}
    >
      <code
        data-slot="code-block-code"
        className="grid min-h-lh min-w-max content-start gap-x-3 group-data-[size=sm]/code-block:gap-x-2 in-data-wrap:min-w-0"
      >
        {typeof children === "string"
          ? children
              .replace(/\n$/, "")
              .split("\n")
              .map((line, index) => <CodeBlockLine key={index}>{line}</CodeBlockLine>)
          : children}
      </code>
    </pre>
  );
}

const codeBlockLineVariants = cva(
  "relative -mx-4 col-span-full grid min-h-lh grid-cols-subgrid border-b border-(--ninaero-code-rule) px-4 last:border-b-0 group-data-[size=sm]/code-block:-mx-3 group-data-[size=sm]/code-block:px-3 before:min-w-[3ch] before:self-start before:text-end before:text-muted-foreground in-data-numbered:[counter-increment:line] in-data-numbered:before:content-[counter(line)] in-data-numbered:before:select-none in-data-numbered:supports-[content:counter(line)_/_'']:before:content-[counter(line)_/_'']",
  {
    variants: {
      variant: {
        default: "",
        added: "bg-muted/70",
        removed: "bg-destructive/10",
        highlighted:
          "bg-primary/10 before:text-foreground/70 after:pointer-events-none after:absolute after:inset-y-0 after:start-0 after:border-s-2 after:border-primary",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function CodeBlockLine({
  className,
  variant = "default",
  children,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof codeBlockLineVariants>) {
  return (
    <span
      data-slot="code-block-line"
      data-variant={variant}
      className={cn(codeBlockLineVariants({ variant }), className)}
      {...props}
    >
      <span
        data-slot="code-block-line-marker"
        className={cn(
          "select-none self-start text-center",
          variant === "removed" ? "text-destructive" : "text-foreground",
        )}
      >
        {variant === "added" ? "+" : null}
        {variant === "removed" ? "−" : null}
      </span>
      <span data-slot="code-block-line-content" className="min-h-lh min-w-0">
        {children}
      </span>
    </span>
  );
}

function CodeBlockFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="code-block-footer"
      className={cn(
        "flex min-w-0 shrink-0 items-center gap-2 border-t border-border/50 px-4 py-2.5 text-xs type-caption text-muted-foreground group-data-[size=sm]/code-block:px-3 group-data-[size=sm]/code-block:py-2",
        className,
      )}
      {...props}
    />
  );
}

export {
  CodeBlock,
  CodeBlockHeader,
  CodeBlockTitle,
  CodeBlockActions,
  CodeBlockCopyButton,
  CodeBlockContent,
  CodeBlockLine,
  CodeBlockFooter,
};
