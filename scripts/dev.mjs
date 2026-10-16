import { spawn } from "node:child_process";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

import { watchRegistry } from "./lib/dev-watch.mjs";

const require = createRequire(import.meta.url);
const root = fileURLToPath(new URL("../", import.meta.url));
const children = new Set();
let registryWatch;
let stopping = false;

function stop(code, signal = "SIGTERM") {
  if (stopping) return;
  stopping = true;
  process.exitCode = code;
  registryWatch?.close();
  for (const child of children) {
    child.kill(signal);
    const timeout = setTimeout(() => child.kill("SIGKILL"), 5000);
    timeout.unref();
    child.once("exit", () => clearTimeout(timeout));
  }
}

function run(args) {
  if (stopping) return Promise.resolve(0);
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, args, { cwd: root, stdio: "inherit" });
    children.add(child);
    child.once("error", (error) => {
      children.delete(child);
      reject(error);
    });
    child.once("exit", (code, signal) => {
      children.delete(child);
      if (code === 0 || stopping) resolve(code ?? 0);
      else reject(new Error(`${args[0]} exited with ${signal ?? `code ${code}`}.`));
    });
  });
}

process.once("SIGINT", () => stop(130, "SIGINT"));
process.once("SIGTERM", () => stop(143));

try {
  registryWatch = watchRegistry({
    root,
    async build() {
      await run(["scripts/build-registry.mjs"]);
      await run([require.resolve("shadcn"), "build"]);
      if (!stopping) console.log("[dev] Registry updated. Watching for source changes.");
    },
    onError(error) {
      console.error("[dev] Registry rebuild failed. Save a source file to retry.", error);
    },
    onWatchError(error) {
      console.error("[dev] Source watcher failed.", error);
      stop(1);
    },
  });
  await registryWatch.ready;
  if (!stopping) {
    await run([require.resolve("next/dist/bin/next"), "dev", ...process.argv.slice(2)]);
    stop(0);
  }
} catch (error) {
  if (!stopping) {
    console.error("[dev]", error);
    stop(1);
  }
}
