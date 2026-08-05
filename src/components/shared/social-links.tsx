import {
  AtSign,
  Code2,
  Globe,
  Link2,
  Mail,
  X,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { SocialLink } from "@/types/domain";

const iconMap: Record<string, LucideIcon> = {
  github: Code2,
  linkedin: AtSign,
  twitter: X,
  x: X,
  mail: Mail,
  email: Mail,
  globe: Globe,
  link: Link2,
  website: Globe,
};

export function SocialLinks({
  links,
  className,
  iconClassName,
}: {
  links: SocialLink[];
  className?: string;
  iconClassName?: string;
}) {
  if (links.length === 0) return null;

  return (
    <ul className={cn("flex flex-wrap items-center gap-2", className)}>
      {links.map((link) => {
        const Icon = iconMap[link.iconKey.toLowerCase()] ?? Link2;
        return (
          <li key={link.id}>
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={link.name}
              className={cn(
                "text-muted-foreground hover:text-foreground hover:bg-muted inline-flex size-10 items-center justify-center rounded-xl border border-border/60 transition-colors",
                iconClassName,
              )}
            >
              <Icon className="size-4" aria-hidden />
            </a>
          </li>
        );
      })}
    </ul>
  );
}
