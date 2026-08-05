import { CertificatesBrowser } from "@/features/certificates/components/certificates-browser";
import { buildMetadata } from "@/lib/seo";
import { getCertificates } from "@/services/certificate.service";

export async function generateMetadata() {
  return buildMetadata({
    title: "Certificados",
    description: "Certificaciones y credenciales profesionales.",
    path: "/certificados",
  });
}

export default async function CertificatesPage() {
  const items = await getCertificates();

  return (
    <div className="mx-auto w-full max-w-6xl px-4 pt-24 pb-16 sm:px-6 sm:pb-20">
      <header className="mb-10 space-y-2">
        <h1 className="font-heading text-3xl tracking-tight sm:text-4xl">
          Certificados
        </h1>
        <p className="text-muted-foreground max-w-2xl text-sm sm:text-base">
          Certificaciones y credenciales profesionales.
        </p>
      </header>
      <CertificatesBrowser items={items} />
    </div>
  );
}
