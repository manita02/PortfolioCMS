import { PersonForm } from "@/features/admin/components/person-form";
import { getPersonRaw } from "@/services/person.service";

export default async function AdminPersonPage() {
  const person = await getPersonRaw();

  return (
    <PersonForm
      person={person}
      title="Persona"
      description="Datos personales, bio y SEO."
    />
  );
}
