import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { JsonLd } from "@/components/seo/json-ld";
import { siteConfig } from "@/config/site";

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

export async function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  const base = siteConfig.getUrl();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: item.href
        ? `${base}${item.href === "/" ? "" : item.href}`
        : undefined,
    })),
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <nav aria-label="Miga de pan" className="mb-6">
        <ol className="text-muted-foreground flex flex-wrap items-center gap-1.5 text-sm">
          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            return (
              <li key={`${item.label}-${index}`} className="flex items-center gap-1.5">
                {index > 0 ? (
                  <ChevronRight className="size-3.5 opacity-50" aria-hidden />
                ) : null}
                {item.href && !isLast ? (
                  <Link
                    href={item.href}
                    className="hover:text-foreground transition-colors"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span
                    className={isLast ? "text-foreground font-medium" : undefined}
                    aria-current={isLast ? "page" : undefined}
                  >
                    {item.label}
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
