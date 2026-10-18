"use client";

import { useId, useState } from "react";

import { Button } from "@/registry/ninaero/ui/button";
import { Checkbox } from "@/registry/ninaero/ui/checkbox";
import {
  Combobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/registry/ninaero/ui/combobox";
import { Command, CommandInput, CommandItem, CommandList } from "@/registry/ninaero/ui/command";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/registry/ninaero/ui/dropdown-menu";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from "@/registry/ninaero/ui/field";
import { Progress, ProgressLabel, ProgressValue } from "@/registry/ninaero/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/registry/ninaero/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/ninaero/ui/select";
import { Slider } from "@/registry/ninaero/ui/slider";
import { SoundProvider, useSound } from "@/registry/ninaero/ui/sound-provider";
import { Switch } from "@/registry/ninaero/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/registry/ninaero/ui/tabs";
import { createToastManager, Toaster } from "@/registry/ninaero/ui/toast";
import { Toggle } from "@/registry/ninaero/ui/toggle";
import { ToggleGroup, ToggleGroupItem } from "@/registry/ninaero/ui/toggle-group";

const fruits = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
  { value: "pear", label: "Pear" },
];

function SelectionExamples() {
  const id = useId();
  const [fruit, setFruit] = useState("apple");
  const [action, setAction] = useState("None");

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant="outline" />}>
            Choose a fruit
          </DropdownMenuTrigger>
          <DropdownMenuContent aria-label="Example fruit menu">
            <DropdownMenuRadioGroup
              value={fruit}
              onValueChange={(value, details) => {
                if (value === "cancelled") details.cancel();
                else setFruit(value);
              }}
            >
              {fruits.map((item) => (
                <DropdownMenuRadioItem key={item.value} value={item.value}>
                  {item.label}
                </DropdownMenuRadioItem>
              ))}
              <DropdownMenuRadioItem value="cancelled">Cancelled choice</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="unavailable" disabled>
                Unavailable choice
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        <Select
          items={fruits}
          value={fruit}
          onValueChange={(value) => {
            if (value) setFruit(value);
          }}
        >
          <SelectTrigger aria-label="Example fruit select" className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {fruits.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <Combobox items={["Apple", "Banana", "Pear"]} defaultValue="Apple">
        <ComboboxInput aria-label="Example fruit search" placeholder="Find a fruit…" />
        <ComboboxContent>
          <ComboboxList>
            {(item: string) => (
              <ComboboxItem key={item} value={item}>
                {item}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
      <Field>
        <FieldTitle id={`${id}-level`}>Level</FieldTitle>
        <Slider aria-labelledby={`${id}-level`} defaultValue={40} />
      </Field>
      <RadioGroup aria-label="Example fruit radio group" value={fruit} onValueChange={setFruit}>
        {fruits.map((item) => (
          <Field key={item.value} orientation="horizontal">
            <RadioGroupItem id={`${id}-${item.value}`} value={item.value} />
            <FieldLabel htmlFor={`${id}-${item.value}`}>{item.label}</FieldLabel>
          </Field>
        ))}
      </RadioGroup>
      <ToggleGroup aria-label="Example layout" defaultValue={["list"]}>
        <ToggleGroupItem value="list">List</ToggleGroupItem>
        <ToggleGroupItem value="grid">Grid</ToggleGroupItem>
      </ToggleGroup>
      <Command className="max-w-sm">
        <CommandInput aria-label="Filter example actions" placeholder="Filter actions…" />
        <CommandList>
          <CommandItem value="notes" onSelect={() => setAction("Notes")}>
            Notes
          </CommandItem>
          <CommandItem value="tasks" onSelect={() => setAction("Tasks")}>
            Tasks
          </CommandItem>
          <CommandItem value="unavailable" disabled>
            Unavailable action
          </CommandItem>
        </CommandList>
      </Command>
      <FieldDescription>
        Selected action: {action}. Cancelled choices stay silent and keep the current fruit.
      </FieldDescription>
    </div>
  );
}

function FeedbackExamples() {
  const [manager] = useState(() => createToastManager());
  const [progress, setProgress] = useState(0);
  return (
    <Toaster toastManager={manager}>
      <div className="flex flex-col gap-5">
        <div className="flex flex-wrap gap-2">
          <Button
            sound={false}
            onClick={() => manager.add({ title: "Example notification", type: "info" })}
          >
            Notification
          </Button>
          <Button
            variant="secondary"
            sound={false}
            onClick={() => manager.add({ title: "Example success", type: "success" })}
          >
            Success
          </Button>
          <Button
            variant="outline"
            sound={false}
            onClick={() => manager.add({ title: "Example error", type: "error" })}
          >
            Error
          </Button>
        </div>
        <Progress value={progress}>
          <ProgressLabel>Example task</ProgressLabel>
          <ProgressValue />
        </Progress>
        <Button
          variant="outline"
          sound={false}
          onClick={() => setProgress((value) => (value === 100 ? 0 : value + 25))}
        >
          {progress === 100 ? "Reset progress" : "Advance progress"}
        </Button>
      </div>
    </Toaster>
  );
}

function SoundControls() {
  const checkboxId = useId();
  const switchId = useId();
  const { play } = useSound();

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap gap-2">
        <Button>Save</Button>
        <Button variant="secondary" sound={false} onClick={() => play("success")}>
          Play success
        </Button>
        <Button variant="outline" sound={false}>
          Quiet action
        </Button>
        <Button disabled>Disabled action</Button>
        <Toggle variant="outline">Pin note</Toggle>
      </div>
      <FieldGroup>
        <Field orientation="horizontal">
          <Checkbox id={checkboxId} />
          <FieldLabel htmlFor={checkboxId}>Include notes</FieldLabel>
        </Field>
        <Field orientation="horizontal">
          <Switch id={switchId} />
          <FieldLabel htmlFor={switchId}>Show hints</FieldLabel>
        </Field>
      </FieldGroup>
      <Tabs defaultValue="selection">
        <TabsList aria-label="Sound examples">
          <TabsTrigger value="selection">Selection</TabsTrigger>
          <TabsTrigger value="feedback">Feedback</TabsTrigger>
        </TabsList>
        <TabsContent value="selection">
          <SelectionExamples />
        </TabsContent>
        <TabsContent value="feedback">
          <FeedbackExamples />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default function SoundProviderPreview() {
  const [enabled, setEnabled] = useState(false);
  const id = useId();

  return (
    <SoundProvider enabled={enabled} theme="glass" volume={0.35}>
      <div className="flex w-full flex-col gap-6">
        <Field orientation="horizontal">
          <Switch id={id} checked={enabled} onCheckedChange={setEnabled} sound={false} />
          <div className="flex flex-col gap-1">
            <FieldLabel htmlFor={id}>Sound effects</FieldLabel>
            <FieldDescription>
              Off by default. This setting applies only to this preview.
            </FieldDescription>
          </div>
        </Field>
        <SoundControls />
      </div>
    </SoundProvider>
  );
}
