"use client";

import { useTheme } from "next-themes";
import { useId } from "react";

import { useAccent } from "@/components/accent-provider";
import { AccentSwitcher } from "@/components/accent-switcher";
import { MonitorIcon, MoonIcon, SunIcon } from "@/lib/icons";
import { ToggleGroup, ToggleGroupItem } from "@/registry/ninaero/ui/toggle-group";

const colorModes = [
  { value: "system", label: "System", Icon: MonitorIcon },
  { value: "light", label: "Light", Icon: SunIcon },
  { value: "dark", label: "Dark", Icon: MoonIcon },
] as const;

export function ThemeSwitcher() {
  const id = useId();
  const { theme, setTheme } = useTheme();
  const { mounted } = useAccent();

  return (
    <div className="space-y-4">
      <fieldset className="space-y-2">
        <legend id={id} className="text-xs text-muted-foreground">
          Color mode
        </legend>
        <ToggleGroup
          aria-labelledby={id}
          value={mounted && theme ? [theme] : []}
          multiple={false}
          disabled={!mounted}
          spacing={1}
          size="lg"
          onValueChange={(values) => {
            // A preference stays selected when its active toggle is pressed again.
            if (values.length === 0) return;
            const value = values[0];
            if (!colorModes.some((mode) => mode.value === value)) {
              throw new Error(`Unknown color mode: ${value}`);
            }
            setTheme(value);
          }}
          className="w-full"
        >
          {colorModes.map(({ value, label, Icon }) => (
            <ToggleGroupItem
              key={value}
              value={value}
              className="min-w-0 flex-1 gap-1.5 px-2 text-xs"
            >
              <Icon aria-hidden="true" className="size-3.5" />
              {label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </fieldset>
      <AccentSwitcher />
    </div>
  );
}
