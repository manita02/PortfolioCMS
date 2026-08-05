import { OrganizationsManager } from "@/features/admin/components/organizations-manager";
import { getOrganizations } from "@/services/organization.service";

export default async function AdminOrganizationsPage() {
  const items = await getOrganizations();

  return (
    <OrganizationsManager
      items={items}
      title="Organizaciones"
      description="Empresas e instituciones."
    />
  );
}
