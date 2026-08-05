/** Filas crudas Supabase usadas por managers del CMS (sin mapear a dominio). */

export type SkillAdminRow = {
  id: string;
  name: string;
  type: string;
  sort_order: number;
  icon_path?: string | null;
  label: string;
};

export type ExperienceAdminRow = {
  id: string;
  organization_id: string;
  type: string;
  start_month: number;
  start_year: number;
  end_month?: number | null;
  end_year?: number | null;
  is_current: boolean;
  sort_order: number;
  title: string;
  description: string;
  organizations?: { name?: string };
  experience_skills?: { skill_id: string }[];
};

export type EducationAdminRow = {
  id: string;
  organization_id: string;
  type: string;
  start_month: number;
  start_year: number;
  end_month?: number | null;
  end_year?: number | null;
  is_current: boolean;
  sort_order: number;
  title: string;
  description: string;
  institution_image_path?: string | null;
  diploma_image_path?: string | null;
  diploma_pdf_path?: string | null;
  organizations?: { name?: string };
  education_skills?: { skill_id: string }[];
};

export type ProjectAdminRow = {
  id: string;
  organization_id?: string | null;
  slug: string;
  start_month?: number | null;
  start_year?: number | null;
  end_month?: number | null;
  end_year?: number | null;
  image_path?: string | null;
  github_url?: string | null;
  live_url?: string | null;
  is_featured: boolean;
  sort_order: number;
  name: string;
  summary: string;
  description: string;
  project_skills?: { skill_id: string }[];
};

export type CertificateAdminRow = {
  id: string;
  organization_id: string;
  issued_month: number;
  issued_year: number;
  image_path?: string | null;
  pdf_path?: string | null;
  credential_url?: string | null;
  is_featured: boolean;
  sort_order: number;
  name: string;
  description: string;
  organizations?: { name?: string };
};
