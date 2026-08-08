import { OrganizationsManager } from "@/features/admin/components/organizations-manager";
import { getOrganizationTypes } from "@/services/catalog.service";
import { getOrganizations } from "@/services/organization.service";

export default async function AdminOrganizationsPage() {
  const [items, types] = await Promise.all([
    getOrganizations(),
    getOrganizationTypes(),
  ]);

  return (
    <OrganizationsManager
      items={items}
      types={types}
      title="Organizaciones"
      description="Empresas e instituciones."
    />
  );
}
