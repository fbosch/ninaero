import { realpath, readFile, stat } from "node:fs/promises";
import { posix, relative, resolve, sep } from "node:path";
import { gzipSync } from "node:zlib";

const DIAGNOSTICS_PATH = ".next/diagnostics/route-bundle-stats.json";
const CHUNK_DIRECTORY = ".next/static/chunks";

// Allow 5% headroom above the loading baseline, rounded up to 1 kB.
export const ROUTE_BUDGETS = Object.freeze({
  "/": Object.freeze({ raw: 884_000, gzip: 288_000 }),
  "/docs": Object.freeze({ raw: 852_000, gzip: 278_000 }),
  "/docs/[component]": Object.freeze({ raw: 895_000, gzip: 291_000 }),
  "/workshop/code-block": Object.freeze({ raw: 872_000, gzip: 283_000 }),
});

function validateBudgets(budgets) {
  if (!budgets || typeof budgets !== "object" || Array.isArray(budgets)) {
    throw new Error("Route JS budgets must be an object keyed by route.");
  }

  const entries = Object.entries(budgets);
  if (entries.length === 0) {
    throw new Error("At least one route JS budget is required.");
  }

  for (const [route, limits] of entries) {
    if (!route.startsWith("/") || !limits || typeof limits !== "object") {
      throw new Error(`Invalid JS budget for route ${JSON.stringify(route)}.`);
    }

    for (const metric of ["raw", "gzip"]) {
      if (!Number.isSafeInteger(limits[metric]) || limits[metric] <= 0) {
        throw new Error(
          `Invalid ${metric} JS budget for route ${route}; expected a positive finite byte limit.`,
        );
      }
    }
  }

  return entries.map(([route]) => route);
}

function isWithin(parent, candidate) {
  const fromParent = relative(parent, candidate);
  return (
    fromParent === "" ||
    (fromParent !== ".." && !fromParent.startsWith(`..${sep}`) && !posix.isAbsolute(fromParent))
  );
}

function validateChunkPath(route, chunkPath) {
  const valid =
    typeof chunkPath === "string" &&
    chunkPath.startsWith(`${CHUNK_DIRECTORY}/`) &&
    !chunkPath.includes("\\") &&
    !chunkPath.includes("\0") &&
    !posix.isAbsolute(chunkPath) &&
    posix.normalize(chunkPath) === chunkPath &&
    chunkPath.endsWith(".js") &&
    !chunkPath.split("/").some((part) => part === "" || part === "." || part === "..");

  if (!valid) {
    throw new Error(
      `Route ${route} has invalid chunk path ${JSON.stringify(chunkPath)}; expected a repo-relative ${CHUNK_DIRECTORY}/...js path without traversal.`,
    );
  }
}

async function readChunkAsset(projectRoot, route, chunkPath) {
  const absoluteAssetPath = resolve(projectRoot, ...chunkPath.split("/"));
  let realProjectRoot;
  let realChunkDirectory;
  let realAssetPath;

  try {
    realProjectRoot = await realpath(projectRoot);
    realChunkDirectory = await realpath(resolve(projectRoot, CHUNK_DIRECTORY));
    realAssetPath = await realpath(absoluteAssetPath);
  } catch (error) {
    if (error.code === "ENOENT") {
      throw new Error(
        `Route ${route} references missing chunk asset ${chunkPath}; the production build is incomplete, run pnpm build.`,
        { cause: error },
      );
    }
    throw new Error(`Route ${route} cannot resolve chunk asset ${chunkPath}: ${error.message}`, {
      cause: error,
    });
  }

  if (
    !isWithin(realProjectRoot, realChunkDirectory) ||
    !isWithin(realChunkDirectory, realAssetPath) ||
    realChunkDirectory === realAssetPath
  ) {
    throw new Error(
      `Route ${route} chunk asset ${chunkPath} resolves outside the production chunk directory; refusing to read it.`,
    );
  }

  try {
    const assetStat = await stat(realAssetPath);
    if (!assetStat.isFile()) {
      throw new Error("not a regular file");
    }
    return await readFile(realAssetPath);
  } catch (error) {
    throw new Error(`Route ${route} cannot read chunk asset ${chunkPath}: ${error.message}`, {
      cause: error,
    });
  }
}

