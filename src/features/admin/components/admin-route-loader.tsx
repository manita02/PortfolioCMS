"use client";

import { Loader2 } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

/**
 * Overlay inmediato al navegar entre rutas del CMS.
 * Evita clicks repetidos en el menú mientras carga la página.
 */
export function AdminRouteLoader() {
  const pathname = usePathname();
  const [pending, setPending] = useState(false);
  const pendingRef = useRef(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    timeoutRef.current = setTimeout(() => {
      pendingRef.current = false;
      setPending(false);
      timeoutRef.current = null;
    }, 180);
  }, [pathname]);

  useEffect(() => {
    function clearSafetyTimeout() {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    }

    function onClick(event: MouseEvent) {
      const target = event.target as HTMLElement | null;
      const anchor = target?.closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href || !href.startsWith("/admin")) return;
      if (href.startsWith("/admin/login")) return;
      if (anchor.target === "_blank" || anchor.hasAttribute("download")) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }
      if (event.defaultPrevented || event.button !== 0) return;

      let nextPath = href;
      try {
        nextPath = new URL(href, window.location.origin).pathname;
      } catch {
        return;
      }

      if (nextPath === window.location.pathname) return;

      if (pendingRef.current) {
        event.preventDefault();
        event.stopPropagation();
        return;
      }

      pendingRef.current = true;
      setPending(true);
      clearSafetyTimeout();
      timeoutRef.current = setTimeout(() => {
        pendingRef.current = false;
        setPending(false);
        timeoutRef.current = null;
      }, 12000);
    }

    document.addEventListener("click", onClick, true);
    return () => {
      document.removeEventListener("click", onClick, true);
      clearSafetyTimeout();
    };
  }, []);

  if (!pending) return null;

  return (
    <div
      className="bg-background/70 fixed inset-0 z-50 flex items-center justify-center backdrop-blur-[2px]"
      aria-busy="true"
      aria-live="polite"
      role="status"
    >
      <div className="flex flex-col items-center justify-center gap-3">
        <Loader2 className="text-primary size-8 animate-spin" aria-hidden />
        <p className="text-muted-foreground text-sm">Cargando…</p>
      </div>
    </div>
  );
}
