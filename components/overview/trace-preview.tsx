"use client";

import { useState } from "react";

import { CheckIcon, FileTextIcon, SearchIcon, TriangleAlertIcon } from "@/lib/icons";
import { Button } from "@/registry/ninaero/ui/button";
import {
  Trace,
  TraceCollapsible,
  TraceCollapsibleContent,
  TraceCollapsibleTrigger,
  TraceDescription,
  TraceIcon,
  TraceLine,
  TraceTitle,
} from "@/registry/ninaero/ui/trace";

export default function TracePreview() {
  const [complete, setComplete] = useState(false);

  return (
    <div className="flex w-full min-w-0 flex-col gap-6">
      <section className="min-w-0 space-y-3">
        <h3 className="text-sm type-title tracking-normal">Tool calls and sources</h3>
        <Trace>
          <TraceCollapsible defaultOpen>
            <TraceCollapsibleTrigger>
              <TraceLine>
                <TraceIcon>
                  <SearchIcon />
                </TraceIcon>
                <TraceTitle>Search component documentation</TraceTitle>
                <TraceDescription>3 results</TraceDescription>
              </TraceLine>
            </TraceCollapsibleTrigger>
            <TraceCollapsibleContent>
              <p className="text-sm">Found installation, composition, and API references.</p>
              <Trace className="mt-3">
                <a href="https://ui.shadcn.com/docs/components/base/trace">
                  <TraceLine>
                    <TraceIcon>
                      <FileTextIcon />
                    </TraceIcon>
                    <TraceTitle>Trace documentation</TraceTitle>
                    <TraceDescription>shadcn/ui</TraceDescription>
                  </TraceLine>
                </a>
              </Trace>
            </TraceCollapsibleContent>
          </TraceCollapsible>
          <TraceLine status={complete ? undefined : "running"} aria-live="polite">
            <TraceIcon>{complete ? <CheckIcon /> : <SearchIcon />}</TraceIcon>
            <TraceTitle>{complete ? "Summary complete" : "Preparing a summary"}</TraceTitle>
          </TraceLine>
        </Trace>
        <Button variant="outline" size="sm" onClick={() => setComplete((value) => !value)}>
          {complete ? "Run again" : "Finish step"}
        </Button>
      </section>
      <section className="min-w-0 space-y-3">
        <h3 className="text-sm type-title tracking-normal">Pending and error states</h3>
        <Trace>
          <TraceLine status="pending">
            <TraceIcon>
              <SearchIcon />
            </TraceIcon>
            <TraceTitle>Waiting for the next task</TraceTitle>
          </TraceLine>
          <TraceCollapsible>
            <TraceCollapsibleTrigger>
              <TraceLine status="error">
                <TraceIcon>
                  <TriangleAlertIcon />
                </TraceIcon>
                <TraceTitle>Source unavailable</TraceTitle>
              </TraceLine>
            </TraceCollapsibleTrigger>
            <TraceCollapsibleContent>
              <p className="text-sm">
                The source did not respond. Retry the request or use another source.
              </p>
            </TraceCollapsibleContent>
          </TraceCollapsible>
        </Trace>
      </section>
    </div>
  );
}