async function measureRoutes(projectRoot, routes) {
  const statsPath = resolve(projectRoot, DIAGNOSTICS_PATH);
  let diagnosticsText;

  try {
    diagnosticsText = await readFile(statsPath, "utf8");
  } catch (error) {
    if (error.code === "ENOENT") {
      throw new Error(
        `Missing production route bundle diagnostics at ${statsPath}; run pnpm build before pnpm check:bundle-size.`,
        { cause: error },
      );
    }
    throw new Error(
      `Cannot read production route bundle diagnostics at ${statsPath}: ${error.message}`,
      { cause: error },
    );
  }

  let routeRecords;
  try {
    routeRecords = JSON.parse(diagnosticsText);
  } catch (error) {
    throw new Error(
      `Malformed production route bundle diagnostics at ${statsPath}: expected valid JSON (${error.message}).`,
      { cause: error },
    );
  }

  if (!Array.isArray(routeRecords)) {
    throw new Error(
      `Malformed production route bundle diagnostics at ${statsPath}: expected an array of route records.`,
    );
  }

  for (const record of routeRecords) {
    if (
      !record ||
      typeof record !== "object" ||
      Array.isArray(record) ||
      typeof record.route !== "string"
    ) {
      throw new Error(
        `Malformed production route bundle diagnostics at ${statsPath}: every route record must have a string route.`,
      );
    }
  }

  const projectMeasurements = {};

  for (const route of routes) {
    const matches = routeRecords.filter((record) => record.route === route);
    if (matches.length === 0) {
      throw new Error(
        `Missing required route record for ${route} in production diagnostics at ${statsPath}.`,
      );
    }
    if (matches.length > 1) {
      throw new Error(
        `Duplicate production route diagnostic records for ${route} at ${statsPath}.`,
      );
    }

    const record = matches[0];
    if (!Array.isArray(record.firstLoadChunkPaths) || record.firstLoadChunkPaths.length === 0) {
      throw new Error(
        `Route ${route} is missing firstLoadChunkPaths; refusing to report a zero JS size.`,
      );
    }
    if (
      !Number.isSafeInteger(record.firstLoadUncompressedJsBytes) ||
      record.firstLoadUncompressedJsBytes <= 0
    ) {
      throw new Error(
        `Route ${route} has invalid firstLoadUncompressedJsBytes; expected a positive safe integer.`,
      );
    }

    const uniquePaths = [...new Set(record.firstLoadChunkPaths)];
    let rawBytes = 0;
    let gzipBytes = 0;

    for (const chunkPath of uniquePaths) {
      validateChunkPath(route, chunkPath);
      const asset = await readChunkAsset(projectRoot, route, chunkPath);
      rawBytes += asset.byteLength;
      gzipBytes += gzipSync(asset, { level: 9 }).byteLength;
    }

    if (rawBytes === 0) {
      throw new Error(`Route ${route} has zero bytes across its first-load JS assets.`);
    }
    if (record.firstLoadUncompressedJsBytes !== rawBytes) {
      throw new Error(
        `Route ${route} diagnostics report ${record.firstLoadUncompressedJsBytes} first-load JS bytes, but its unique chunk assets total ${rawBytes} bytes.`,
      );
    }

    projectMeasurements[route] = {
      rawBytes,
      gzipBytes,
      uniqueAssetCount: uniquePaths.length,
    };
  }

  return projectMeasurements;
}

export async function checkRouteBundleBudgets({
  projectRoot = process.cwd(),
  budgets = ROUTE_BUDGETS,
} = {}) {
  const routes = validateBudgets(budgets);
  const measurements = await measureRoutes(projectRoot, routes);
  const violations = [];

  for (const [route, limits] of Object.entries(budgets)) {
    const measured = measurements[route];
    if (measured.rawBytes > limits.raw) {
      violations.push({
        route,
        metric: "raw",
        actualBytes: measured.rawBytes,
        budgetBytes: limits.raw,
      });
    }
    if (measured.gzipBytes > limits.gzip) {
      violations.push({
        route,
        metric: "gzip",
        actualBytes: measured.gzipBytes,
        budgetBytes: limits.gzip,
      });
    }
  }

  return { measurements, budgets, violations };
}

export function formatRouteBundleReport({ measurements, budgets, violations }) {
  const violationKeys = new Set(violations.map(({ route, metric }) => `${route}\0${metric}`));
  const lines = [
    "Initial JS only; excludes post-hydration lazy chunks. gzipSync(level 9) is summed per unique asset and is not measured HTTP transfer.",
  ];

  for (const [route, measured] of Object.entries(measurements)) {
    const status = violations.some((violation) => violation.route === route) ? "FAIL" : "PASS";
    const rawOperator = violationKeys.has(`${route}\0raw`) ? ">" : "<=";
    const gzipOperator = violationKeys.has(`${route}\0gzip`) ? ">" : "<=";
    lines.push(
      `${status} ${route}: raw JS ${measured.rawBytes.toLocaleString("en-US")} ${rawOperator} budget ${budgets[route].raw.toLocaleString("en-US")} bytes; gzip JS ${measured.gzipBytes.toLocaleString("en-US")} ${gzipOperator} budget ${budgets[route].gzip.toLocaleString("en-US")} bytes; ${measured.uniqueAssetCount} unique chunks.`,
    );
  }

  return lines.join("\n");
}
