"use client";

import { Download, FileText, XIcon } from "lucide-react";
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
          "gap-0 overflow-hidden bg-background p-0 text-foreground ring-0",
          // Mobile: casi pantalla completa
          "inset-0 top-0 left-0 h-dvh max-h-dvh w-full max-w-none translate-x-0 translate-y-0 rounded-none",
          // Tablet / desktop: modal centrado con márgenes
          "sm:inset-auto sm:top-1/2 sm:left-1/2 sm:h-[min(90dvh,880px)] sm:max-h-[90dvh] sm:w-[min(96vw,1100px)] sm:max-w-[1100px] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-2xl sm:ring-1 sm:ring-foreground/10",
          "data-open:zoom-in-95 data-closed:zoom-out-95",
        )}
        aria-describedby={undefined}
      >
        <DialogTitle className="sr-only">{label}</DialogTitle>
        <DialogDescription className="sr-only">
          Visor de {kind === "pdf" ? "PDF" : "imagen"}. Pulsa Escape o el botón
          cerrar para salir.
        </DialogDescription>

        <div className="flex h-full min-h-0 flex-col">
          <header className="flex shrink-0 items-center gap-3 border-b border-border/60 px-3 py-2.5 sm:px-4">
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
                )}
              >
                <Download className="size-3.5" aria-hidden />
                Descargar
              </a>
            ) : null}

            <DialogClose
              render={
                <Button variant="ghost" size="icon-sm" aria-label="Cerrar" />
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
                  initial={
                    reduce ? false : { opacity: 0, scale: 0.98 }
                  }
                  animate={{ opacity: 1, scale: 1 }}
                  exit={reduce ? undefined : { opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                >
                  {kind === "image" ? (
                    <div className="flex size-full items-center justify-center overflow-auto p-3 sm:p-6">
                      {/* eslint-disable-next-line @next/next/no-img-element -- visor a resolución nativa, sin recorte */}
                      <img
                        src={src}
                        alt={label}
                        className="max-h-full max-w-full object-contain"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                  ) : (
                    <div className="flex size-full flex-col">
                      <iframe
                        src={`${src}#view=FitH`}
                        title={label}
                        className="size-full min-h-0 flex-1 border-0 bg-neutral-900"
                      />
                      <div className="text-muted-foreground flex items-center justify-center gap-2 border-t border-border/40 bg-background px-3 py-2 text-xs sm:hidden">
                        <FileText className="size-3.5 shrink-0" aria-hidden />
                        <span>
                          Si el PDF no se muestra, usa Descargar para abrirlo.
                        </span>
                      </div>
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
