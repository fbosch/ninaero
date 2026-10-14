import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { theme } from "../../../registry/ninaero/theme.mjs";

const read = (name) =>
  readFile(new URL(`../../../registry/ninaero/ui/${name}.tsx`, import.meta.url), "utf8");
const source = await read("alert-dialog");
const dialog = await read("dialog");
const section = (text, start, end) =>
  text.slice(text.indexOf(`function ${start}(`), text.indexOf(`function ${end}(`));
const classes = (text) => text.match(/className=\{cn\(\s*"([^"]+)"/)[1].split(" ");
const content = section(source, "AlertDialogContent", "AlertDialogHeader");
const overlay = section(source, "AlertDialogOverlay", "AlertDialogContent");
const footer = section(source, "AlertDialogFooter", "AlertDialogMedia");

test("AlertDialog shares Dialog's installed frame styling without importing its React implementation", () => {
  const expected = classes(section(dialog, "DialogContent", "DialogHeader"));
  for (const value of [
    "ninaero-dialog",
    "w-full",
    "max-w-[calc(100%-2rem)]",
    "gap-6",
    "p-6",
    "text-sm",
    "text-popover-foreground",
    "sm:max-w-sm",
  ]) {
    assert.ok(expected.includes(value));
    assert.ok(classes(content).includes(value));
  }
  assert.ok(
    !classes(content).some((value) =>
      /^(bg-|shadow-|ring-|rounded-|overflow-|clip-|mask-)/.test(value),
    ),
  );
  assert.doesNotMatch(source, /from ["'][^"']*\/ui\/dialog["']/);
  assert.doesNotMatch(source, /SharedModal|ModalBase|\bDialogPrimitive\./);
});

test("AlertDialog keeps its separate native primitives and size composition", () => {
  assert.match(
    source,
    /import \{ AlertDialog as AlertDialogPrimitive \} from "@base-ui\/react\/alert-dialog"/,
  );
  for (const primitive of [
    "Root",
    "Trigger",
    "Portal",
    "Backdrop",
    "Popup",
    "Title",
    "Description",
    "Close",
  ])
    assert.match(source, new RegExp(`<AlertDialogPrimitive\\.${primitive}`));
  assert.match(content, /data-slot="alert-dialog-content"/);
  assert.match(content, /data-size=\{size\}/);
  assert.match(content, /size\?: "default" \| "sm"/);
  assert.ok(classes(content).includes("data-[size=sm]:w-xs"));
  assert.doesNotMatch(content, /showCloseButton|XIcon|role=|disablePointerDismissal/);
});

test("AlertDialog uses the same scrim and interruptible motion instead of stock animations", () => {
  assert.deepEqual(classes(overlay), classes(section(dialog, "DialogOverlay", "DialogContent")));
  for (const text of [content, overlay])
    assert.ok(!classes(text).some((value) => /animate-|zoom-|fade-|duration-/.test(value)));
  const components = theme.css["@layer components"];
  assert.equal(components[".ninaero-dialog"]["--dialog-corner"], "3rem");
  assert.match(components[".ninaero-dialog"].transition, /transform 260ms cubic-bezier/);
  assert.equal(
    components[".ninaero-dialog[data-ending-style]"].transform,
    "translateY(4px) scale(0.96)",
  );
  const reduced = components["@media (prefers-reduced-motion: reduce)"];
  assert.ok(
    Object.keys(reduced).some(
      (selector) =>
        selector.includes(".ninaero-dialog") && selector.includes(".ninaero-dialog-overlay"),
    ),
  );
  assert.equal(
    components["@media (forced-colors: active)"][".ninaero-dialog"]["background-image"],
    "none",
  );
});

test("AlertDialog has a continuous footer, broad actions, and no competing material", () => {
  for (const value of ["-mx-4", "-mb-4", "p-4", "rounded-b-xl", "border-t", "bg-muted/50"])
    assert.ok(!classes(footer).includes(value));
  for (const value of [
    "gap-2",
    "[&>button]:min-w-24",
    "group-data-[size=sm]/alert-dialog-content:grid-cols-2",
  ])
    assert.ok(classes(footer).includes(value));
  assert.match(source, /font-heading text-xl leading-6 font-medium/);
  const media = classes(section(source, "AlertDialogMedia", "AlertDialogTitle"));
  assert.ok(media.includes("size-8"));
  assert.ok(!media.some((value) => /^(rounded-|bg-)/.test(value)));
});

test("AlertDialog Cancel remains native Close while Action leaves completion and closure to its caller", () => {
  const action = section(source, "AlertDialogAction", "AlertDialogCancel");
  const cancel = source.slice(
    source.indexOf("function AlertDialogCancel("),
    source.indexOf("export {"),
  );
  assert.match(action, /size = "lg"/);
  assert.match(action, /<Button data-slot="alert-dialog-action" size=\{size\}/);
  assert.doesNotMatch(action, /\.Close|onClick|setOpen|destructive/);
  assert.match(cancel, /variant = "secondary"/);
  assert.match(cancel, /size = "lg"/);
  assert.match(cancel, /<AlertDialogPrimitive\.Close/);
  assert.match(cancel, /render=\{<Button variant=\{variant\} size=\{size\}/);
  assert.match(cancel, /\.\.\.props/);
});
