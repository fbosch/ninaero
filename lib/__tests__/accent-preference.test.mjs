import assert from "node:assert/strict";
import test from "node:test";
import vm from "node:vm";

import {
  accentNames,
  accentStorageKey,
  defaultAccent,
  isAccent,
} from "../../registry/ninaero/accents.mjs";
import { accentBootstrap, readAccent, saveAccent } from "../accent-preference.mjs";

test("accent preference round-trips all presets with an independent storage key", () => {
  const values = new Map([["ninaero-color-mode", "dark"]]);
  const storage = {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
  };
  for (const accent of accentNames) {
    assert.equal(saveAccent(storage, accent), true);
    assert.equal(readAccent(storage), accent);
    assert.equal(values.get("ninaero-color-mode"), "dark");
    assert.equal(values.get(accentStorageKey), accent);
  }
});

test("absent, invalid, and prototype-name preferences resolve to the default", () => {
  for (const value of [
    null,
    "",
    "unknown",
    "leaf",
    "coral",
    "__proto__",
    "constructor",
    "<script>alert(1)</script>",
  ]) {
    assert.equal(isAccent(value), false);
    assert.equal(readAccent({ getItem: () => value }), defaultAccent);
  }
  assert.throws(() => saveAccent({ setItem() {} }, "__proto__"), /Unknown accent/);
});

test("blocked reads use the default and failed saves report failure", () => {
  const storage = {
    getItem() {
      throw new Error("Storage blocked");
    },
    setItem() {
      throw new Error("Storage full");
    },
  };
  assert.equal(readAccent(storage), defaultAccent);
  assert.equal(saveAccent(storage, "indigo"), false);
});

test("pre-paint bootstrap restores only allowlisted accents without changing color mode", () => {
  for (const stored of [...accentNames, null, "invalid", 'lavender";globalThis.injected=true;//']) {
    const document = { documentElement: { dataset: {}, className: "dark" } };
    const context = vm.createContext({
      document,
      localStorage: {
        getItem: (key) => {
          assert.equal(key, accentStorageKey);
          return stored;
        },
      },
    });
    vm.runInContext(accentBootstrap, context);
    assert.equal(
      document.documentElement.dataset.accent,
      isAccent(stored) ? stored : defaultAccent,
    );
    assert.equal(document.documentElement.className, "dark");
    assert.equal(context.injected, undefined);
  }
});

test("pre-paint bootstrap works when accessing localStorage itself throws", () => {
  const document = { documentElement: { dataset: {} } };
  const context = vm.createContext({ document });
  Object.defineProperty(context, "localStorage", {
    get() {
      throw new Error("Blocked");
    },
  });
  vm.runInContext(accentBootstrap, context);
  assert.equal(document.documentElement.dataset.accent, defaultAccent);
});
