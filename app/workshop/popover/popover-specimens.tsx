"use client";

import { useState } from "react";

import { Button } from "@/registry/ninaero/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/registry/ninaero/ui/dialog";
import { DirectionProvider } from "@/registry/ninaero/ui/direction";
import { Field, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "@/registry/ninaero/ui/field";
import { Input } from "@/registry/ninaero/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/registry/ninaero/ui/popover";

const sides = ["top", "bottom", "left", "right", "inline-start", "inline-end"] as const;
const alignments = ["start", "center", "end"] as const;

function Note({ title, description }: { title: string; description: string }) {
  return (
    <PopoverHeader>
      <PopoverTitle>{title}</PopoverTitle>
      <PopoverDescription>{description}</PopoverDescription>
    </PopoverHeader>
  );
}

export function PopoverSpecimens() {
  const [formOpen, setFormOpen] = useState(false);
  return (
    <div className="flex min-w-0 max-w-xl flex-col gap-8">
      <FieldSet className="button-specimen min-w-0 ninaero-surface-paper bg-(--paper-fill) p-6">
        <FieldLegend>Pointer and keyboard</FieldLegend>
        <div className="flex flex-wrap gap-3">
          <Popover>
            <PopoverTrigger
              id="popover-basic"
              render={
                <Button variant="outline" className="h-auto min-h-8 max-w-full whitespace-normal" />
              }
            >
              Open note
            </PopoverTrigger>
            <PopoverContent>
              <Note
                title="A floating note"
                description="Context stays beside its control without covering the whole page."
              />
            </PopoverContent>
          </Popover>
          <Popover>
            <PopoverTrigger
              id="popover-disabled"
              disabled
              render={
                <Button variant="outline" className="h-auto min-h-8 max-w-full whitespace-normal" />
              }
            >
              Disabled trigger
            </PopoverTrigger>
            <PopoverContent>
              <Note
                title="Unavailable"
                description="This disabled trigger cannot open its panel."
              />
            </PopoverContent>
          </Popover>
          <Button
            id="popover-outside"
            variant="secondary"
            className="h-auto min-h-8 max-w-full whitespace-normal"
          >
            Outside action
          </Button>
        </div>
      </FieldSet>

      <FieldSet className="button-specimen min-w-0 bg-card p-6">
        <FieldLegend>Form and focus return</FieldLegend>
        <Popover open={formOpen} onOpenChange={setFormOpen}>
          <PopoverTrigger
            id="popover-form"
            render={
              <Button
                variant="outline"
                className="w-fit h-auto min-h-8 max-w-full whitespace-normal"
              />
            }
          >
            Edit example dimensions
          </PopoverTrigger>
          <PopoverContent align="start">
            <Note
              title="Dimensions"
              description="These example values reset when the panel closes."
            />
            <form
              className="flex flex-col gap-4"
              onSubmit={(event) => {
                event.preventDefault();
                setFormOpen(false);
              }}
            >
              <FieldGroup className="gap-4">
                <Field>
                  <FieldLabel htmlFor="popover-width">Width</FieldLabel>
                  <Input
                    id="popover-width"
                    name="width"
                    type="number"
                    min="1"
                    defaultValue="320"
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="popover-height">Height</FieldLabel>
                  <Input
                    id="popover-height"
                    name="height"
                    type="number"
                    min="1"
                    defaultValue="240"
                    required
                  />
                </Field>
              </FieldGroup>
              <div className="flex flex-wrap justify-end gap-2">
                <Button type="button" variant="secondary" onClick={() => setFormOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Done</Button>
              </div>
            </form>
          </PopoverContent>
        </Popover>
      </FieldSet>

      <FieldSet className="button-specimen min-w-0 ninaero-surface-paper bg-(--paper-fill) p-6">
        <FieldLegend>Sides and alignment</FieldLegend>
        <div className="flex flex-wrap gap-3">
          {sides.map((side) => (
            <Popover key={side}>
              <PopoverTrigger
                id={`popover-side-${side}`}
                render={
                  <Button
                    variant="outline"
                    className="h-auto min-h-8 max-w-full whitespace-normal"
                  />
                }
              >
                {side.replace("-", " ")}
              </PopoverTrigger>
              <PopoverContent side={side}>
                <Note
                  title="Placement"
                  description="The panel flips or shifts when it reaches the viewport edge."
                />
              </PopoverContent>
            </Popover>
          ))}
        </div>
        <div className="flex flex-wrap gap-3">
          {alignments.map((align) => (
            <Popover key={align}>
              <PopoverTrigger
                id={`popover-align-${align}`}
                render={
                  <Button
                    variant="outline"
                    className="h-auto min-h-8 max-w-full whitespace-normal"
                  />
                }
              >
                Align {align}
              </PopoverTrigger>
              <PopoverContent align={align}>
                <Note
                  title="Alignment"
                  description="The chosen edge stays aligned with the trigger where space allows."
                />
              </PopoverContent>
            </Popover>
          ))}
        </div>
      </FieldSet>

      <FieldSet className="button-specimen min-w-0 bg-card p-6">
        <FieldLegend>Disabled and invalid fields</FieldLegend>
        <Popover>
          <PopoverTrigger
            id="popover-field-states"
            render={
              <Button
                variant="outline"
                className="w-fit h-auto min-h-8 max-w-full whitespace-normal"
              />
            }
          >
            Inspect fields
          </PopoverTrigger>
          <PopoverContent>
            <Note
              title="Field states"
              description="Fields keep their own material, validation, and keyboard focus."
            />
            <FieldGroup className="gap-4">
              <Field data-invalid>
                <FieldLabel htmlFor="popover-invalid">Example invalid value</FieldLabel>
                <Input id="popover-invalid" defaultValue="-1" aria-invalid="true" />
              </Field>
              <Field data-disabled>
                <FieldLabel htmlFor="popover-disabled-field">Disabled value</FieldLabel>
                <Input id="popover-disabled-field" defaultValue="240" disabled />
              </Field>
            </FieldGroup>
          </PopoverContent>
        </Popover>
      </FieldSet>

      <FieldSet className="button-specimen min-w-0 ninaero-surface-paper bg-(--paper-fill) p-6">
        <FieldLegend>Wrapping and scrolling</FieldLegend>
        <Popover>
          <PopoverTrigger
            id="popover-long"
            render={
              <Button
                variant="outline"
                className="w-fit h-auto min-h-8 max-w-full whitespace-normal"
              />
            }
          >
            Open long details
          </PopoverTrigger>
          <PopoverContent>
            <Note
              title="Long details"
              description="Long content stays within the available viewport and scrolls inside the panel."
            />
            <p>
              skærmbillede-af-den-færdige-tegning-med-mange-detaljer-og-et-ekstra-langt-filnavn.png
            </p>
            {Array.from({ length: 8 }, (_, index) => (
              <p key={index}>
                Detail {index + 1}. The opaque paper face keeps text clear while the surrounding
                page remains visible.
              </p>
            ))}
          </PopoverContent>
        </Popover>
      </FieldSet>

      <FieldSet className="button-specimen min-w-0 bg-card p-6">
        <FieldLegend>Nested panels and dialog</FieldLegend>
        <div className="flex flex-wrap gap-3">
          <Popover>
            <PopoverTrigger
              id="popover-parent"
              render={
                <Button variant="outline" className="h-auto min-h-8 max-w-full whitespace-normal" />
              }
            >
              Open parent panel
            </PopoverTrigger>
            <PopoverContent>
              <Note title="Parent panel" description="Escape closes the innermost panel first." />
              <Popover>
                <PopoverTrigger
                  id="popover-child"
                  render={
                    <Button
                      variant="outline"
                      className="h-auto min-h-8 max-w-full whitespace-normal"
                    />
                  }
                >
                  Open child panel
                </PopoverTrigger>
                <PopoverContent side="right">
                  <Note
                    title="Child panel"
                    description="Dismiss this panel to return to its parent."
                  />
                </PopoverContent>
              </Popover>
            </PopoverContent>
          </Popover>
          <Dialog>
            <DialogTrigger
              id="popover-dialog"
              render={
                <Button variant="outline" className="h-auto min-h-8 max-w-full whitespace-normal" />
              }
            >
              Open dialog example
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Popover inside a dialog</DialogTitle>
                <DialogDescription>
                  The floating panel stays above the dialog and retains its own dismissal behavior.
                </DialogDescription>
              </DialogHeader>
              <Popover>
                <PopoverTrigger
                  id="popover-in-dialog"
                  render={
                    <Button
                      variant="outline"
                      className="h-auto min-h-8 max-w-full whitespace-normal"
                    />
                  }
                >
                  Open contextual note
                </PopoverTrigger>
                <PopoverContent>
                  <Note
                    title="Contextual note"
                    description="Escape returns to the dialog without closing it."
                  />
                </PopoverContent>
              </Popover>
            </DialogContent>
          </Dialog>
        </div>
      </FieldSet>

      <FieldSet className="button-specimen min-w-0 ninaero-surface-paper bg-(--paper-fill) p-6">
        <FieldLegend>Right to left</FieldLegend>
        <DirectionProvider direction="rtl">
          <div dir="rtl" className="flex flex-wrap gap-3">
            {(["inline-start", "inline-end"] as const).map((side) => (
              <Popover key={side}>
                <PopoverTrigger
                  id={`popover-rtl-${side}`}
                  render={
                    <Button
                      variant="outline"
                      className="h-auto min-h-8 max-w-full whitespace-normal"
                    />
                  }
                >
                  RTL {side.replace("-", " ")}
                </PopoverTrigger>
                <PopoverContent side={side} align="start" dir="rtl">
                  <Note
                    title="اتجاه اللوحة"
                    description="تظهر اللوحة بجانب الزر وفق اتجاه القراءة."
                  />
                </PopoverContent>
              </Popover>
            ))}
          </div>
        </DirectionProvider>
      </FieldSet>
    </div>
  );
}
