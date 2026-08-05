"use client";

import { ErrorState } from "@/components/shared/error-state";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function PublicError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto flex min-h-[50vh] w-full max-w-lg flex-col items-center justify-center px-4 pt-28">
      <ErrorState
        title="Algo salió mal"
        message="Ocurrió un error inesperado. Podés intentar de nuevo."
      />
      <button
        type="button"
        onClick={reset}
        className={cn(buttonVariants({ variant: "outline" }), "mt-6")}
      >
        Reintentar
      </button>
    </div>
  );
}
