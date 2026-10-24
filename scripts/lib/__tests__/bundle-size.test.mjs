import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { gzipSync } from "node:zlib";

import { checkRouteBundleBudgets, ROUTE_BUDGETS } from "../bundle-size.mjs";

const diagnosticsPath = ".next/diagnostics/route-bundle-stats.json";
const cliPath = fileURLToPath(new URL("../../check-bundle-size.mjs", import.meta.url));

function bytes(value) {
  return Buffer.isBuffer(value) ? value : Buffer.from(value);
}

function routeRecord(route, chunkPaths, assets) {
  const uniquePaths = [...new Set(chunkPaths)];
  return {
    route,
    firstLoadChunkPaths: chunkPaths,
    firstLoadUncompressedJsBytes: uniquePaths.reduce(
      (total, chunkPath) => total + bytes(assets[chunkPath]).byteLength,
      0,
    ),
  };
}

async function createBuildFixture(t, { records = [], assets = {}, diagnosticsText } = {}) {
  const projectRoot = await mkdtemp(join(tmpdir(), "ninaero-route-bundle-"));
  t.after(() => rm(projectRoot, { recursive: true, force: true }));

  for (const [chunkPath, content] of Object.entries(assets)) {
    const assetPath = join(projectRoot, ...chunkPath.split("/"));
    await mkdir(dirname(assetPath), { recursive: true });
    await writeFile(assetPath, content);
  }

  if (diagnosticsText !== undefined) {
    await mkdir(dirname(join(projectRoot, diagnosticsPath)), { recursive: true });
    await writeFile(join(projectRoot, diagnosticsPath), diagnosticsText);
  } else if (records !== null) {
    const statsPath = join(projectRoot, diagnosticsPath);
    await mkdir(dirname(statsPath), { recursive: true });
    await writeFile(statsPath, JSON.stringify(records));
  }

  return projectRoot;
}

test("sums unique shared assets per route and gzips each asset independently at level 9", async (t) => {
  const sharedPath = ".next/static/chunks/shared.js";
  const homePath = ".next/static/chunks/home.js";
  const docsPath = ".next/static/chunks/docs.js";
  const assets = {
    [sharedPath]: Buffer.from("shared client runtime"),
    [homePath]: Buffer.from("home route code"),
    [docsPath]: Buffer.from("documentation route code"),
  };
  const projectRoot = await createBuildFixture(t, {
    assets,
    records: [
      routeRecord("/", [sharedPath, homePath, sharedPath], assets),
      routeRecord("/docs", [sharedPath, docsPath], assets),
    ],
  });

  const { measurements } = await checkRouteBundleBudgets({
    projectRoot,
    budgets: {
      "/": { raw: 1_000, gzip: 1_000 },
      "/docs": { raw: 1_000, gzip: 1_000 },
    },
  });
  const expectedRaw = (paths) =>
    [...new Set(paths)].reduce((total, chunkPath) => total + assets[chunkPath].byteLength, 0);
  const expectedGzip = (paths) =>
    [...new Set(paths)].reduce(
      (total, chunkPath) => total + gzipSync(assets[chunkPath], { level: 9 }).byteLength,
      0,
    );

  assert.deepEqual(measurements["/"], {
    rawBytes: expectedRaw([sharedPath, homePath, sharedPath]),
    gzipBytes: expectedGzip([sharedPath, homePath, sharedPath]),
    uniqueAssetCount: 2,
  });
  assert.deepEqual(measurements["/docs"], {
    rawBytes: expectedRaw([sharedPath, docsPath]),
    gzipBytes: expectedGzip([sharedPath, docsPath]),
    uniqueAssetCount: 2,
  });
});

