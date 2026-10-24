import assert from "node:assert/strict";
import test from "node:test";
import { setImmediate } from "node:timers/promises";

import { createSearchLoader, isSearchShortcut } from "../site-search-loader.mjs";

test("search loads on intent and reuses the in-flight module for activation", async () => {
  const load = Promise.withResolvers();
  const delivered = [];
  let loads = 0;
  const loader = createSearchLoader(() => {
    loads++;
    return load.promise;
  });
  assert.equal(loads, 0);
  const preloaded = loader.preload();
  assert.equal(loader.preload(), preloaded);
  assert.equal(
    loader.open((module) => delivered.push(module), assert.fail),
    true,
  );
  assert.equal(loader.open(assert.fail, assert.fail), false);

  const searchModule = { search: "ready" };
  load.resolve(searchModule);
  await setImmediate();
  assert.equal(loads, 1);
  assert.deepEqual(delivered, [searchModule]);
  assert.equal(await loader.preload(), searchModule);
});

test("Escape or unmount cancels activation without discarding a completed download", async () => {
  const load = Promise.withResolvers();
  const loader = createSearchLoader(() => load.promise);
  loader.open(assert.fail, assert.fail);
  assert.equal(loader.cancel(), true);
  assert.equal(loader.cancel(), false);
  load.resolve("search");
  await setImmediate();

  const ready = Promise.withResolvers();
  loader.open(ready.resolve, ready.reject);
  assert.equal(await ready.promise, "search");
});

test("cancel and reopen while loading delivers only the latest activation", async () => {
  const load = Promise.withResolvers();
  const loader = createSearchLoader(() => load.promise);
  loader.open(assert.fail, assert.fail);
  loader.cancel();
  const ready = Promise.withResolvers();
  assert.equal(loader.open(ready.resolve, ready.reject), true);
  load.resolve("search");
  assert.equal(await ready.promise, "search");
});

test("failed activation reports its error and allows a fresh retry", async () => {
  const failure = new Error("Download failed");
  let loads = 0;
  const loader = createSearchLoader(() => {
    if (++loads === 1) throw failure;
    return Promise.resolve("search");
  });
  const failed = Promise.withResolvers();
  loader.open(assert.fail, failed.resolve);
  assert.equal(await failed.promise, failure);

  const ready = Promise.withResolvers();
  assert.equal(loader.open(ready.resolve, ready.reject), true);
  assert.equal(await ready.promise, "search");
  assert.equal(loads, 2);
});

test("failed speculation retries on activation and canceled failures stay silent", async () => {
  let loads = 0;
  const failedLoad = Promise.withResolvers();
  const loader = createSearchLoader(() =>
    ++loads === 1 ? failedLoad.promise : Promise.resolve("search"),
  );
  const speculative = loader.preload();
  loader.open(assert.fail, assert.fail);
  loader.cancel();
  failedLoad.reject(new Error("Download failed"));
  await assert.rejects(speculative, /Download failed/);
  await setImmediate();

  const ready = Promise.withResolvers();
  loader.open(ready.resolve, ready.reject);
  assert.equal(await ready.promise, "search");
  assert.equal(loads, 2);
});

test("search shortcut accepts Ctrl or Meta K and preserves editing and handled events", () => {
  const event = {
    key: "k",
    ctrlKey: true,
    metaKey: false,
    altKey: false,
    shiftKey: false,
    repeat: false,
    isComposing: false,
    defaultPrevented: false,
  };
  assert.equal(isSearchShortcut(event), true);
  assert.equal(isSearchShortcut({ ...event, ctrlKey: false, metaKey: true, key: "K" }), true);
  for (const overrides of [
    { ctrlKey: false },
    { key: "j" },
    { altKey: true },
    { shiftKey: true },
    { repeat: true },
    { isComposing: true },
    { defaultPrevented: true },
  ]) {
    assert.equal(isSearchShortcut({ ...event, ...overrides }), false, JSON.stringify(overrides));
  }
});
