import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { accentPresets } from "../../../registry/ninaero/accents.mjs";
import { theme } from "../../../registry/ninaero/theme.mjs";
import { renderThemeCss } from "../theme.mjs";

const source = await readFile(
  new URL("../../../registry/ninaero/ui/select.tsx", import.meta.url),
  "utf8",
);
const components = theme.css["@layer components"];
const fields = ".ninaero-input, .ninaero-textarea, .ninaero-select-trigger";
const trigger = source.slice(
  source.indexOf("function SelectTrigger("),
  source.indexOf("function SelectContent("),
);
const popup = source.slice(
  source.indexOf("function SelectContent("),
  source.indexOf("function SelectLabel("),
);
const item = source.slice(
  source.indexOf("function SelectItem("),
  source.indexOf("function SelectSeparator("),
);
const classes = (section) => section.match(/className=\{cn\(\s*"([^"]+)"/)[1].split(" ");
const state = (suffix, extra = "") =>
  `.ninaero-input${suffix}, .ninaero-textarea${suffix}, .ninaero-select-trigger${suffix}${extra}`;

test("Select trigger shares Input and Textarea material without competing field utilities", () => {
  const material = components[fields];
  assert.ok(classes(trigger).includes("ninaero-select-trigger"));
  assert.equal(material["--input-corner"], "0.875rem");
  assert.equal(material["corner-shape"], "squircle");
  assert.equal(material.border, "1px solid var(--input-edge)");
  assert.equal(material["background-color"], "var(--card)");
  assert.equal(material.color, "var(--card-foreground)");
  assert.match(material["box-shadow"], /^inset .*inset /);
  assert.ok(classes(trigger).includes("px-3"));
  assert.ok(
    !classes(trigger).some((value) =>
      /(^|:)(bg-|border|rounded-|ring-|shadow-|opacity-|outline-)/.test(value),
    ),
  );
  assert.match(
    renderThemeCss(theme),
    /\.ninaero-input, \.ninaero-textarea, \.ninaero-select-trigger \{[^}]*corner-shape: squircle;/,
  );
});

test("Select shares explicit focus, invalid, placeholder, and opaque disabled field states", () => {
  const disabled = components[state(":disabled", ", .ninaero-select-trigger[data-disabled]")];
  const invalid =
    components[state("[aria-invalid=true]", ", .ninaero-select-trigger[data-invalid]")];
  assert.equal(components[state(":focus-visible")]["outline-color"], "var(--ring)");
  assert.equal(components[fields]["outline-offset"], "3px");
  assert.equal(invalid["border-color"], "var(--destructive)");
  assert.equal(
    components[
      ".ninaero-input::placeholder, .ninaero-textarea::placeholder, .ninaero-select-trigger[data-placeholder]"
    ].color,
    "var(--input-placeholder)",
  );
  assert.equal(disabled["background-color"], "var(--input-disabled-fill)");
  assert.equal(disabled.color, "var(--muted-foreground)");
  assert.equal(disabled["box-shadow"], "none");
  assert.equal(disabled.opacity, undefined);
});

test("Select popup uses the shared neutral floating frame and owns its padding", () => {
  assert.ok(classes(popup).includes("ninaero-popover"));
  assert.ok(classes(popup).includes("ninaero-select-content"));
  assert.ok(classes(popup).includes("p-2"));
  const material = components[".ninaero-popover"];
  assert.equal(material["border-radius"], "1.25rem");
  assert.equal(material["corner-shape"], "squircle");
  assert.equal(material["background-color"], "var(--popover)");
  assert.match(material["box-shadow"], /inset .*var\(--shadow-color\)/);
  assert.ok(!classes(popup).some((value) => /(^|:)(bg-|rounded-|ring-|shadow-)/.test(value)));
});

test("Select options distinguish selection from highlighting using Base UI state attributes", () => {
  assert.ok(classes(item).includes("ninaero-select-item"));
  assert.equal(components[".ninaero-select-item"]["corner-shape"], "squircle");
  assert.equal(components[".ninaero-select-item"]["outline-offset"], "-3px");
  assert.deepEqual(components[".ninaero-select-item[data-selected]"], {
    "border-color": "var(--ring)",
    "background-color": "var(--accent)",
    color: "var(--accent-foreground)",
  });
  assert.equal(
    components[".ninaero-select-item[data-highlighted]"]["outline-color"],
    "var(--ring)",
  );
  assert.equal(
    components[".ninaero-select-item[data-highlighted]:not([data-selected]):not([data-disabled])"][
      "background-color"
    ],
    "var(--muted)",
  );
  assert.equal(components[".ninaero-select-item[data-disabled]"].color, "var(--muted-foreground)");
  assert.ok(item.includes("<SelectPrimitive.ItemIndicator"));
  assert.ok(item.includes("<CheckIcon"));
  assert.ok(
    !classes(item).some((value) => value.includes("opacity-") || value.startsWith("focus:")),
  );
});

test("Select selection text and defining edge meet contrast targets across all accents and modes", () => {
  const luminance = (hex) => {
    const rgb = hex
      .slice(1)
      .match(/../g)
      .map((channel) => {
        const value = Number.parseInt(channel, 16) / 255;
        return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
      });
    return rgb[0] * 0.2126 + rgb[1] * 0.7152 + rgb[2] * 0.0722;
  };
  const contrast = (a, b) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
  for (const [name, preset] of Object.entries(accentPresets)) {
    for (const mode of ["light", "dark"]) {
      const palette = preset[mode];
      const fill = luminance(palette["accent-soft"]);
      assert.ok(
        contrast(fill, luminance(palette["button-link-ink"])) >= 4.5,
        `${name} ${mode} text`,
      );
      assert.ok(
        contrast(fill, luminance(palette["button-focus"])) >= 3,
        `${name} ${mode} selection edge`,
      );
    }
  }
});

test("Select respects reduced motion and preserves system-color focus and selection", () => {
  const reduced = components["@media (prefers-reduced-motion: reduce)"];
  assert.equal(reduced[fields].transition, "none");
  assert.equal(reduced[".ninaero-select-content, .ninaero-select-icon"].transition, "none");
  assert.deepEqual(
    reduced[
      ".ninaero-select-content[data-starting-style], .ninaero-select-content[data-ending-style]"
    ],
    {
      opacity: "1",
      transform: "none",
    },
  );
  const forced = components["@media (forced-colors: active)"];
  assert.equal(forced[fields]["background-color"], "Canvas");
  assert.equal(forced[state(":focus-visible")]["outline-color"], "Highlight");
  assert.equal(
    forced[state(":disabled", ", .ninaero-select-trigger[data-disabled]")].color,
    "GrayText",
  );
  assert.equal(forced[".ninaero-select-item[data-selected]"]["background-color"], "Highlight");
  assert.equal(forced[".ninaero-select-item[data-selected]"].color, "HighlightText");
  assert.equal(forced[".ninaero-select-item[data-highlighted]"]["outline-color"], "Highlight");
  assert.equal(forced[".ninaero-select-item[data-disabled]"].color, "GrayText");
});

test("Select retains primitive ownership, sizing, positioning defaults, and public exports", () => {
  for (const fragment of [
    'from "@base-ui/react/select"',
    "const Select = SelectPrimitive.Root",
    'size = "default"',
    'size?: "sm" | "default"',
    'side = "bottom"',
    "sideOffset = 4",
    'align = "center"',
    "alignOffset = 0",
    "alignItemWithTrigger = true",
    "alignItemWithTrigger={alignItemWithTrigger}",
    "<SelectPrimitive.Portal>",
    "<SelectPrimitive.List>",
    "{...props}",
    "SelectScrollUpButton",
    "SelectScrollDownButton",
    "SelectSeparator",
    "SelectValue",
  ])
    assert.ok(source.includes(fragment), fragment);
  for (const value of ["data-[size=default]:h-8", "data-[size=sm]:h-7"]) {
    assert.ok(classes(trigger).includes(value), value);
  }
  assert.ok(!source.includes("onKeyDown"));
  assert.ok(!source.includes("useEffect"));
});

test("published Select source matches the themed installable component", async () => {
  const published = JSON.parse(
    await readFile(new URL("../../../public/r/select.json", import.meta.url), "utf8"),
  );
  const file = published.files.find((entry) => entry.path.endsWith("/select.tsx"));
  assert.ok(file);
  assert.equal(file.content, source);
  assert.ok(
    published.registryDependencies.some((dependency) => dependency.endsWith("/theme.json")),
  );
});
