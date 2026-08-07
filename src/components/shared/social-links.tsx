import { storageBuckets } from "@/constants/storage-buckets";
import { cn } from "@/lib/utils";
import { getPublicStorageUrl } from "@/lib/storage-url";
import type { SocialLink } from "@/types/domain";

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
        const iconSrc = getPublicStorageUrl(
          storageBuckets.icons,
          link.iconImage,
        );
        return (
          <li key={link.id}>
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={link.name}
              className={cn(
                "text-muted-foreground hover:text-foreground hover:bg-muted inline-flex size-12 items-center justify-center rounded-xl border border-border/60 transition-colors",
                iconClassName,
              )}
            >
              {iconSrc ? (
                // eslint-disable-next-line @next/next/no-img-element -- SVG/PNG/WEBP/JPG desde Storage
                <img
                  src={iconSrc}
                  alt=""
                  width={26}
                  height={26}
                  className="size-[26px] object-contain"
                />
              ) : (
                <span className="text-sm font-medium" aria-hidden>
                  {link.name.slice(0, 1).toUpperCase()}
                </span>
              )}
            </a>
          </li>
        );
      })}
    </ul>
  );
}
