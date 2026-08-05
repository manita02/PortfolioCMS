import { PersonForm } from "@/features/admin/components/person-form";
import { getAvailabilityStatuses } from "@/services/catalog.service";
import { getPersonRaw } from "@/services/person.service";

export default async function AdminPersonPage() {
  const [person, availabilityStatuses] = await Promise.all([
    getPersonRaw(),
    getAvailabilityStatuses(),
  ]);

  return (
    <PersonForm
      person={person}
      availabilityStatuses={availabilityStatuses}
      title="Persona"
      description="Datos personales, bio y SEO."
    />
  );
}
