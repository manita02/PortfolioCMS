import { BackToTop } from "@/components/shared/back-to-top";
import { SocialLinks } from "@/components/shared/social-links";
import type { SocialLink } from "@/types/domain";

export async function SiteFooter({
  brand,
  socialLinks,
}: {
  brand: string;
  socialLinks: SocialLink[];
}) {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border/60">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-10 sm:px-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <p className="font-heading text-sm font-semibold">{brand}</p>
            <p className="text-muted-foreground text-xs">
              © {year} {brand}. Todos los derechos reservados.
            </p>
          </div>
          <SocialLinks links={socialLinks} />
        </div>
        <div className="flex items-center justify-end gap-3 border-t border-border/50 pt-6">
          <BackToTop />
        </div>
      </div>
    </footer>
  );
}
