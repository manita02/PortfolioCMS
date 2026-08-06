import type {
  Education,
  Experience,
  Organization,
  Project,
  Skill,
} from "@/types/domain";

function nestedCatalog(
  row: Record<string, unknown>,
  relationKey: string,
  idKey = "type_id",
): { id: string; name: string; sortOrder: number } {
  const catalog = row[relationKey] as Record<string, unknown> | null | undefined;
  return {
    id: (row[idKey] as string) ?? (catalog?.id as string) ?? "",
    name: (catalog?.name as string) ?? "",
    sortOrder: (catalog?.sort_order as number) ?? 0,
  };
}

export function mapOrganization(
  row: Record<string, unknown> | null | undefined,
): Organization | undefined {
  if (!row) return undefined;

  const type = nestedCatalog(row, "organization_types");

  return {
    id: row.id as string,
    name: row.name as string,
    typeId: type.id,
    typeName: type.name,
    websiteUrl: (row.website_url as string) ?? null,
    logoPath: (row.logo_path as string) ?? null,
    location: (row.location as string) ?? null,
    description: (row.description as string) ?? "",
  };
}

export function mapSkill(row: Record<string, unknown>): Skill {
  const type = nestedCatalog(row, "skill_types");
  return {
    id: row.id as string,
    name: row.name as string,
    typeId: type.id,
    typeName: type.name,
    typeSortOrder: type.sortOrder,
    iconPath: (row.icon_path as string) ?? null,
    sortOrder: (row.sort_order as number) ?? 0,
    label: (row.label as string) || (row.name as string),
  };
}

export function mapSkillFromJoin(row: Record<string, unknown>): Skill {
  const skill = row.skills as Record<string, unknown> | undefined;
  return mapSkill(skill ?? row);
}

export function mapExperience(row: Record<string, unknown>): Experience {
  const skillJoins = (row.experience_skills as Record<string, unknown>[]) ?? [];
  const type = nestedCatalog(row, "experience_types");
  const modality = nestedCatalog(row, "experience_modalities", "modality_id");

  return {
    id: row.id as string,
    organizationId: row.organization_id as string,
    organization: mapOrganization(
      row.organizations as Record<string, unknown>,
    ),
    typeId: type.id,
    typeName: type.name,
    modalityId: modality.id,
    modalityName: modality.name,
    startMonth: row.start_month as number,
    startYear: row.start_year as number,
    endMonth: (row.end_month as number) ?? null,
    endYear: (row.end_year as number) ?? null,
    isCurrent: row.is_current as boolean,
    title: (row.title as string) ?? "",
    description: (row.description as string) ?? "",
    skills: skillJoins.map((s) => mapSkillFromJoin(s)),
  };
}

export function mapEducation(row: Record<string, unknown>): Education {
  const skillJoins = (row.education_skills as Record<string, unknown>[]) ?? [];
  const type = nestedCatalog(row, "education_types");

  return {
    id: row.id as string,
    organizationId: row.organization_id as string,
    organization: mapOrganization(
      row.organizations as Record<string, unknown>,
    ),
    typeId: type.id,
    typeName: type.name,
    startMonth: row.start_month as number,
    startYear: row.start_year as number,
    endMonth: (row.end_month as number) ?? null,
    endYear: (row.end_year as number) ?? null,
    isCurrent: row.is_current as boolean,
    diplomaImagePath: (row.diploma_image_path as string) ?? null,
    diplomaPdfPath: (row.diploma_pdf_path as string) ?? null,
    title: (row.title as string) ?? "",
    description: (row.description as string) ?? "",
    skills: skillJoins.map((s) => mapSkillFromJoin(s)),
  };
}

export function mapProject(row: Record<string, unknown>): Project {
  const skillJoins = (row.project_skills as Record<string, unknown>[]) ?? [];

  return {
    id: row.id as string,
    organizationId: (row.organization_id as string) ?? null,
    organization:
      mapOrganization(row.organizations as Record<string, unknown>) ?? null,
    slug: row.slug as string,
    startMonth: (row.start_month as number) ?? null,
    startYear: (row.start_year as number) ?? null,
    endMonth: (row.end_month as number) ?? null,
    endYear: (row.end_year as number) ?? null,
    imagePath: (row.image_path as string) ?? null,
    githubUrl: (row.github_url as string) ?? null,
    liveUrl: (row.live_url as string) ?? null,
    isFeatured: row.is_featured as boolean,
    name: (row.name as string) ?? "",
    description: (row.description as string) ?? "",
    summary: (row.summary as string) ?? "",
    skills: skillJoins.map((s) => mapSkillFromJoin(s)),
  };
}
