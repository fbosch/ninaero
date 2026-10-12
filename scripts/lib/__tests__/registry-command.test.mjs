import assert from "node:assert/strict";
import test from "node:test";
import { registryCommand } from "../registry-command.mjs";

test("commands use the normalized registry URL and quote the whole argument", () => {
  assert.equal(
    registryCommand("init", "ninaero"),
    "pnpm dlx shadcn@latest init 'http://localhost:3000/r/ninaero.json'",
  );
  assert.equal(
    registryCommand("add", "button", "https://example.com/r/"),
    "pnpm dlx shadcn@latest add 'https://example.com/r/button.json'",
  );
});

test("preset and individual commands escape apostrophes and preserve literal shell metacharacters", () => {
  const url = "https://example.com/it's;$HOME/r";
  for (const [action, name] of [
    ["init", "ninaero"],
    ["add", "button"],
  ]) {
    const command = registryCommand(action, name, url);
    assert.ok(command.includes("it'\\''s;$HOME/r/"));
    assert.ok(command.endsWith(`/${name}.json'`));
  }
});

test("commands reject unsupported actions, item paths, and invalid URLs", () => {
  assert.throws(() => registryCommand("delete", "button"), /action/);
  for (const name of [
    "../button",
    "button.json",
    "button;echo",
    "button/other",
    "",
  ]) {
    assert.throws(() => registryCommand("add", name), /item name/);
  }
  assert.throws(() => registryCommand("add", "button", "file:///tmp/r"));
});
