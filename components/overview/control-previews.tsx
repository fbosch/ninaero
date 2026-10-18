"use client";

import dynamic from "next/dynamic";
import { type ComponentType, useId, useState } from "react";

import type { ControlName, PreviewProps } from "@/lib/component-overview";
import { Button } from "@/registry/ninaero/ui/button";
import { ButtonGroup } from "@/registry/ninaero/ui/button-group";
import { Checkbox } from "@/registry/ninaero/ui/checkbox";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/registry/ninaero/ui/combobox";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/registry/ninaero/ui/command";
import { Field, FieldDescription, FieldLabel } from "@/registry/ninaero/ui/field";
import { Input } from "@/registry/ninaero/ui/input";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/registry/ninaero/ui/input-group";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/registry/ninaero/ui/input-otp";
import { Label } from "@/registry/ninaero/ui/label";
import { NativeSelect, NativeSelectOption } from "@/registry/ninaero/ui/native-select";
import { RadioGroup, RadioGroupItem } from "@/registry/ninaero/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/ninaero/ui/select";
import { Slider } from "@/registry/ninaero/ui/slider";
import { Switch } from "@/registry/ninaero/ui/switch";
import { Textarea } from "@/registry/ninaero/ui/textarea";
import { Toggle } from "@/registry/ninaero/ui/toggle";
import { ToggleGroup, ToggleGroupItem } from "@/registry/ninaero/ui/toggle-group";

const CalendarPreview = dynamic(() => import("./calendar-preview"));
const QuestionnairePreview = dynamic(() => import("./questionnaire-preview"));
const DataTablePreview = dynamic(() => import("./data-table-preview"));
const DatePickerPreview = dynamic(() => import("./date-picker-preview"));
const SoundProviderPreview = dynamic(() => import("./sound-provider-preview"));

function ButtonPreview({ interactive }: PreviewProps) {
  const [last, setLast] = useState("");
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <Button onClick={() => interactive && setLast("Primary")}>Primary</Button>
        <Button variant="secondary" onClick={() => interactive && setLast("Secondary")}>
          Secondary
        </Button>
        <Button variant="outline" onClick={() => interactive && setLast("Outline")}>
          Outline
        </Button>
      </div>
      {interactive && (
        <output className="block text-xs text-muted-foreground">
          {last ? `${last} button selected` : "Select a button to see feedback"}
        </output>
      )}
    </div>
  );
}

function ButtonGroupPreview({ interactive }: PreviewProps) {
  const [view, setView] = useState("Day");
  return (
    <div className="space-y-2">
      <ButtonGroup>
        {["Day", "Week", "Month"].map((option) => (
          <Button
            key={option}
            variant={view === option ? "default" : "outline"}
            onClick={() => interactive && setView(option)}
          >
            {option}
          </Button>
        ))}
      </ButtonGroup>
      {interactive && <output className="block text-xs text-muted-foreground">View: {view}</output>}
    </div>
  );
}

function CheckboxPreview() {
  const id = useId();
  return (
    <div className="flex items-center gap-2">
      <Checkbox id={id} defaultChecked />
      <Label htmlFor={id}>Include notes</Label>
    </div>
  );
}