test("accepts measurements exactly equal to both route limits", async (t) => {
  const chunkPath = ".next/static/chunks/exact.js";
  const assets = { [chunkPath]: Buffer.from("same bytes") };
  const projectRoot = await createBuildFixture(t, {
    assets,
    records: [routeRecord("/", [chunkPath], assets)],
  });
  const rawBytes = assets[chunkPath].byteLength;
  const gzipBytes = gzipSync(assets[chunkPath], { level: 9 }).byteLength;

  const result = await checkRouteBundleBudgets({
    projectRoot,
    budgets: { "/": { raw: rawBytes, gzip: gzipBytes } },
  });

  assert.equal(result.violations.length, 0);
  assert.equal(result.measurements["/"].rawBytes, rawBytes);
  assert.equal(result.measurements["/"].gzipBytes, gzipBytes);
});

test("reports a raw-byte overage without conflating it with gzip", async (t) => {
  const chunkPath = ".next/static/chunks/raw.js";
  const assets = { [chunkPath]: Buffer.from("raw metric content") };
  const projectRoot = await createBuildFixture(t, {
    assets,
    records: [routeRecord("/", [chunkPath], assets)],
  });
  const rawBytes = assets[chunkPath].byteLength;
  const gzipBytes = gzipSync(assets[chunkPath], { level: 9 }).byteLength;

  const result = await checkRouteBundleBudgets({
    projectRoot,
    budgets: { "/": { raw: rawBytes - 1, gzip: gzipBytes + 1 } },
  });

  assert.deepEqual(result.violations, [
    { route: "/", metric: "raw", actualBytes: rawBytes, budgetBytes: rawBytes - 1 },
  ]);
});

test("reports a gzip overage without conflating it with raw bytes", async (t) => {
  const chunkPath = ".next/static/chunks/gzip.js";
  const assets = { [chunkPath]: Buffer.from("gzip metric content") };
  const projectRoot = await createBuildFixture(t, {
    assets,
    records: [routeRecord("/", [chunkPath], assets)],
  });
  const rawBytes = assets[chunkPath].byteLength;
  const gzipBytes = gzipSync(assets[chunkPath], { level: 9 }).byteLength;

  const result = await checkRouteBundleBudgets({
    projectRoot,
    budgets: { "/": { raw: rawBytes + 1, gzip: gzipBytes - 1 } },
  });

  assert.deepEqual(result.violations, [
    { route: "/", metric: "gzip", actualBytes: gzipBytes, budgetBytes: gzipBytes - 1 },
  ]);
});

test("rejects a missing required route instead of treating it as zero bytes", async (t) => {
  const projectRoot = await createBuildFixture(t, { records: [] });

  await assert.rejects(
    checkRouteBundleBudgets({ projectRoot, budgets: { "/": { raw: 100, gzip: 100 } } }),
    /Missing required route record for \/ in production diagnostics/,
  );
});

test("rejects a referenced chunk asset missing from the production build", async (t) => {
  const chunkPath = ".next/static/chunks/missing.js";
  const projectRoot = await createBuildFixture(t, {
    records: [{ route: "/", firstLoadChunkPaths: [chunkPath], firstLoadUncompressedJsBytes: 1 }],
  });

  await assert.rejects(
    checkRouteBundleBudgets({ projectRoot, budgets: { "/": { raw: 100, gzip: 100 } } }),
    /Route \/ references missing chunk asset \.next\/static\/chunks\/missing\.js/,
  );
});

