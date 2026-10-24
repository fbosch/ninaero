export function isSearchShortcut(event) {
  return (
    !event.defaultPrevented &&
    !event.isComposing &&
    !event.repeat &&
    !event.altKey &&
    !event.shiftKey &&
    (event.ctrlKey || event.metaKey) &&
    event.key.toLowerCase() === "k"
  );
}

export function createSearchLoader(load) {
  let modulePromise;
  let generation = 0;
  let opening = false;

  function preload() {
    modulePromise ??= Promise.resolve()
      .then(load)
      .catch((error) => {
        modulePromise = undefined;
        throw error;
      });
    return modulePromise;
  }

  return {
    preload,
    open(onReady, onError) {
      if (opening) return false;
      opening = true;
      const request = ++generation;
      preload().then(
        (module) => {
          if (request !== generation) return;
          opening = false;
          onReady(module);
        },
        (error) => {
          if (request !== generation) return;
          opening = false;
          onError(error);
        },
      );
      return true;
    },
    cancel() {
      const wasOpening = opening;
      generation++;
      opening = false;
      return wasOpening;
    },
  };
}
