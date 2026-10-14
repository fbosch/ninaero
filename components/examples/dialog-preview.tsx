"use client";

import { type FormEvent, useId, useRef, useState } from "react";

import { FilePlus2Icon } from "@/lib/icons";
import { Button } from "@/registry/ninaero/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/registry/ninaero/ui/dialog";
import { Field, FieldError, FieldLabel } from "@/registry/ninaero/ui/field";
import { Input } from "@/registry/ninaero/ui/input";

export function DialogPreview() {
  const [pages, setPages] = useState(3);

  return (
    <div className="space-y-3">
      <Dialog>
        <DialogTrigger render={<Button variant="secondary" />}>Add a page</DialogTrigger>
        <DialogContent showCloseButton={false}>
          <DialogHeader className="items-center text-center">
            <FilePlus2Icon aria-hidden="true" className="mb-2 size-8 text-foreground/70" />
            <DialogTitle>Add a page?</DialogTitle>
            <DialogDescription>
              Add a blank page to this preview notebook. Existing pages stay unchanged.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-row">
            <DialogClose render={<Button variant="secondary" size="lg" className="flex-1" />}>
              Cancel
            </DialogClose>
            <DialogClose
              render={<Button size="lg" className="flex-1" />}
              onClick={() => setPages((count) => count + 1)}
            >
              Add page
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <p aria-live="polite" className="text-sm text-muted-foreground">
        Pages in this preview: {pages}
      </p>
    </div>
  );
}

export function DialogFormPreview() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("Sketchbook");
  const [draft, setDraft] = useState(name);
  const [invalid, setInvalid] = useState(false);
  const nameId = useId();
  const errorId = `${nameId}-error`;
  const inputRef = useRef<HTMLInputElement>(null);

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);
    if (nextOpen) {
      setDraft(name);
      setInvalid(false);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextName = draft.trim();
    if (!nextName) {
      setInvalid(true);
      inputRef.current?.focus();
      return;
    }
    setName(nextName);
    setOpen(false);
  }

  return (
    <div className="space-y-3">
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogTrigger render={<Button variant="secondary" />}>Rename notebook</DialogTrigger>
        <DialogContent>
          <form noValidate onSubmit={handleSubmit} className="grid gap-6">
            <DialogHeader>
              <DialogTitle>Rename notebook</DialogTitle>
              <DialogDescription>Give this preview notebook a name.</DialogDescription>
            </DialogHeader>
            <Field data-invalid={invalid}>
              <FieldLabel htmlFor={nameId}>Notebook name</FieldLabel>
              <Input
                ref={inputRef}
                id={nameId}
                name="notebookName"
                value={draft}
                maxLength={60}
                required
                aria-invalid={invalid}
                aria-describedby={invalid ? errorId : undefined}
                onChange={(event) => {
                  setDraft(event.target.value);
                  setInvalid(false);
                }}
              />
              {invalid && <FieldError id={errorId}>Enter a notebook name.</FieldError>}
            </Field>
            <DialogFooter>
              <DialogClose render={<Button variant="secondary" size="lg" />}>Cancel</DialogClose>
              <Button size="lg" type="submit" disabled={draft.trim() === name}>
                Rename
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <p aria-live="polite" className="text-sm text-muted-foreground">
        Notebook name: <span className="text-foreground">{name}</span>
      </p>
    </div>
  );
}
