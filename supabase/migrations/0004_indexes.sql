-- Índices de lectura pública y joins

create index organizations_name_idx on public.organizations (name);
create index organizations_location_idx on public.organizations (location);

create index experiences_org_idx on public.experiences (organization_id);
create index experiences_chrono_idx on public.experiences (
  is_current desc,
  end_year desc nulls last,
  end_month desc nulls last,
  start_year desc,
  start_month desc,
  id desc
);
create index experiences_type_idx on public.experiences (type_id);
create index experiences_modality_idx on public.experiences (modality_id);

create index educations_org_idx on public.educations (organization_id);
create index educations_type_idx on public.educations (type_id);
create index educations_chrono_idx on public.educations (
  is_current desc,
  end_year desc nulls last,
  end_month desc nulls last,
  start_year desc,
  start_month desc,
  id desc
);

create index projects_featured_chrono_idx on public.projects (
  is_featured desc,
  end_year desc nulls last,
  end_month desc nulls last,
  start_year desc nulls last,
  start_month desc nulls last,
  id desc
);
create unique index projects_slug_uidx on public.projects (slug);
create index projects_org_idx on public.projects (organization_id);

create index skills_sort_idx on public.skills (sort_order, name);
create unique index skills_name_uidx on public.skills (name);

create index experience_skills_skill_idx on public.experience_skills (skill_id);
create index education_skills_skill_idx on public.education_skills (skill_id);
create index project_skills_skill_idx on public.project_skills (skill_id);

create index social_links_sort_idx on public.social_links (sort_order);
create index social_links_type_idx on public.social_links (type_id);
