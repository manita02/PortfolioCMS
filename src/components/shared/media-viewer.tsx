"use client";

import dynamic from "next/dynamic";
import { useCallback, useState, type ReactNode } from "react";
import { useMobileViewport } from "@/hooks/use-mobile-viewport";
import { detectMediaKind, type MediaKind } from "@/lib/media-type";
import type { MediaViewerModalProps } from "@/components/shared/media-viewer-modal";

const MediaViewerModal = dynamic(
  () =>
    import("@/components/shared/media-viewer-modal").then(
      (m) => m.MediaViewerModal,
    ),
  { ssr: false },
);

type OpenOptions = {
  type?: MediaKind | "auto";
  title?: string;
};

type ViewerState = {
  open: boolean;
  mounted: boolean;
  src: string;
  type: MediaKind | "auto";
  title?: string;
};

/**
 * Hook reutilizable: monta el modal solo tras el primer uso (lazy).
 * Devuelve `openMedia`, `closeMedia` y el nodo `viewer` a renderizar.
 * En móvil, los PDF se abren en una pestaña nueva (visor nativo).
 */
export function useMediaViewer() {
  const isMobile = useMobileViewport();
  const [state, setState] = useState<ViewerState>({
    open: false,
    mounted: false,
    src: "",
    type: "auto",
  });

  const openMedia = useCallback(
    (src: string, options?: OpenOptions) => {
      if (!src) return;
      const type = options?.type ?? "auto";

      if (detectMediaKind(src, type) === "pdf" && isMobile) {
        window.open(src, "_blank", "noopener,noreferrer");
        return;
      }

      setState({
        open: true,
        mounted: true,
        src,
        type,
        title: options?.title,
      });
    },
    [isMobile],
  );

  const closeMedia = useCallback(() => {
    setState((prev) => ({ ...prev, open: false }));
  }, []);

  const onOpenChange = useCallback((open: boolean) => {
    setState((prev) => ({ ...prev, open }));
  }, []);

  const viewer: ReactNode = state.mounted ? (
    <MediaViewerModal
      open={state.open}
      onOpenChange={onOpenChange}
      src={state.src}
      type={state.type}
      title={state.title}
    />
  ) : null;

  return { openMedia, closeMedia, viewer, isOpen: state.open };
}

/** Modal controlado con carga diferida del bundle del visor. */
export function MediaViewer(props: MediaViewerModalProps) {
  if (!props.open && !props.src) return null;
  return <MediaViewerModal {...props} />;
}
