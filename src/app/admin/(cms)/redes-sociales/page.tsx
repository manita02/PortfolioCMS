import { SocialLinksManager } from "@/features/admin/components/social-links-manager";
import { getSocialLinks } from "@/services/social-link.service";

export default async function AdminSocialLinksPage() {
  const items = await getSocialLinks();

  return (
    <SocialLinksManager
      items={items}
      title="Redes sociales"
      description="Enlaces a redes y perfiles."
    />
  );
}
