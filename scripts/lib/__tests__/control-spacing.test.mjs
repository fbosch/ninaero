import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { runInNewContext } from "node:vm";

import ts from "typescript";

const require = createRequire(import.meta.url);
const names = ["button", "input", "textarea", "select", "input-group"];
const sources = new Map(
  await Promise.all(
    names.map(async (name) => [
      name,
      await readFile(new URL(`../../../registry/ninaero/ui/${name}.tsx`, import.meta.url), "utf8"),
    ]),
  ),
);
const modules = new Map();
const iconSource = await readFile(new URL("../../../lib/icons.tsx", import.meta.url), "utf8");
const iconModule = ts
  .transpileModule(iconSource, {
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      jsx: ts.JsxEmit.ReactJSX,
      target: ts.ScriptTarget.ES2022,
    },
  })
  .outputText.replace(
    /from "([^"]+)"/g,
    (_, specifier) => `from "${import.meta.resolve(specifier)}"`,
  );
const icons = await import(
  `data:text/javascript;base64,${Buffer.from(iconModule).toString("base64")}`
);

for (const name of names) {
  const filename = fileURLToPath(
    new URL(`../../../registry/ninaero/ui/${name}.tsx`, import.meta.url),
  );
  const compiled = ts.transpileModule(sources.get(name), {
    fileName: filename,
    reportDiagnostics: true,
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      jsx: ts.JsxEmit.ReactJSX,
      target: ts.ScriptTarget.ES2022,
      esModuleInterop: true,
    },
  });
  assert.equal(compiled.diagnostics.length, 0, `${name} compiles`);
  const evaluatedModule = { exports: {} };
  runInNewContext(
    compiled.outputText,
    {
      exports: evaluatedModule.exports,
      module: evaluatedModule,
      require(specifier) {
        if (specifier === "@/lib/icons") return icons;
        const dependency = specifier.match(/^@\/registry\/ninaero\/ui\/([^/]+)$/)?.[1];
        if (!dependency) return require(specifier);
        assert.ok(modules.has(dependency), `${name}: loaded ${dependency}`);
        return modules.get(dependency);
      },
    },
    { filename },
  );
  modules.set(name, evaluatedModule.exports);
}

const { Button } = modules.get("button");
const { Input } = modules.get("input");
const { Textarea } = modules.get("textarea");
const { SelectTrigger, SelectContent, SelectItem, SelectLabel } = modules.get("select");
const { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } =
  modules.get("input-group");
const classes = (element) => new Set(element.props.className.split(/\s+/));
const includes = (element, expected) => {
  const actual = classes(element);
  for (const value of expected) assert.ok(actual.has(value), `missing ${value}`);
};

test("default Button, Input, and Select share a 32px row and 12px text inset", () => {
  includes(Button({}), ["h-8", "px-3", "gap-2", "leading-5"]);
  includes(Input({}), ["h-8", "px-3", "py-1", "leading-5"]);
  includes(SelectTrigger({}), ["data-[size=default]:h-8", "px-3", "py-1", "leading-5"]);
});

for (const [size, height, inset, gap, line] of [
  ["xs", "h-6", "px-2", "gap-1", "leading-4"],
  ["sm", "h-7", "px-2", "gap-1", "leading-4"],
  ["default", "h-8", "px-3", "gap-2", "leading-5"],
  ["lg", "h-9", "px-4", "gap-2", "leading-5"],
]) {
  test(`Button ${size} uses its documented height, inset, gap, and line height`, () => {
    const element = Button({ size });
    assert.equal(element.props["data-size"], size);
    includes(element, [height, inset, gap, line]);
    assert.ok(!element.props.className.includes("1.5"));
    assert.ok(!element.props.className.includes("2.5"));
    if (size === "xs" || size === "sm") {
      assert.ok(!element.props.className.includes("has-data-[icon="));
    }
  });
}

for (const [size, dimension] of [
  ["icon-xs", "size-6"],
  ["icon-sm", "size-7"],
  ["icon", "size-8"],
  ["icon-lg", "size-9"],
]) {
  test(`Button ${size} stays square and centers its glyph`, () => {
    includes(Button({ size }), [dimension, "items-center", "justify-center"]);
  });
}

test("compact Select matches compact Button density, including icons inside its value", () => {
  const element = SelectTrigger({ size: "sm" });
  assert.equal(element.props["data-size"], "sm");
  includes(element, [
    "data-[size=sm]:h-7",
    "data-[size=sm]:px-2",
    "data-[size=sm]:gap-1",
    "data-[size=sm]:leading-4",
    "*:data-[slot=select-value]:gap-2",
    "data-[size=sm]:*:data-[slot=select-value]:gap-1",
  ]);
});

