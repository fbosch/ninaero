"use client";

import { useTheme } from "next-themes";
import { useId } from "react";

import { useAccent } from "@/components/accent-provider";
import { MonitorIcon, MoonIcon, SunIcon } from "@/lib/icons";
import { Button } from "@/registry/ninaero/ui/button";
import { ButtonGroup } from "@/registry/ninaero/ui/button-group";
import { Field, FieldTitle } from "@/registry/ninaero/ui/field";

const colorModes = [
  { value: "system", label: "System", Icon: MonitorIcon },
  { value: "dark", label: "Dark", Icon: MoonIcon },
  { value: "light", label: "Light", Icon: SunIcon },
] as const;

export function ThemeSwitcher() {
  const id = useId();
  const { theme, setTheme } = useTheme();
  const { mounted } = useAccent();

  return (
    <Field className="w-auto">
      <FieldTitle id={id} className="sr-only">
        Color mode
      </FieldTitle>
      <ButtonGroup aria-labelledby={id}>
        {colorModes.map(({ value, label, Icon }) => (
          <Button
            key={value}
            size="icon-sm"
            variant={mounted && theme === value ? "default" : "secondary"}
            aria-label={label}
            aria-pressed={mounted && theme === value}
            title={label}
            disabled={!mounted}
            onClick={() => setTheme(value)}
          >
            <Icon aria-hidden="true" />
          </Button>
        ))}
      </ButtonGroup>
    </Field>
  );
}
