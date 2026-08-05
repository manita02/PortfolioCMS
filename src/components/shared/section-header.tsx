import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function SectionHeader({
  title,
  description,
  href,
  linkLabel,
  id,
}: {
  title: string;
  description?: string;
  href?: string;
  linkLabel?: string;
  id?: string;
}) {
  if (!title && !(href && linkLabel)) return null;

  return (
    <div className="mb-8 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl space-y-2">
        {title ? (
          <h2 id={id} className="font-heading text-2xl tracking-tight sm:text-3xl">
            {title}
          </h2>
        ) : null}
        {description ? (
          <p className="text-muted-foreground text-sm leading-relaxed sm:text-base">
            {description}
          </p>
        ) : null}
      </div>
      {href && linkLabel ? (
        <Link
          href={href}
          className={cn(buttonVariants({ variant: "outline", size: "sm" }), "shrink-0")}
        >
          {linkLabel}
        </Link>
      ) : null}
    </div>
  );
}
