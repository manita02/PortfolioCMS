import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

/** Vertical timeline rail for Experience / Education lists. */
export function Timeline({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <ol className={cn("relative space-y-8 border-l border-border", className)}>
      {children}
    </ol>
  );
}

export function TimelineItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <li className={cn("relative pl-6", className)}>
      <span
        aria-hidden
        className="bg-foreground absolute top-1.5 -left-[3.5px] size-1.5 rounded-full ring-4 ring-background"
      />
      {children}
    </li>
  );
}
