import { SocialLinksManager } from "@/features/admin/components/social-links-manager";
import { getSocialLinkTypes } from "@/services/catalog.service";
import { getSocialLinks } from "@/services/social-link.service";

export default async function AdminSocialLinksPage() {
  const [items, types] = await Promise.all([
    getSocialLinks(),
    getSocialLinkTypes(),
  ]);

  return (
    <SocialLinksManager
      items={items}
      types={types}
      title="Redes sociales"
      description="Enlaces a redes y perfiles."
    />
  );
}
