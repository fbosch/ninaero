import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import vm from "node:vm";

import ts from "typescript";

const source = await readFile(new URL("../dialog-preview.tsx", import.meta.url), "utf8");
const compiled = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.CommonJS,
    jsx: ts.JsxEmit.ReactJSX,
    target: ts.ScriptTarget.ES2022,
  },
}).outputText;

function preview(componentName) {
  const state = [];
  let cursor = 0;
  let focusCalls = 0;
  const react = {
    useState(initial) {
      const index = cursor++;
      if (!Object.hasOwn(state, index)) state[index] = initial;
      return [
        state[index],
        (next) => {
          state[index] = typeof next === "function" ? next(state[index]) : next;
        },
      ];
    },
    useId: () => "notebook-name",
    useRef: () => ({
      current: {
        focus: () => {
          focusCalls++;
        },
      },
    }),
  };
  const names = (values) => Object.fromEntries(values.map((value) => [value, value]));
  const jsx = (type, props) => ({ type, props });
  const dependencies = {
    react,
    "react/jsx-runtime": { jsx, jsxs: jsx },
    "@/lib/icons": names(["FilePlus2Icon"]),
    "@/registry/ninaero/ui/button": names(["Button"]),
    "@/registry/ninaero/ui/dialog": names([
      "Dialog",
      "DialogClose",
      "DialogContent",
      "DialogDescription",
      "DialogFooter",
      "DialogHeader",
      "DialogTitle",
      "DialogTrigger",
    ]),
    "@/registry/ninaero/ui/field": names(["Field", "FieldError", "FieldLabel"]),
    "@/registry/ninaero/ui/input": names(["Input"]),
  };
  const evaluatedModule = { exports: {} };
  vm.runInNewContext(compiled, {
    module: evaluatedModule,
    exports: evaluatedModule.exports,
    require(specifier) {
      assert.ok(Object.hasOwn(dependencies, specifier), specifier);
      return dependencies[specifier];
    },
  });
  function render() {
    cursor = 0;
    return evaluatedModule.exports[componentName]();
  }
  return {
    render,
    get focusCalls() {
      return focusCalls;
    },
  };
}

function find(node, type) {
  if (!node || typeof node !== "object") return undefined;
  if (Array.isArray(node)) {
    for (const child of node) {
      const match = find(child, type);
      if (match) return match;
    }
    return undefined;
  }
  if (node.type === type) return node;
  return find(node.props.children, type);
}

function submit(harness) {
  let prevented = false;
  find(harness.render(), "form").props.onSubmit({
    preventDefault: () => {
      prevented = true;
    },
  });
  assert.ok(prevented);
}

function changeName(harness, value) {
  find(harness.render(), "Input").props.onChange({ target: { value } });
}

test("the centered prompt increments only local preview state through its confirming action", () => {
  const harness = preview("DialogPreview");
  const tree = harness.render();
  assert.equal(find(tree, "DialogContent").props.showCloseButton, false);
  assert.equal(find(tree, "DialogHeader").props.className, "items-center text-center");
  const actions = find(tree, "DialogFooter").props.children;
  assert.equal(actions[0].props.children, "Cancel");
  assert.equal(actions[0].props.onClick, undefined);
  assert.equal(actions[1].props.children, "Add page");
  actions[1].props.onClick();
  assert.equal(find(harness.render(), "p").props.children[1], 4);
});

test("the form disables unchanged submissions and restores its saved draft after dismissal", () => {
  const harness = preview("DialogFormPreview");
  find(harness.render(), "Dialog").props.onOpenChange(true);
  assert.equal(find(harness.render(), "Button").props.disabled, true);
  changeName(harness, "Unsaved draft");
  assert.equal(find(harness.render(), "Button").props.disabled, false);
  find(harness.render(), "Dialog").props.onOpenChange(false);
  find(harness.render(), "Dialog").props.onOpenChange(true);
  assert.equal(find(harness.render(), "Input").props.value, "Sketchbook");
});

test("an empty name keeps the form open, exposes its error, and returns focus to the field", () => {
  const harness = preview("DialogFormPreview");
  find(harness.render(), "Dialog").props.onOpenChange(true);
  changeName(harness, "   ");
  submit(harness);
  const tree = harness.render();
  assert.equal(find(tree, "Dialog").props.open, true);
  assert.equal(find(tree, "Input").props["aria-invalid"], true);
  assert.equal(find(tree, "Input").props["aria-describedby"], find(tree, "FieldError").props.id);
  assert.equal(find(tree, "FieldError").props.children, "Enter a notebook name.");
  assert.equal(harness.focusCalls, 1);
  changeName(harness, "New name");
  assert.equal(find(harness.render(), "Input").props["aria-invalid"], false);
});

test("a valid rename trims surrounding whitespace, preserves Danish letters, and closes the form", () => {
  const harness = preview("DialogFormPreview");
  find(harness.render(), "Dialog").props.onOpenChange(true);
  changeName(harness, "  Notes æøå  ");
  submit(harness);
  const tree = harness.render();
  assert.equal(find(tree, "Dialog").props.open, false);
  assert.equal(find(find(tree, "p"), "span").props.children, "Notes æøå");
  find(tree, "Dialog").props.onOpenChange(true);
  assert.equal(find(harness.render(), "Input").props.value, "Notes æøå");
});
