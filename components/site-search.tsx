"use client";

import { cn } from "cn";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

import { SearchIcon } from "@/lib/icons";
import { Button } from "@/registry/ninaero/ui/button";
import { Kbd, KbdGroup } from "@/registry/ninaero/ui/kbd";
import { Spinner } from "@/registry/ninaero/ui/spinner";

import { createSearchLoader, isSearchShortcut } from "./site-search-loader.mjs";

import styles from "./site-search.module.css";

type LoadedSearch = {
  Component: typeof import("./site-search-dialog").SiteSearchDialog;
  returnFocus: HTMLElement | null;
};

export function SiteSearch() {
  const pathname = usePathname();
  const previousPathname = useRef(pathname);
  const [loader] = useState(() => createSearchLoader(() => import("./site-search-dialog")));
  const [loaded, setLoaded] = useState<LoadedSearch | null>(null);
  const [loadingPathname, setLoadingPathname] = useState<string | null>(null);
  const loading = loadingPathname !== null && loadingPathname === pathname;
  const [failed, setFailed] = useState(false);

  const openSearch = useCallback(() => {
    const returnFocus =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    if (
      loader.open(
        (module) => {
          setLoadingPathname(null);
          setLoaded({ Component: module.SiteSearchDialog, returnFocus });
        },
        (error) => {
          console.error("Unable to load search", error);
          setLoadingPathname(null);
          setFailed(true);
        },
      )
    ) {
      setFailed(false);
      setLoadingPathname(pathname);
    }
  }, [loader, pathname]);

  function preloadSearch() {
    // Speculative failures retry on activation without interrupting navigation.
    void loader.preload().catch(() => {});
  }

  useEffect(() => {
    if (loaded) return;
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && !event.defaultPrevented && loader.cancel()) {
        event.preventDefault();
        setLoadingPathname(null);
        return;
      }
      if (!isSearchShortcut(event)) return;
      event.preventDefault();
      openSearch();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [loaded, loader, openSearch]);

  useEffect(() => {
    if (previousPathname.current === pathname) return;
    previousPathname.current = pathname;
    loader.cancel();
  }, [loader, pathname]);

  useEffect(
    () => () => {
      loader.cancel();
    },
    [loader],
  );

  if (loaded) {
    return <loaded.Component initialReturnFocus={loaded.returnFocus} />;
  }

  return (
    <div className="flex shrink-0">
      <Button
        variant="secondary"
        size="icon-sm"
        className={cn("md:hidden", styles.triggerSurface)}
        sound={false}
        aria-label={failed ? "Retry search" : "Search documentation"}
        aria-keyshortcuts="Control+K Meta+K"
        aria-busy={loading}
        onClick={openSearch}
        onMouseEnter={preloadSearch}
        onFocus={preloadSearch}
      >
        <span className="inline-flex">
          {loading ? (
            <Spinner aria-hidden="true" className="motion-reduce:animate-none" />
          ) : (
            <SearchIcon />
          )}
        </span>
      </Button>
      <Button
        variant="secondary"
        size="sm"
        className={cn("hidden gap-4 md:inline-flex", styles.triggerSurface)}
        sound={false}
        aria-keyshortcuts="Control+K Meta+K"
        aria-busy={loading}
        onClick={openSearch}
        onMouseEnter={preloadSearch}
        onFocus={preloadSearch}
      >
        <span className="flex items-center gap-2">
          <span className="inline-flex">
            {loading ? (
              <Spinner
                data-icon="inline-start"
                aria-hidden="true"
                className="motion-reduce:animate-none"
              />
            ) : (
              <SearchIcon data-icon="inline-start" />
            )}
          </span>
          <span>{failed ? "Retry search" : "Search"}</span>
        </span>
        <KbdGroup aria-hidden="true">
          <Kbd>Ctrl/⌘</Kbd>
          <Kbd>K</Kbd>
        </KbdGroup>
      </Button>
      <span role="status" className="sr-only">
        {loading ? "Loading search…" : ""}
      </span>
      {failed && (
        <span role="alert" className="sr-only">
          Unable to load search. Try again.
        </span>
      )}
    </div>
  );
}
