import type {
  Certificate,
  Education,
  Experience,
  Organization,
  Project,
  Skill,
} from "@/types/domain";

export function mapOrganization(
  row: Record<string, unknown> | null | undefined,
): Organization | undefined {
  if (!row) return undefined;

  return {
    id: row.id as string,
    name: row.name as string,
    type: row.type as Organization["type"],
    websiteUrl: (row.website_url as string) ?? null,
    logoPath: (row.logo_path as string) ?? null,
    location: (row.location as string) ?? null,
    description: (row.description as string) ?? "",
  };
}

export function mapSkillFromJoin(row: Record<string, unknown>): Skill {
  const skill = row.skills as Record<string, unknown> | undefined;
  const base = skill ?? row;
  return {
    id: base.id as string,
    name: base.name as string,
    type: base.type as Skill["type"],
    iconPath: (base.icon_path as string) ?? null,
    sortOrder: (base.sort_order as number) ?? 0,
    label: (base.label as string) || (base.name as string),
  };
}

export function mapExperience(row: Record<string, unknown>): Experience {
  const skillJoins = (row.experience_skills as Record<string, unknown>[]) ?? [];

  return {
    id: row.id as string,
    organizationId: row.organization_id as string,
    organization: mapOrganization(
      row.organizations as Record<string, unknown>,
    ),
    type: row.type as Experience["type"],
    startMonth: row.start_month as number,
    startYear: row.start_year as number,
    endMonth: (row.end_month as number) ?? null,
    endYear: (row.end_year as number) ?? null,
    isCurrent: row.is_current as boolean,
    sortOrder: row.sort_order as number,
    title: (row.title as string) ?? "",
    description: (row.description as string) ?? "",
    skills: skillJoins.map((s) => mapSkillFromJoin(s)),
  };
}

export function mapEducation(row: Record<string, unknown>): Education {
  const skillJoins = (row.education_skills as Record<string, unknown>[]) ?? [];

  return {
    id: row.id as string,
    organizationId: row.organization_id as string,
    organization: mapOrganization(
      row.organizations as Record<string, unknown>,
    ),
    type: row.type as Education["type"],
    startMonth: row.start_month as number,
    startYear: row.start_year as number,
    endMonth: (row.end_month as number) ?? null,
    endYear: (row.end_year as number) ?? null,
    isCurrent: row.is_current as boolean,
    institutionImagePath: (row.institution_image_path as string) ?? null,
    diplomaImagePath: (row.diploma_image_path as string) ?? null,
    diplomaPdfPath: (row.diploma_pdf_path as string) ?? null,
    sortOrder: row.sort_order as number,
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
    sortOrder: row.sort_order as number,
    name: (row.name as string) ?? "",
    description: (row.description as string) ?? "",
    summary: (row.summary as string) ?? "",
    skills: skillJoins.map((s) => mapSkillFromJoin(s)),
  };
}

export function mapCertificate(row: Record<string, unknown>): Certificate {
  return {
    id: row.id as string,
    organizationId: row.organization_id as string,
    organization: mapOrganization(
      row.organizations as Record<string, unknown>,
    ),
    issuedMonth: row.issued_month as number,
    issuedYear: row.issued_year as number,
    imagePath: (row.image_path as string) ?? null,
    pdfPath: (row.pdf_path as string) ?? null,
    credentialUrl: (row.credential_url as string) ?? null,
    isFeatured: row.is_featured as boolean,
    sortOrder: row.sort_order as number,
    name: (row.name as string) ?? "",
    description: (row.description as string) ?? "",
  };
}
