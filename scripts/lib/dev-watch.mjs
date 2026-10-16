import { watch } from "node:fs";
import { join } from "node:path";

export function watchRegistry({ root, build, onError, onWatchError, debounceMs = 100 }) {
  const watchers = [];
  let timer;
  let running = false;
  let pending = false;
  let closed = false;

  function close() {
    closed = true;
    clearTimeout(timer);
    for (const watcher of watchers) watcher.close();
  }

  async function rebuild() {
    if (closed || running) return;
    running = true;
    try {
      do {
        clearTimeout(timer);
        pending = false;
        await build();
      } while (pending && !closed);
    } finally {
      running = false;
      if (pending && !closed) schedule();
    }
  }

  function schedule() {
    if (closed) return;
    pending = true;
    clearTimeout(timer);
    timer = setTimeout(() => {
      void rebuild().catch(onError);
    }, debounceMs);
  }

  try {
    for (const directory of ["registry/ninaero", "scripts", "components/overview", "lib", "."]) {
      const watcher = watch(
        join(root, directory),
        { recursive: directory !== "." },
        (_event, filename) => {
          if (directory === "." && filename && filename !== "package.json") return;
          if (filename && /(^|[/\\])__tests__([/\\]|$)/.test(filename)) return;
          schedule();
        },
      );
      watcher.on("error", (error) => {
        close();
        onWatchError(error);
      });
      watchers.push(watcher);
    }
  } catch (error) {
    close();
    throw error;
  }

  // Watch before the initial build so saves during startup are not lost.
  return { ready: rebuild(), close };
}
