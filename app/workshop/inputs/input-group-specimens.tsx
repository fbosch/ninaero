"use client";

import { useState } from "react";

import { SearchIcon } from "@/lib/icons";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/registry/ninaero/ui/field";
import { Input } from "@/registry/ninaero/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "@/registry/ninaero/ui/input-group";

export function InputGroupSpecimens() {
  const [query, setQuery] = useState("Clear this text");
  const [notes, setNotes] = useState("");

  return (
    <FieldGroup className="gap-4">
      <Field>
        <FieldLabel htmlFor="group-reference-input">Reference input</FieldLabel>
        <Input id="group-reference-input" placeholder="Compare the field material" />
      </Field>
      <Field>
        <FieldLabel htmlFor="plain-group-input">Plain group</FieldLabel>
        <InputGroup>
          <InputGroupInput id="plain-group-input" placeholder="Compare the field material" />
        </InputGroup>
      </Field>
      <Field>
        <FieldLabel htmlFor="search-group-input">Search with icon</FieldLabel>
        <InputGroup>
          <InputGroupInput id="search-group-input" placeholder="Find a component" />
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
        </InputGroup>
      </Field>
      <Field>
        <FieldLabel htmlFor="website-group-input">Website with prefix and suffix</FieldLabel>
        <InputGroup>
          <InputGroupInput id="website-group-input" placeholder="your-project" />
          <InputGroupAddon>https://</InputGroupAddon>
          <InputGroupAddon align="inline-end">.example</InputGroupAddon>
        </InputGroup>
      </Field>
      <Field>
        <FieldLabel htmlFor="clearable-group-input">Clearable input</FieldLabel>
        <InputGroup>
          <InputGroupInput
            id="clearable-group-input"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <InputGroupAddon align="inline-end">
            <InputGroupButton aria-label="Clear search" onClick={() => setQuery("")}>
              Clear
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </Field>
      <Field data-disabled="true">
        <FieldLabel htmlFor="disabled-group-input">Disabled group</FieldLabel>
        <InputGroup>
          <InputGroupInput id="disabled-group-input" disabled defaultValue="Unavailable" />
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
          <InputGroupAddon align="inline-end">
            <InputGroupButton disabled>Clear</InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </Field>
      <Field>
        <FieldLabel htmlFor="readonly-group-input">Read-only group</FieldLabel>
        <InputGroup>
          <InputGroupInput id="readonly-group-input" readOnly defaultValue="example.com" />
          <InputGroupAddon>https://</InputGroupAddon>
        </InputGroup>
      </Field>
      <Field data-invalid="true">
        <FieldLabel htmlFor="invalid-group-input">Invalid group</FieldLabel>
        <InputGroup>
          <InputGroupInput
            id="invalid-group-input"
            aria-invalid="true"
            aria-describedby="invalid-group-hint"
            defaultValue="Invalid-state example"
          />
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
        </InputGroup>
        <FieldDescription id="invalid-group-hint">
          This is a visual specimen, not live validation.
        </FieldDescription>
      </Field>
      <Field>
        <FieldLabel htmlFor="disabled-action-group-input">
          Enabled field with disabled action
        </FieldLabel>
        <InputGroup>
          <InputGroupInput
            id="disabled-action-group-input"
            placeholder="This field stays editable"
          />
          <InputGroupAddon align="inline-end">
            <InputGroupButton disabled>Clear</InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </Field>
      <Field>
        <FieldLabel htmlFor="multiline-group-input">Multiline group</FieldLabel>
        <InputGroup>
          <InputGroupTextarea
            id="multiline-group-input"
            placeholder="Write a few lines"
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
          />
          <InputGroupAddon align="block-start">
            <InputGroupText>notes.txt</InputGroupText>
          </InputGroupAddon>
          <InputGroupAddon align="block-end">
            <InputGroupButton aria-label="Clear notes" onClick={() => setNotes("")}>
              Clear
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </Field>
    </FieldGroup>
  );
}
