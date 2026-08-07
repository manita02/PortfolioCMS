"use client";

import { Download, Loader2 } from "lucide-react";
import { useState } from "react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { VariantProps } from "class-variance-authority";

type ButtonVariantProps = VariantProps<typeof buttonVariants>;

function filenameFromDisposition(header: string | null): string | null {
  if (!header) return null;
  const utfMatch = /filename\*=UTF-8''([^;]+)/i.exec(header);
  if (utfMatch?.[1]) {
    try {
      return decodeURIComponent(utfMatch[1]);
    } catch {
      return utfMatch[1];
    }
  }
  const plainMatch = /filename="?([^";]+)"?/i.exec(header);
  return plainMatch?.[1] ?? null;
}

export function CvDownloadButton({
  className,
  variant = "outline",
  size = "sm",
  showIcon = true,
  label = "Descargar CV",
  onClick,
}: {
  className?: string;
  variant?: ButtonVariantProps["variant"];
  size?: ButtonVariantProps["size"];
  showIcon?: boolean;
  label?: string;
  onClick?: () => void;
}) {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    if (loading) return;
    onClick?.();
    setLoading(true);
    try {
      const response = await fetch("/cv/pdf?download=1");
      if (!response.ok) throw new Error("No se pudo generar el CV");

      const blob = await response.blob();
      const filename =
        filenameFromDisposition(response.headers.get("Content-Disposition")) ??
        "CV.pdf";
      const objectUrl = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = objectUrl;
      anchor.download = filename;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(objectUrl);
    } catch {
      // Fallback: navegación tradicional si el fetch falla.
      window.location.assign("/cv/pdf?download=1");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      aria-busy={loading}
      className={cn(buttonVariants({ variant, size }), className)}
    >
      {loading ? (
        <Loader2 className="size-3.5 animate-spin" aria-hidden />
      ) : showIcon ? (
        <Download className="size-3.5" aria-hidden />
      ) : null}
      {loading ? "Generando…" : label}
    </button>
  );
}
