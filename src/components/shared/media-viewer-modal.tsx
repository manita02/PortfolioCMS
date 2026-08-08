"use client";

import { Download, XIcon } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  detectMediaKind,
  getMediaFilename,
  type MediaKind,
} from "@/lib/media-type";
import { cn } from "@/lib/utils";

export type MediaViewerModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  src: string | null | undefined;
  title?: string;
  /** Si se omite o es "auto", se infiere por extensión de la URL. */
  type?: MediaKind | "auto";
};

export function MediaViewerModal({
  open,
  onOpenChange,
  src,
  title,
  type = "auto",
}: MediaViewerModalProps) {
  const reduce = useReducedMotion();
  const kind = src ? detectMediaKind(src, type) : null;
  const label = title?.trim() || (kind === "pdf" ? "Documento PDF" : "Imagen");
  const filename = src ? getMediaFilename(src, label) : label;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        overlayClassName="bg-black/80 supports-backdrop-filter:backdrop-blur-sm data-open:duration-200 data-closed:duration-150"
        className={cn(
          // Anula el Dialog base (`grid` + centrado) para un panel de altura fiable.
          "flex flex-col gap-0 overflow-hidden bg-background p-0 text-foreground ring-0",
          // Mobile: pantalla completa + safe areas (notch / home indicator)
          "fixed inset-0 top-0 right-0 bottom-0 left-0 z-50 h-dvh max-h-dvh w-full max-w-none translate-x-0 translate-y-0 rounded-none",
          "pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]",
          // Tablet / desktop: modal centrado con márgenes
          "sm:inset-auto sm:top-1/2 sm:right-auto sm:bottom-auto sm:left-1/2 sm:h-[min(90dvh,880px)] sm:max-h-[90dvh] sm:w-[min(96vw,1100px)] sm:max-w-[1100px] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-2xl sm:pt-0 sm:pb-0 sm:ring-1 sm:ring-foreground/10",
          "data-open:zoom-in-95 data-closed:zoom-out-95",
        )}
        aria-describedby={undefined}
      >
        <DialogTitle className="sr-only">{label}</DialogTitle>
        <DialogDescription className="sr-only">
          Visor de {kind === "pdf" ? "PDF" : "imagen"}. Pulsa Escape o el botón
          cerrar para salir.
        </DialogDescription>

        <div className="flex min-h-0 flex-1 flex-col">
          <header className="flex shrink-0 items-center gap-2 border-b border-border/60 px-3 py-2.5 sm:gap-3 sm:px-4">
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium tracking-tight">
                {label}
              </p>
              <p className="text-muted-foreground truncate text-xs">
                {kind === "pdf" ? "PDF" : "Imagen"}
              </p>
            </div>

            {src ? (
              <a
                href={src}
                download={filename}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  buttonVariants({ variant: "outline", size: "sm" }),
                  "shrink-0",
                )}
              >
                <Download className="size-3.5" aria-hidden />
                <span className="max-sm:sr-only">Descargar</span>
              </a>
            ) : null}

            <DialogClose
              render={
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="shrink-0"
                  aria-label="Cerrar"
                />
              }
            >
              <XIcon />
            </DialogClose>
          </header>

          <div className="relative min-h-0 flex-1 bg-black/90">
            <AnimatePresence mode="wait">
              {open && src && kind ? (
                <motion.div
                  key={`${kind}:${src}`}
                  className="absolute inset-0"
                  initial={reduce ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={reduce ? undefined : { opacity: 0 }}
                  transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                >
                  {kind === "image" ? (
                    <div className="absolute inset-0 p-3 sm:p-6">
                      {/* eslint-disable-next-line @next/next/no-img-element -- visor a resolución nativa, sin recorte */}
                      <img
                        src={src}
                        alt={label}
                        className="size-full object-contain"
                        loading="eager"
                        decoding="async"
                        draggable={false}
                      />
                    </div>
                  ) : (
                    <div className="flex size-full min-h-0 flex-col">
                      <iframe
                        src={`${src}#view=FitH`}
                        title={label}
                        className="min-h-0 w-full flex-1 border-0 bg-neutral-900"
                      />
                    </div>
                  )}
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
