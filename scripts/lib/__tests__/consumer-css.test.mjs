import assert from "node:assert/strict";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { gzipSync } from "node:zlib";

import { compile } from "tailwindcss";

import { buildConsumerCss } from "../consumer-css.mjs";

const stylesheet = `@theme { --color-primary: red; --spacing: 0.25rem; }
@tailwind utilities;
.greeting::before { content: "æøå"; }`;

test("consumer CSS reports UTF-8, minified, and gzipped byte counts", async () => {
  const base = await mkdtemp(join(tmpdir(), "ninaero-css-size-"));
  try {
    await writeFile(join(base, "consumer.tsx"), '<div className="bg-primary p-2" />');
    const result = buildConsumerCss(await compile(stylesheet), base);
    assert.equal(result.sizes.compiled, Buffer.byteLength(result.css));
    assert.equal(result.sizes.minified, Buffer.byteLength(result.minified));
    assert.equal(result.sizes.gzip, gzipSync(result.minified).byteLength);
    assert.ok(result.sizes.compiled > result.css.length);
    assert.ok(result.sizes.minified < result.sizes.compiled);
  } finally {
    await rm(base, { recursive: true, force: true });
  }
});

test("consumer CSS scans installed TypeScript and TSX sources", async () => {
  const base = await mkdtemp(join(tmpdir(), "ninaero-css-scan-"));
  try {
    const initial = buildConsumerCss(await compile(stylesheet), base);
    await writeFile(join(base, "component.tsx"), '<div className="bg-primary" />');
    const component = buildConsumerCss(await compile(stylesheet), base);
    await writeFile(join(base, "hook.ts"), 'export const padding = "p-2";');
    const hook = buildConsumerCss(await compile(stylesheet), base);
    assert.ok(component.sizes.compiled > initial.sizes.compiled);
    assert.ok(hook.sizes.compiled > component.sizes.compiled);
  } finally {
    await rm(base, { recursive: true, force: true });
  }
});
