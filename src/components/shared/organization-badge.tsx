"use client";

import { ExternalLink } from "lucide-react";
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

  return (
    <div className={cn("flex items-center gap-3", className)}>
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
        {organization.websiteUrl ? (
          <a
            href={organization.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground mt-0.5 inline-flex items-center gap-1 text-xs transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            Sitio web
            <ExternalLink className="size-3" aria-hidden />
          </a>
        ) : null}
      </div>
    </div>
  );
}
