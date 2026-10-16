import assert from "node:assert/strict";
import { EventEmitter, once } from "node:events";
import { mkdir, mkdtemp, readFile, rename, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { setTimeout as delay } from "node:timers/promises";

import { watchRegistry } from "../dev-watch.mjs";

async function fixture(t) {
  const root = await mkdtemp(join(tmpdir(), "ninaero-dev-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  for (const directory of [
    "registry/ninaero/ui",
    "scripts/lib",
    "components/overview",
    "lib",
    "app",
    "generated",
    "public/r",
  ]) {
    await mkdir(join(root, directory), { recursive: true });
  }
  return root;
}

function nextEvent(events, name) {
  return once(events, name, { signal: AbortSignal.timeout(5000) });
}

test("source saves and atomic replacements rebuild without watching generated outputs", async (t) => {
  const root = await fixture(t);
  const events = new EventEmitter();
  const errors = [];
  let builds = 0;
  const watcher = watchRegistry({
    root,
    debounceMs: 20,
    async build() {
      builds++;
      await writeFile(join(root, "app/globals.css"), `build ${builds}`);
      await writeFile(join(root, "generated/component-docs.json"), "{}");
      await writeFile(join(root, "registry.json"), "{}");
      await writeFile(join(root, "public/r/theme.json"), "{}");
      events.emit("built");
    },
    onError: (error) => errors.push(error),
    onWatchError: (error) => errors.push(error),
  });
  t.after(() => watcher.close());
  await watcher.ready;
  assert.equal(builds, 1);

  for (const path of [
    "registry/ninaero/theme.mjs",
    "registry/ninaero/accents.mjs",
    "registry/ninaero/catalog.json",
    "registry/ninaero/ui/button.tsx",
    "scripts/lib/theme.mjs",
    "components/overview/control-previews.tsx",
    "lib/icons.tsx",
    "package.json",
  ]) {
    const built = nextEvent(events, "built");
    await writeFile(join(root, path), "updated");
    await built;
  }

  const replaced = nextEvent(events, "built");
  await writeFile(join(root, "replacement.tmp"), "replacement");
  await rename(join(root, "replacement.tmp"), join(root, "registry/ninaero/theme.mjs"));
  await replaced;
  assert.equal(await readFile(join(root, "registry/ninaero/theme.mjs"), "utf8"), "replacement");

  await delay(100);
  const settled = builds;
  await delay(150);
  assert.equal(builds, settled, "generated files must not cause a rebuild loop");
  assert.deepEqual(errors, []);

  watcher.close();
  await writeFile(join(root, "registry/ninaero/theme.mjs"), "after close");
  await delay(100);
  assert.equal(builds, settled);
});

test("saves during a build queue a serial rebuild, and failed rebuilds recover", async (t) => {
  const root = await fixture(t);
  const source = join(root, "registry/ninaero/theme.mjs");
  await writeFile(source, "initial");
  const events = new EventEmitter();
  const errors = [];
  let release;
  let block = false;
  let active = 0;
  let maxActive = 0;
  let current;
  const watcher = watchRegistry({
    root,
    debounceMs: 20,
    async build() {
      active++;
      maxActive = Math.max(maxActive, active);
      try {
        const value = await readFile(source, "utf8");
        events.emit("started");
        if (block) {
          block = false;
          await new Promise((resolve) => {
            release = resolve;
          });
        }
        if (value === "invalid") throw new Error("Invalid theme");
        current = value;
        events.emit("built");
      } finally {
        active--;
      }
    },
    onError(error) {
      errors.push(error);
      events.emit("failed");
    },
    onWatchError: (error) => errors.push(error),
  });
  t.after(() => watcher.close());
  await watcher.ready;
  assert.equal(current, "initial");

  block = true;
  const started = nextEvent(events, "started");
  await writeFile(source, "first");
  await started;
  await writeFile(source, "latest");
  await delay(80);
  const rebuilt = nextEvent(events, "built");
  release();
  await rebuilt;
  // The queued build follows immediately after the blocked build.
  const latest = current === "latest" ? undefined : nextEvent(events, "built");
  if (latest) await latest;
  assert.equal(current, "latest");
  assert.equal(maxActive, 1);

  const failed = nextEvent(events, "failed");
  await writeFile(source, "invalid");
  await failed;
  assert.equal(errors.length, 1);
  assert.match(errors[0].message, /Invalid theme/);

  const recovered = nextEvent(events, "built");
  await writeFile(source, "fixed");
  await recovered;
  assert.equal(current, "fixed");
});

test("an initial generation failure rejects startup", async (t) => {
  const root = await fixture(t);
  const watcher = watchRegistry({
    root,
    build: async () => {
      throw new Error("Invalid initial theme");
    },
    onError: assert.fail,
    onWatchError: assert.fail,
  });
  t.after(() => watcher.close());
  await assert.rejects(watcher.ready, /Invalid initial theme/);
});
