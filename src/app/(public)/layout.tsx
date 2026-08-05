import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { PageTransition } from "@/components/shared/page-transition";
import { getPerson } from "@/services/person.service";
import { getSocialLinks } from "@/services/social-link.service";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [person, socialLinks] = await Promise.all([
    getPerson(),
    getSocialLinks(),
  ]);

  const brand = person
    ? `${person.firstName} ${person.lastName}`
    : "Portfolio";

  return (
    <>
      <a
        href="#main"
        className="bg-primary text-primary-foreground focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-md focus:px-3 focus:py-2 sr-only focus:not-sr-only"
      >
        Saltar al contenido
      </a>
      <div className="flex min-h-screen flex-col">
        <SiteHeader brand={brand} />
        <main id="main" className="flex-1">
          <PageTransition>{children}</PageTransition>
        </main>
        <SiteFooter brand={brand} socialLinks={socialLinks} />
      </div>
    </>
  );
}
