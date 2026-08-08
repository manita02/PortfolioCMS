"use client";

import { useSyncExternalStore } from "react";

const MOBILE_QUERY = "(max-width: 639px)";

function subscribe(onStoreChange: () => void) {
  const mql = window.matchMedia(MOBILE_QUERY);
  mql.addEventListener("change", onStoreChange);
  return () => mql.removeEventListener("change", onStoreChange);
}

function getSnapshot() {
  return window.matchMedia(MOBILE_QUERY).matches;
}

function getServerSnapshot() {
  return false;
}

/** Viewport estrecho (breakpoint `sm` de Tailwind). */
export function useMobileViewport() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
