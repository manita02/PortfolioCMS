import { CertificatesManager } from "@/features/admin/components/certificates-manager";
import { getCertificatesRaw } from "@/services/certificate.service";
import { getOrganizationsRaw } from "@/services/organization.service";

export default async function AdminCertificatesPage() {
  const [items, organizations] = await Promise.all([
    getCertificatesRaw(),
    getOrganizationsRaw(),
  ]);

  return (
    <CertificatesManager
      items={items}
      organizations={organizations}
      title="Certificados"
      description="Credenciales y certificados."
    />
  );
}
