import { cn } from "@/lib/utils";

export function EmptyState({
  message,
  title,
  className,
}: {
  message: string;
  title?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border border-dashed border-border/80 bg-muted/30 px-6 py-12 text-center",
        className,
      )}
    >
      {title ? (
        <p className="font-heading mb-1 text-base tracking-tight">{title}</p>
      ) : null}
      <p className="text-muted-foreground text-sm">{message}</p>
    </div>
  );
}
