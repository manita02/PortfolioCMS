"use client";

import { ArrowUp } from "lucide-react";
import { useScrolled } from "@/hooks/use-scrolled";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function BackToTop() {
  const visible = useScrolled(400);

  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={cn(
        buttonVariants({ variant: "outline", size: "icon" }),
        "rounded-xl",
      )}
      aria-label="Volver arriba"
    >
      <ArrowUp className="size-4" />
    </button>
  );
}