function ComboboxPreview() {
  const id = useId();
  return (
    <div className="w-full max-w-64 space-y-2">
      <Label htmlFor={id}>Fruit</Label>
      <Combobox items={["Apple", "Banana", "Cherry"]}>
        <ComboboxInput id={id} placeholder="Choose a fruit" />
        <ComboboxContent>
          <ComboboxEmpty>No matching fruit</ComboboxEmpty>
          <ComboboxList>
            {(fruit: string) => (
              <ComboboxItem key={fruit} value={fruit}>
                {fruit}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </div>
  );
}

function CommandPreview({ interactive }: PreviewProps) {
  const [selected, setSelected] = useState("");
  return (
    <div className="w-full max-w-64 rounded-lg border">
      <Command>
        <CommandInput placeholder="Find an action" aria-label="Find an action" />
        <CommandList>
          <CommandEmpty>No matching actions</CommandEmpty>
          <CommandGroup heading="Actions">
            {["Copy", "Paste", "Select all"].map((action) => (
              <CommandItem key={action} onSelect={() => interactive && setSelected(action)}>
                {action}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
      {interactive && selected && (
        <output className="block px-2 pb-2 text-xs text-muted-foreground">
          Selected: {selected}
        </output>
      )}
    </div>
  );
}

function FieldPreview() {
  const id = useId();
  return (
    <Field className="w-full max-w-64">
      <FieldLabel htmlFor={id}>Display name</FieldLabel>
      <Input id={id} placeholder="Your name" />
      <FieldDescription>Only shown in this example.</FieldDescription>
    </Field>
  );
}

function InputPreview() {
  const id = useId();
  return (
    <div className="w-full max-w-64 space-y-2">
      <Label htmlFor={id}>Email</Label>
      <Input id={id} type="email" placeholder="name@example.com" />
      <Input disabled aria-label="Disabled input" placeholder="Disabled" />
    </div>
  );
}

function InputGroupPreview() {
  const id = useId();
  return (
    <div className="w-full max-w-64 space-y-2">
      <Label htmlFor={id}>Website</Label>
      <InputGroup>
        <InputGroupInput id={id} placeholder="example.com" />
        <InputGroupAddon>https://</InputGroupAddon>
      </InputGroup>
    </div>
  );
}

function InputOTPPreview({ interactive }: PreviewProps) {
  const id = useId();
  const [value, setValue] = useState("");
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>Example code</Label>
      <InputOTP
        maxLength={4}
        id={id}
        pattern="^[0-9]+$"
        value={value}
        onChange={setValue}
        aria-label="Example code"
      >
        <InputOTPGroup>
          {[0, 1, 2, 3].map((index) => (
            <InputOTPSlot key={index} index={index} />
          ))}
        </InputOTPGroup>
      </InputOTP>
      {interactive && (
        <output className="block text-xs text-muted-foreground">
          {value.length === 4 ? "Code entered (not verified)" : "Enter four digits"}
        </output>
      )}
    </div>
  );
}

function LabelPreview() {
  const id = useId();
  return (
    <div className="w-full max-w-64 space-y-2">
      <Label htmlFor={id}>Project name</Label>
      <Input id={id} placeholder="Enter a name" />
    </div>
  );
}

function NativeSelectPreview() {
  const id = useId();
  return (
    <div className="w-full max-w-64 space-y-2">
      <Label htmlFor={id}>Size</Label>
      <NativeSelect id={id} defaultValue="medium">
        <NativeSelectOption value="small">Small</NativeSelectOption>
        <NativeSelectOption value="medium">Medium</NativeSelectOption>
        <NativeSelectOption value="large">Large</NativeSelectOption>
      </NativeSelect>
    </div>
  );
}

function RadioGroupPreview() {
  const id = useId();
  return (
    <div className="space-y-2">
      <span className="text-sm font-medium" id={id}>
        Density
      </span>
      <RadioGroup defaultValue="comfortable" aria-labelledby={id}>
        {["Compact", "Comfortable", "Spacious"].map((choice) => {
          const value = choice.toLowerCase();
          return (
            <div className="flex items-center gap-2" key={choice}>
              <RadioGroupItem value={value} id={`${id}-${value}`} />
              <Label htmlFor={`${id}-${value}`}>{choice}</Label>
            </div>
          );
        })}
      </RadioGroup>
    </div>
  );
}

function SelectPreview() {
  const id = useId();
  return (
    <div className="w-full max-w-64 space-y-2">
      <Label id={id}>Theme preference</Label>
      <Select defaultValue="system">
        <SelectTrigger className="w-full" aria-labelledby={id}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="system">System</SelectItem>
          <SelectItem value="light">Light</SelectItem>
          <SelectItem value="dark">Dark</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

function SliderPreview({ interactive }: PreviewProps) {
  const id = useId();
  const [value, setValue] = useState(40);
  return (
    <div className="w-full max-w-64 space-y-3">
      <Label id={id}>Volume: {value}%</Label>
      <Slider
        aria-labelledby={id}
        value={value}
        onValueChange={(next) => setValue(Array.isArray(next) ? next[0] : next)}
      />
      {interactive && <p className="text-xs text-muted-foreground">Example setting only</p>}
    </div>
  );
}

function SwitchPreview() {
  const id = useId();
  return (
    <div className="flex items-center gap-2">
      <Switch id={id} defaultChecked />
      <Label htmlFor={id}>Show hints</Label>
    </div>
  );
}

function TextareaPreview() {
  const id = useId();
  return (
    <div className="w-full max-w-64 space-y-2">
      <Label htmlFor={id}>Notes</Label>
      <Textarea id={id} placeholder="Add a note" rows={3} />
    </div>
  );
}

function TogglePreview() {
  return (
    <Toggle variant="outline" defaultPressed>
      Bold
    </Toggle>
  );
}

function ToggleGroupPreview() {
  return (
    <ToggleGroup defaultValue={["left"]} variant="outline" spacing={0} aria-label="Text alignment">
      <ToggleGroupItem value="left">Left</ToggleGroupItem>
      <ToggleGroupItem value="center">Center</ToggleGroupItem>
      <ToggleGroupItem value="right">Right</ToggleGroupItem>
    </ToggleGroup>
  );
}

export const controlPreviews = {
  button: ButtonPreview,
  "button-group": ButtonGroupPreview,
  calendar: CalendarPreview,
  checkbox: CheckboxPreview,
  combobox: ComboboxPreview,
  command: CommandPreview,
  field: FieldPreview,
  input: InputPreview,
  "data-table": DataTablePreview,
  "date-picker": DatePickerPreview,
  "input-group": InputGroupPreview,
  "input-otp": InputOTPPreview,
  label: LabelPreview,
  "native-select": NativeSelectPreview,
  questionnaire: QuestionnairePreview,
  "radio-group": RadioGroupPreview,
  select: SelectPreview,
  slider: SliderPreview,
  "sound-provider": SoundProviderPreview,
  switch: SwitchPreview,
  textarea: TextareaPreview,
  toggle: TogglePreview,
  "toggle-group": ToggleGroupPreview,
} satisfies Record<ControlName, ComponentType<PreviewProps>>;
