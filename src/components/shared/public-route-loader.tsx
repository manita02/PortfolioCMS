"use client";

import { Loader2 } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const SHOW_DELAY_MS = 120;
const SAFETY_TIMEOUT_MS = 12000;

function isPublicInternalNavigation(
  href: string,
  currentPathname: string,
): boolean {
  let url: URL;
  try {
    url = new URL(href, window.location.origin);
  } catch {
    return false;
  }

  if (url.origin !== window.location.origin) return false;
  if (url.pathname.startsWith("/admin")) return false;
  if (url.pathname.startsWith("/cv/pdf")) return false;

  // Same-route hash scrolls (home sections) — no page navigation.
  if (url.pathname === currentPathname) return false;

  return true;
}

/**
 * Feedback ligero al navegar entre rutas del portfolio público.
 * Delay mínimo para evitar flashes en navegaciones instantáneas.
 */
export function PublicRouteLoader() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const pendingRef = useRef(false);
  const showDelayRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const safetyRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    function clearTimers() {
      if (showDelayRef.current) {
        clearTimeout(showDelayRef.current);
        showDelayRef.current = null;
      }
      if (safetyRef.current) {
        clearTimeout(safetyRef.current);
        safetyRef.current = null;
      }
    }

    clearTimers();
    pendingRef.current = false;
    setVisible(false);

    return clearTimers;
  }, [pathname]);

  useEffect(() => {
    function clearTimers() {
      if (showDelayRef.current) {
        clearTimeout(showDelayRef.current);
        showDelayRef.current = null;
      }
      if (safetyRef.current) {
        clearTimeout(safetyRef.current);
        safetyRef.current = null;
      }
    }

    function stopPending() {
      clearTimers();
      pendingRef.current = false;
      setVisible(false);
    }

    function startPending() {
      pendingRef.current = true;
      clearTimers();
      showDelayRef.current = setTimeout(() => {
        setVisible(true);
        showDelayRef.current = null;
      }, SHOW_DELAY_MS);
      safetyRef.current = setTimeout(stopPending, SAFETY_TIMEOUT_MS);
    }

    function onClick(event: MouseEvent) {
      const target = event.target as HTMLElement | null;
      const anchor = target?.closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href) return;
      if (anchor.target === "_blank" || anchor.hasAttribute("download")) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }
      if (event.defaultPrevented || event.button !== 0) return;
      if (!isPublicInternalNavigation(href, window.location.pathname)) return;

      if (pendingRef.current) {
        event.preventDefault();
        event.stopPropagation();
        return;
      }

      startPending();
    }

    document.addEventListener("click", onClick, true);
    return () => {
      document.removeEventListener("click", onClick, true);
      clearTimers();
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-0 z-[60]"
      aria-busy="true"
      aria-live="polite"
      role="status"
    >
      <div className="bg-primary/25 h-0.5 w-full overflow-hidden">
        <div className="bg-primary h-full w-full origin-left animate-pulse" />
      </div>
      <div className="fixed inset-x-0 top-16 flex justify-center sm:top-[4.5rem]">
        <div className="bg-background/90 text-muted-foreground flex items-center gap-2 rounded-full border border-border/60 px-3 py-1.5 text-xs shadow-sm backdrop-blur-sm">
          <Loader2 className="text-primary size-3.5 animate-spin" aria-hidden />
          <span>Cargando…</span>
        </div>
      </div>
    </div>
  );
}
