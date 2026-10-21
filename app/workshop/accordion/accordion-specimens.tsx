"use client";

import Link from "next/link";
import { useState } from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/registry/ninaero/ui/accordion";
import { Button } from "@/registry/ninaero/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/registry/ninaero/ui/card";
import { DirectionProvider } from "@/registry/ninaero/ui/direction";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/registry/ninaero/ui/field";
import { Input } from "@/registry/ninaero/ui/input";
import { Switch } from "@/registry/ninaero/ui/switch";

function NotebookSections({ disabled = false }: { disabled?: boolean }) {
  return (
    <Accordion defaultValue={["pages"]} disabled={disabled}>
      <AccordionItem value="pages">
        <AccordionTrigger>Pages and paper</AccordionTrigger>
        <AccordionContent>
          Choose ruled, dotted, or plain paper for each page. The notebook keeps your pages
          together.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="sharing">
        <AccordionTrigger>Sharing and export</AccordionTrigger>
        <AccordionContent>
          <p>Export a copy when you want to share your notes.</p>
          <p>
            Read the <Link href="/docs/card">Card guide</Link> for another way to group related
            content.
          </p>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="archive" disabled>
        <AccordionTrigger>Archived pages, unavailable</AccordionTrigger>
        <AccordionContent>This section is unavailable.</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

export function AccordionSpecimens() {
  const [open, setOpen] = useState<string[]>(["appearance"]);
  const [details, setDetails] = useState(false);

  return (
    <div className="flex max-w-3xl flex-col gap-8">
      <section aria-labelledby="accordion-single" className="flex flex-col gap-3">
        <h2 id="accordion-single" className="text-xl type-heading">
          One open section
        </h2>
        <p className="text-sm text-muted-foreground">
          Open another section to close the first. Activate it again to collapse it. Tab moves
          between triggers; Enter or Space toggles the focused section.
        </p>
        <NotebookSections />
      </section>

      <section aria-labelledby="accordion-multiple" className="flex flex-col gap-3">
        <h2 id="accordion-multiple" className="text-xl type-heading">
          Independent sections
        </h2>
        <Card>
          <CardHeader>
            <CardTitle>Notebook settings</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion multiple defaultValue={["name", "reminders"]}>
              <AccordionItem value="name">
                <AccordionTrigger>Notebook name</AccordionTrigger>
                <AccordionContent>
                  <Field>
                    <FieldLabel htmlFor="accordion-name">Name</FieldLabel>
                    <Input id="accordion-name" defaultValue="Field notes" />
                    <FieldDescription>Used only in this preview.</FieldDescription>
                  </Field>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="reminders">
                <AccordionTrigger>Reminders</AccordionTrigger>
                <AccordionContent>
                  <FieldGroup>
                    <Field orientation="horizontal">
                      <FieldLabel htmlFor="accordion-reminder">Daily reminder</FieldLabel>
                      <Switch id="accordion-reminder" defaultChecked />
                    </Field>
                    <Button variant="outline" onClick={() => setDetails((value) => !value)}>
                      {details ? "Hide reminder details" : "Show reminder details"}
                    </Button>
                    {details && (
                      <p>
                        This preview does not schedule notifications. Adding this text checks that
                        an open panel can grow.
                      </p>
                    )}
                  </FieldGroup>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      </section>

      <section aria-labelledby="accordion-controlled" className="flex flex-col gap-3">
        <h2 id="accordion-controlled" className="text-xl type-heading">
          Controlled expansion
        </h2>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => setOpen(["appearance"])}>
            Open appearance
          </Button>
          <Button variant="outline" onClick={() => setOpen([])}>
            Collapse section
          </Button>
        </div>
        <Accordion value={open} onValueChange={setOpen}>
          <AccordionItem value="appearance">
            <AccordionTrigger>Appearance</AccordionTrigger>
            <AccordionContent>
              Use the header controls to compare color modes and accent presets. The disclosure rows
              remain neutral; keyboard focus follows the accent.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      <section aria-labelledby="accordion-wrapping" className="flex flex-col gap-3">
        <h2 id="accordion-wrapping" className="text-xl type-heading">
          Long labels and narrow layouts
        </h2>
        <div className="w-full max-w-xs">
          <Accordion>
            <AccordionItem value="long">
              <AccordionTrigger>
                What happens to my notebook pages when I change the paper format or export a copy?
              </AccordionTrigger>
              <AccordionContent>
                The label wraps without pushing the chevron outside the row. Open and close this
                section while resizing the window.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      <section aria-labelledby="accordion-disabled" className="flex flex-col gap-3">
        <h2 id="accordion-disabled" className="text-xl type-heading">
          Disabled group
        </h2>
        <NotebookSections disabled />
      </section>

      <section aria-labelledby="accordion-rtl" className="flex flex-col gap-3">
        <h2 id="accordion-rtl" className="text-xl type-heading">
          Right to left
        </h2>
        <DirectionProvider direction="rtl">
          <div dir="rtl" lang="ar">
            <Accordion defaultValue={["notes"]}>
              <AccordionItem value="notes">
                <AccordionTrigger>الصفحات والملاحظات</AccordionTrigger>
                <AccordionContent>اختر ورقًا مسطرًا أو منقطًا أو عاديًا لكل صفحة.</AccordionContent>
              </AccordionItem>
              <AccordionItem value="export">
                <AccordionTrigger>المشاركة والتصدير</AccordionTrigger>
                <AccordionContent>صدّر نسخة لمشاركة ملاحظاتك.</AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </DirectionProvider>
      </section>
    </div>
  );
}