test("rejects absent, malformed, and incomplete route diagnostics", async (t) => {
  const missingBuild = await createBuildFixture(t, { records: null });
  await assert.rejects(
    checkRouteBundleBudgets({
      projectRoot: missingBuild,
      budgets: { "/": { raw: 100, gzip: 100 } },
    }),
    /Missing production route bundle diagnostics.*pnpm build/,
  );

  const invalidJson = await createBuildFixture(t, { diagnosticsText: "{not json" });
  await assert.rejects(
    checkRouteBundleBudgets({
      projectRoot: invalidJson,
      budgets: { "/": { raw: 100, gzip: 100 } },
    }),
    /Malformed production route bundle diagnostics.*expected valid JSON/,
  );

  const invalidShape = await createBuildFixture(t, {
    diagnosticsText: JSON.stringify({ routes: [] }),
  });
  await assert.rejects(
    checkRouteBundleBudgets({
      projectRoot: invalidShape,
      budgets: { "/": { raw: 100, gzip: 100 } },
    }),
    /expected an array of route records/,
  );

  const emptyChunkList = await createBuildFixture(t, {
    records: [{ route: "/", firstLoadChunkPaths: [], firstLoadUncompressedJsBytes: 0 }],
  });
  await assert.rejects(
    checkRouteBundleBudgets({
      projectRoot: emptyChunkList,
      budgets: { "/": { raw: 100, gzip: 100 } },
    }),
    /Route \/ is missing firstLoadChunkPaths; refusing to report a zero JS size/,
  );

  const missingRawByteCountPath = ".next/static/chunks/missing-metadata.js";
  const incompleteRecord = await createBuildFixture(t, {
    assets: { [missingRawByteCountPath]: Buffer.from("present asset") },
    records: [{ route: "/", firstLoadChunkPaths: [missingRawByteCountPath] }],
  });
  await assert.rejects(
    checkRouteBundleBudgets({
      projectRoot: incompleteRecord,
      budgets: { "/": { raw: 100, gzip: 100 } },
    }),
    /Route \/ has invalid firstLoadUncompressedJsBytes/,
  );
});

test("rejects invalid or escaping chunk paths from diagnostics", async (t) => {
  const invalidPaths = [
    ".next/static/chunks/../outside.js",
    ".next/static/other.js",
    "/tmp/outside.js",
    ".next/static/chunks\\outside.js",
  ];

  for (const chunkPath of invalidPaths) {
    const projectRoot = await createBuildFixture(t, {
      records: [{ route: "/", firstLoadChunkPaths: [chunkPath], firstLoadUncompressedJsBytes: 1 }],
    });
    await assert.rejects(
      checkRouteBundleBudgets({ projectRoot, budgets: { "/": { raw: 100, gzip: 100 } } }),
      /Route \/ has invalid chunk path/,
      chunkPath,
    );
  }
});

test("CLI fails with route and metric evidence when a route exceeds budget", async (t) => {
  const assets = {};
  const records = Object.entries(ROUTE_BUDGETS).map(([route, budget], index) => {
    const chunkPath = `.next/static/chunks/route-${index}.js`;
    const targetBytes = route === "/" ? budget.raw + 1 : 20;
    assets[chunkPath] =
      route === "/"
        ? Buffer.from(`/*${"x".repeat(targetBytes - 4)}*/`)
        : Buffer.from(`export const route${index} = 1;`);
    return routeRecord(route, [chunkPath], assets);
  });
  const projectRoot = await createBuildFixture(t, { records, assets });
  const result = spawnSync(process.execPath, [cliPath], {
    cwd: projectRoot,
    encoding: "utf8",
  });
  const output = `${result.stdout}${result.stderr}`;

  assert.equal(result.status, 1, output);
  assert.match(output, /Initial JS only; excludes post-hydration lazy chunks/);
  assert.match(output, /not measured HTTP transfer/);
  const limit = ROUTE_BUDGETS["/"].raw;
  assert.ok(
    output.includes(
      `FAIL /: raw JS ${(limit + 1).toLocaleString("en-US")} > budget ${limit.toLocaleString("en-US")} bytes`,
    ),
    output,
  );
});

test("CLI explains how to recover when no production build exists", async (t) => {
  const projectRoot = await createBuildFixture(t, { records: null });
  const result = spawnSync(process.execPath, [cliPath], {
    cwd: projectRoot,
    encoding: "utf8",
  });
  const output = `${result.stdout}${result.stderr}`;

  assert.equal(result.status, 1, output);
  assert.match(output, /Missing production route bundle diagnostics/);
  assert.match(output, /pnpm build/);
});
