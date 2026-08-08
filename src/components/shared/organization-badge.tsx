"use client";

import { OrgLogo } from "@/components/shared/org-logo";
import { cn } from "@/lib/utils";
import type { Organization } from "@/types/domain";

export function OrganizationBadge({
  organization,
  meta,
  size = 44,
  className,
}: {
  organization: Organization | null | undefined;
  meta?: string | null;
  size?: number;
  className?: string;
}) {
  if (!organization) return null;

  const details = [organization.location || null, meta || null].filter(Boolean);
  const href = organization.websiteUrl?.trim() || null;

  const content = (
    <>
      <OrgLogo
        logoPath={organization.logoPath}
        name={organization.name}
        size={size}
      />
      <div className="min-w-0">
        <p className="text-sm leading-snug font-medium tracking-tight">
          {organization.name}
        </p>
        {details.length > 0 ? (
          <p className="text-muted-foreground text-sm leading-snug">
            {details.join(" · ")}
          </p>
        ) : null}
      </div>
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${organization.name} (sitio web)`}
        onClick={(e) => e.stopPropagation()}
        className={cn(
          "group/org -m-1.5 flex items-center gap-3 rounded-xl p-1.5",
          "transition-all duration-200 ease-out",
          "hover:-translate-y-0.5 hover:bg-muted/55",
          "focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none",
          className,
        )}
      >
        {content}
      </a>
    );
  }

  return (
    <div className={cn("flex items-center gap-3", className)}>{content}</div>
  );
}
