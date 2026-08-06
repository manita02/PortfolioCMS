/** Filas crudas Supabase usadas por managers del CMS (sin mapear a dominio). */

export type SkillAdminRow = {
  id: string;
  name: string;
  type_id: string;
  sort_order: number;
  icon_path?: string | null;
  label: string;
  skill_types?: { id?: string; name?: string; sort_order?: number } | null;
};

export type ExperienceAdminRow = {
  id: string;
  organization_id: string;
  type_id: string;
  modality_id: string;
  start_month: number;
  start_year: number;
  end_month?: number | null;
  end_year?: number | null;
  is_current: boolean;
  title: string;
  description: string;
  organizations?: { name?: string };
  experience_types?: { id?: string; name?: string } | null;
  experience_modalities?: { id?: string; name?: string } | null;
  experience_skills?: { skill_id: string }[];
};

export type EducationAdminRow = {
  id: string;
  organization_id: string;
  type_id: string;
  start_month: number;
  start_year: number;
  end_month?: number | null;
  end_year?: number | null;
  is_current: boolean;
  title: string;
  description: string;
  diploma_image_path?: string | null;
  diploma_pdf_path?: string | null;
  organizations?: { name?: string };
  education_types?: { id?: string; name?: string } | null;
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
  name: string;
  summary: string;
  description: string;
  project_skills?: { skill_id: string }[];
};
