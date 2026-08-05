import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export function ErrorState({
  title = "Algo salió mal",
  message,
  className,
}: {
  title?: string;
  message: string;
  className?: string;
}) {
  return (
    <div
      role="alert"
      className={cn(
        "flex flex-col items-center gap-3 rounded-xl border border-destructive/30 bg-destructive/5 px-6 py-12 text-center",
        className,
      )}
    >
      <AlertCircle className="text-destructive size-6" aria-hidden />
      <div className="space-y-1">
        <p className="font-heading text-base tracking-tight">{title}</p>
        <p className="text-muted-foreground text-sm">{message}</p>
      </div>
    </div>
  );
}
