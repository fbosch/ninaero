import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { accentRules } from "../../../registry/ninaero/accents.mjs";
import {
  buttonRecessShadow,
  elevations,
  theme,
} from "../../../registry/ninaero/theme.mjs";
import { renderThemeCss } from "../theme.mjs";

const components = theme.css["@layer components"];
const layers = (recipe) =>
  recipe.split(", ").map((layer) => {
    const [x, y, blur] = layer.split(" ").map(Number.parseFloat);
    const opacity = Number(layer.match(/\/ ([\d.]+)\)/)[1]);
    return { x, y, blur, opacity };
  });

test("every elevation uses layered shadows with one overhead light direction", () => {
  let previous;
  for (const recipe of Object.values(elevations)) {
    const current = layers(recipe);
    assert.equal(current.length, 3);
    assert.ok(!recipe.includes("inset"));
    assert.ok(!recipe.includes("button-"));
    assert.ok(recipe.includes("hsl(var(--shadow-color)"));
    current.forEach((layer, index) => {
      assert.equal(layer.x, 0);
      assert.ok(layer.y > 0 && layer.blur > 0);
      assert.ok(layer.opacity > 0 && layer.opacity < 1);
      if (index > 0) {
        assert.ok(layer.y > current[index - 1].y);
        assert.ok(layer.blur > current[index - 1].blur);
        assert.ok(layer.opacity < current[index - 1].opacity);
      }
      if (previous) {
        assert.ok(layer.y >= previous[index].y);
        assert.ok(layer.blur >= previous[index].blur);
        assert.ok(layer.opacity < previous[index].opacity);
      }
    });
    if (previous) assert.ok(current.at(-1).y > previous.at(-1).y);
    previous = current;
  }
});

test("control cast shadows soften their falloff without losing depth", () => {
  const control = layers(elevations.control);
  control.forEach((layer) => {
    assert.ok(layer.blur >= layer.y * 2);
  });
  assert.ok(Math.max(...control.map((layer) => layer.y)) <= 4);
  assert.ok(Math.max(...control.map((layer) => layer.blur)) <= 10);
  const overlappingOpacity =
    1 -
    control.reduce((remaining, layer) => remaining * (1 - layer.opacity), 1);
  assert.ok(overlappingOpacity >= 0.25 && overlappingOpacity <= 0.35);
});

test("all raised Buttons share the same cast shadow, with independent material bevels", () => {
  for (const variant of ["primary", "secondary", "destructive"]) {
    const shadow = components[`.ninaero-button--${variant}`]["box-shadow"];
    assert.ok(shadow.startsWith("inset 0 1px 0"));
    assert.ok(shadow.endsWith(elevations.control));
  }
  for (const variant of ["outline", "ghost", "link"]) {
    assert.equal(
      components[`.ninaero-button--${variant}`]["box-shadow"],
      undefined,
    );
  }
  assert.equal(
    components[".ninaero-button--secondary, .ninaero-button--outline"][
      "box-shadow"
    ],
    undefined,
  );
});

test("shadow colors belong to receiving surfaces, not accent or destructive fills", () => {
  for (const mode of ["light", "dark"]) {
    const palette = theme[mode];
    assert.match(palette["shadow-color"], /^\d+deg \d+% \d+%$/);
    assert.match(palette["shadow-color-paper"], /^\d+deg \d+% \d+%$/);
    assert.notEqual(palette["shadow-color"], palette["shadow-color-paper"]);
    assert.equal(palette["button-shadow"], undefined);
    assert.equal(palette["button-destructive-shadow"], undefined);
  }
  assert.notEqual(theme.light["shadow-color"], theme.dark["shadow-color"]);
  assert.equal(
    components[".ninaero-surface-paper"]["--shadow-color"],
    "var(--shadow-color-paper)",
  );
  for (const rules of Object.values(accentRules)) {
    assert.ok(Object.keys(rules).every((key) => !key.includes("shadow")));
  }
});

test("pressing collapses cast shadows while reduced motion keeps static feedback", () => {
  const pressSelector = Object.keys(components).find((key) =>
    key.startsWith(".ninaero-button:active"),
  );
  assert.equal(components[pressSelector]["box-shadow"], buttonRecessShadow);
  for (const variant of ["primary", "secondary", "destructive"]) {
    const pressed = Object.entries(components).find(([key]) =>
      key.startsWith(`.ninaero-button--${variant}:active`),
    )[1];
    assert.equal(pressed["background-image"], "none");
    assert.equal(pressed["box-shadow"], undefined);
    assert.ok(pressed["background-color"]);
  }
  assert.equal(
    components["@media (prefers-reduced-motion: reduce)"][".ninaero-button"][
      "--button-press-shift"
    ],
    "0px",
  );
  const forced = components["@media (forced-colors: active)"];
  assert.equal(forced[pressSelector]["box-shadow"], "none");
  const disabled = Object.entries(components).find(([key]) =>
    key.startsWith(".ninaero-button:disabled"),
  )[1];
  assert.equal(disabled["box-shadow"], "none");
  assert.equal(
    components["@media (forced-colors: active)"][".ninaero-button"][
      "box-shadow"
    ],
    "none",
  );
});

test("existing shadow utilities use the finite shared scale and resolve surface color locally", () => {
  assert.equal(theme.theme["shadow-sm"], elevations.control);
  for (const utility of ["shadow-md", "shadow-lg"]) {
    assert.equal(theme.theme[utility], elevations.floating);
  }
  for (const utility of ["shadow-xl", "shadow-2xl"]) {
    assert.equal(theme.theme[utility], elevations.dialog);
  }
  const css = renderThemeCss(theme);
  assert.ok(css.includes("@theme inline"));
  assert.ok(css.includes(`--shadow-md: ${elevations.floating};`));
  assert.ok(css.includes(`--shadow-xl: ${elevations.dialog};`));
});

test("modals are elevated above menus and the chart tooltip", async () => {
  for (const [name, utility] of [
    ["dialog", "shadow-xl"],
    ["alert-dialog", "shadow-xl"],
    ["sheet", "shadow-xl"],
    ["popover", "shadow-md"],
    ["chart", "shadow-md"],
  ]) {
    const source = await readFile(
      new URL(`../../../registry/ninaero/ui/${name}.tsx`, import.meta.url),
      "utf8",
    );
    assert.ok(source.includes(utility), name);
  }
});

test("registry publication includes the same elevations and receiving-surface rule", async () => {
  const published = JSON.parse(
    await readFile(
      new URL("../../../public/r/theme.json", import.meta.url),
      "utf8",
    ),
  );
  assert.deepEqual(published.css, theme.css);
  assert.deepEqual(published.cssVars.theme, theme.theme);
  const specimen = await readFile(
    new URL("../../../components/examples/button-preview.tsx", import.meta.url),
    "utf8",
  );
  assert.ok(specimen.includes("ninaero-surface-paper"));
});
