import { PersonForm } from "@/features/admin/components/person-form";
import { getExperiencesRaw } from "@/services/experience.service";
import { getPersonRaw } from "@/services/person.service";

export default async function AdminPersonPage() {
  const [person, experiences] = await Promise.all([
    getPersonRaw(),
    getExperiencesRaw(),
  ]);

  return (
    <PersonForm
      person={person}
      experiences={experiences.map((item) => ({
        id: item.id,
        title: item.title,
        organizationName: item.organizations?.name ?? "",
      }))}
      title="Persona"
      description="Datos personales, bio y SEO."
    />
  );
}
