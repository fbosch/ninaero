import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { accentRules } from "../../../registry/ninaero/accents.mjs";
import { theme } from "../../../registry/ninaero/theme.mjs";

const components = theme.css["@layer components"];

test("Secondary and Outline have separate material edges rather than an accent edge", () => {
  assert.equal(
    components[".ninaero-button--secondary"]["border-color"],
    "var(--button-paper-edge)",
  );
  assert.equal(
    components[".ninaero-button--outline"]["border-color"],
    "var(--button-outline-edge)",
  );
  assert.equal(
    components[".ninaero-button--secondary, .ninaero-button--outline"][
      "border-color"
    ],
    undefined,
  );
  for (const mode of ["light", "dark"]) {
    assert.match(theme[mode]["button-paper-edge"], /^#[0-9a-f]{6}$/);
    assert.match(theme[mode]["button-outline-edge"], /^#[0-9a-f]{6}$/);
    assert.notEqual(
      theme[mode]["button-paper-edge"],
      theme[mode]["button-outline-edge"],
    );
  }
  for (const rules of Object.values(accentRules)) {
    assert.equal(rules["--button-paper-edge"], undefined);
    assert.equal(rules["--button-outline-edge"], undefined);
    assert.ok(rules["--button-primary-edge"]);
    assert.ok(rules["--button-focus"]);
  }
});

test("invalid Buttons have only a semantic material edge, without resting rings", async () => {
  const invalid = components[".ninaero-button[aria-invalid=true]"];
  assert.deepEqual(invalid, {
    "border-color": "var(--button-destructive-edge)",
  });
  assert.equal(components[".ninaero-button"].outline, "2px solid transparent");
  assert.equal(
    components[".ninaero-button:focus-visible"]["outline-color"],
    "var(--button-focus)",
  );
  const source = await readFile(
    new URL("../../../registry/ninaero/ui/button.tsx", import.meta.url),
    "utf8",
  );
  assert.ok(!source.includes("aria-invalid:ring"));
  assert.ok(!source.includes("aria-invalid:outline"));
  assert.ok(source.includes("{...props}"));
});

test("forced colors override the invalid edge while preserving keyboard focus", () => {
  const forced = components["@media (forced-colors: active)"];
  assert.equal(
    forced[".ninaero-button[aria-invalid=true]"]["border-color"],
    "ButtonText",
  );
  assert.equal(
    forced[".ninaero-button:focus-visible"]["outline-color"],
    "Highlight",
  );
  assert.equal(
    forced[
      ".ninaero-button:disabled, .ninaero-button[data-disabled], .ninaero-button[aria-disabled=true]"
    ]["border-color"],
    "GrayText",
  );
});

test("the published Button and theme include the updated borders and ring removal", async () => {
  const publishedTheme = JSON.parse(
    await readFile(
      new URL("../../../public/r/theme.json", import.meta.url),
      "utf8",
    ),
  );
  assert.deepEqual(publishedTheme.css, theme.css);
  for (const mode of ["light", "dark"]) {
    assert.equal(
      publishedTheme.cssVars[mode]["button-paper-edge"],
      theme[mode]["button-paper-edge"],
    );
    assert.equal(
      publishedTheme.cssVars[mode]["button-outline-edge"],
      theme[mode]["button-outline-edge"],
    );
  }
  const publishedButton = JSON.parse(
    await readFile(
      new URL("../../../public/r/button.json", import.meta.url),
      "utf8",
    ),
  );
  const source = publishedButton.files.find((file) =>
    file.path.endsWith("button.tsx"),
  ).content;
  assert.ok(!source.includes("aria-invalid:ring"));
});