test("Textarea keeps a 64px minimum, 12px text edge, 8px vertical inset, and native sizing", () => {
  const element = Textarea({ rows: 4, name: "notes", className: "max-w-lg" });
  assert.equal(element.type, "textarea");
  assert.equal(element.props.rows, 4);
  assert.equal(element.props.name, "notes");
  includes(element, [
    "min-h-16",
    "px-3",
    "py-2",
    "leading-6",
    "md:leading-5",
    "field-sizing-content",
    "max-w-lg",
  ]);
  assert.ok(![...classes(element)].some((value) => value.startsWith("resize-")));
});

test("Input file-selector content fits its line box and separates the filename by 8px", () => {
  const element = Input({ type: "file", accept: "image/png" });
  assert.equal(element.props.type, "file");
  assert.equal(element.props.accept, "image/png");
  includes(element, ["file:h-5", "file:px-2", "file:py-0", "file:mr-2", "file:leading-5"]);
});

test("consumer geometry classes replace rather than stack on default field geometry", () => {
  const input = Input({ className: "h-9 px-4 leading-6" });
  includes(input, ["h-9", "px-4", "leading-6"]);
  for (const value of ["h-8", "px-3", "leading-5"]) assert.ok(!classes(input).has(value));
  const textarea = Textarea({ className: "min-h-24 py-3" });
  includes(textarea, ["min-h-24", "py-3"]);
  assert.ok(!classes(textarea).has("min-h-16"));
  assert.ok(!classes(textarea).has("py-2"));
});

test("InputGroup inner input stretches to the shared frame instead of retaining its own 32px box", () => {
  const element = InputGroupInput({ name: "search" });
  const inner = Input(element.props);
  assert.equal(inner.props.name, "search");
  includes(inner, ["h-auto", "min-h-0", "self-stretch", "border-0"]);
  assert.ok(!classes(inner).has("h-8"));
});

test("InputGroup uses 12px outside edges, 8px content gaps, and one owner for block insets", () => {
  includes(InputGroupAddon({ align: "inline-start" }), ["pl-3"]);
  includes(InputGroupAddon({ align: "inline-end" }), ["pr-3"]);
  for (const align of ["block-start", "block-end"]) {
    includes(InputGroupAddon({ align }), ["px-3", "py-2"]);
  }
  includes(InputGroup({}), [
    "has-[>[data-align=inline-start]]:[&>input]:pl-2",
    "has-[>[data-align=inline-end]]:[&>input]:pr-2",
    "has-[>[data-align=block-start]]:[&>textarea]:pt-0",
    "has-[>[data-align=block-end]]:[&>textarea]:pb-0",
  ]);
  assert.ok(!sources.get("input-group").includes("[-0."));
  assert.ok(!sources.get("input-group").includes("px-2.5"));
});

for (const [size, height] of [
  ["xs", "h-6"],
  ["sm", "h-7"],
  ["icon-xs", "size-6"],
  ["icon-sm", "size-7"],
]) {
  test(`InputGroupButton ${size} passes the real size to Button`, () => {
    const embedded = InputGroupButton({ size });
    assert.equal(embedded.type, Button);
    assert.equal(embedded.props.size, size);
    includes(Button(embedded.props), [height, "shadow-none"]);
  });
}

test("Select menu keeps an 8px frame inset, uniform rows, aligned labels, and a checkmark gutter", () => {
  const portal = SelectContent({});
  const popup = portal.props.children.props.children;
  includes(popup, ["p-2"]);
  includes(SelectLabel({}), ["px-3"]);
  const item = SelectItem({ children: "System" });
  includes(item, ["min-h-8", "pl-3", "pr-8", "py-1", "leading-5", "gap-2"]);
  includes(item.props.children[1].props.render, ["right-2", "size-4"]);
});

test("input workshop uses 16px field separation without adding a second action gap", async () => {
  const source = await readFile(
    new URL("../../../app/workshop/inputs/page.tsx", import.meta.url),
    "utf8",
  );
  assert.equal((source.match(/max-w-lg space-y-4 p-6/g) ?? []).length, 3);
  assert.ok(!source.includes("space-y-5"));
  assert.ok(!source.includes("gap-2 pt-1"));
});

for (const name of names) {
  test(`published ${name} includes the current installable spacing implementation`, async () => {
    const published = JSON.parse(
      await readFile(new URL(`../../../public/r/${name}.json`, import.meta.url), "utf8"),
    );
    const file = published.files.find((entry) => entry.path.endsWith(`/${name}.tsx`));
    assert.ok(file);
    assert.equal(file.content, sources.get(name));
  });
}
