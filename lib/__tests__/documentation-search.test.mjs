import assert from "node:assert/strict";
import test from "node:test";

import { documentationGuides, findDocumentation } from "../documentation-search.mjs";

const components = [
  { title: "Alert Dialog", description: "Confirm an action.", href: "/docs/alert-dialog" },
  { title: "Dialog", description: "A modal with managed keyboard focus.", href: "/docs/dialog" },
  {
    title: "Input OTP",
    description: "One cell per character of a verification code.",
    href: "/docs/input-otp",
    keywords: ["input-otp"],
  },
];

test("search matches titles, descriptions, and aliases regardless of case or surrounding whitespace", () => {
  assert.equal(findDocumentation(components, "  DIALOG  ").length, 2);
  assert.equal(findDocumentation(components, "KEYBOARD")[0].href, "/docs/dialog");
  assert.equal(findDocumentation(components, "input-otp")[0].href, "/docs/input-otp");
});

test("all search terms must match and can span a title and its description", () => {
  assert.deepEqual(
    findDocumentation(components, " dialog   keyboard ").map((entry) => entry.href),
    ["/docs/dialog"],
  );
  assert.deepEqual(findDocumentation(components, "dialog verification"), []);
});

test("an exact title precedes longer titles and empty search preserves the available entries", () => {
  assert.deepEqual(
    findDocumentation(components, "dialog").map((entry) => entry.href),
    ["/docs/dialog", "/docs/alert-dialog"],
  );
  assert.deepEqual(findDocumentation(components, " \n\t "), components);
});

test("search treats markup, URL schemes, and pattern characters as literal text", () => {
  for (const query of [
    "<script>alert(1)</script>",
    "javascript:alert(1)",
    ".*",
    "[",
    "__proto__",
  ]) {
    assert.deepEqual(findDocumentation(components, query), []);
  }
});

test("guide searches lead to installation, theme, and pattern documentation", () => {
  assert.equal(findDocumentation(documentationGuides, "setup")[0].href, "/docs#docs-quick-start");
  assert.equal(findDocumentation(documentationGuides, "dark tokens")[0].href, "/docs/theme");
  assert.equal(findDocumentation(documentationGuides, "patterns")[0].title, "Patterns");
  assert.equal(findDocumentation(documentationGuides, "paper grid")[0].href, "/docs/patterns");
  assert.deepEqual(findDocumentation(documentationGuides, "unknown-topic"), []);
});

test("overlay searches lead directly to the site-wide Patterns guide", () => {
  for (const query of ["overlay", "pattern overlay", "overlay screen"]) {
    assert.equal(
      findDocumentation(documentationGuides, query)[0].href,
      "/docs/patterns#site-wide-overlays",
    );
  }
});
