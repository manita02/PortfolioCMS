-- Portfolio personal — schema definitivo (solo Español).
-- Singleton admin + singleton person. Sin multi-tenant ni tablas de traducción.

-- Modalidad de trabajo (no tipo contractual)
create type public.experience_type as enum (
  'onsite',   -- Presencial
  'hybrid',   -- Híbrido
  'remote'    -- Remoto
);

create type public.education_type as enum (
  'degree', 'course', 'bootcamp', 'certification_program', 'other'
);

create type public.skill_type as enum (
  'language', 'framework', 'tool', 'soft', 'other'
);

create type public.organization_type as enum (
  'company', 'university', 'school', 'community', 'other'
);

create type public.availability_status as enum (
  'open', 'selective', 'unavailable'
);

create type public.social_link_type as enum (
  'professional', 'social', 'contact', 'other'
);

-- ---------------------------------------------------------------------------
-- Auth allowlist (único admin)
-- ---------------------------------------------------------------------------
create table public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  email text not null unique,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Person (singleton)
-- ---------------------------------------------------------------------------
create table public.persons (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text not null,
  email text,
  profile_image_path text,
  banner_image_path text,
  cv_pdf_path text,
  availability_status public.availability_status not null default 'open',
  professional_title text not null default '',
  subtitle text not null default '',
  about text not null default '',
  availability_label text not null default '',
  meta_title text,
  meta_description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Organization (reutilizable)
-- ---------------------------------------------------------------------------
create table public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type public.organization_type not null default 'company',
  website_url text,
  logo_path text,
  location text,
  description text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Skills (catálogo independiente — N:M vía tablas puente)
-- ---------------------------------------------------------------------------
create table public.skills (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  label text not null default '',
  type public.skill_type not null default 'other',
  icon_path text,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Experiences
-- ---------------------------------------------------------------------------
create table public.experiences (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete restrict,
  type public.experience_type not null default 'remote',
  title text not null default '',
  description text not null default '',
  start_month smallint not null check (start_month between 1 and 12),
  start_year smallint not null check (start_year between 1950 and 2100),
  end_month smallint check (end_month between 1 and 12),
  end_year smallint check (end_year between 1950 and 2100),
  is_current boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint experiences_current_end_null check (
    (is_current = true and end_month is null and end_year is null)
    or (is_current = false)
  )
);

create table public.experience_skills (
  experience_id uuid not null references public.experiences (id) on delete cascade,
  skill_id uuid not null references public.skills (id) on delete cascade,
  primary key (experience_id, skill_id)
);

-- ---------------------------------------------------------------------------
-- Educations
-- ---------------------------------------------------------------------------
create table public.educations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete restrict,
  type public.education_type not null default 'degree',
  title text not null default '',
  description text not null default '',
  start_month smallint not null check (start_month between 1 and 12),
  start_year smallint not null check (start_year between 1950 and 2100),
  end_month smallint check (end_month between 1 and 12),
  end_year smallint check (end_year between 1950 and 2100),
  is_current boolean not null default false,
  institution_image_path text,
  diploma_image_path text,
  diploma_pdf_path text,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint educations_current_end_null check (
    (is_current = true and end_month is null and end_year is null)
    or (is_current = false)
  )
);

create table public.education_skills (
  education_id uuid not null references public.educations (id) on delete cascade,
  skill_id uuid not null references public.skills (id) on delete cascade,
  primary key (education_id, skill_id)
);

-- ---------------------------------------------------------------------------
-- Projects (sin draft/published/status/visibility)
-- ---------------------------------------------------------------------------
create table public.projects (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.organizations (id) on delete set null,
  slug text not null unique,
  name text not null default '',
  summary text not null default '',
  description text not null default '',
  start_month smallint check (start_month between 1 and 12),
  start_year smallint check (start_year between 1950 and 2100),
  end_month smallint check (end_month between 1 and 12),
  end_year smallint check (end_year between 1950 and 2100),
  image_path text,
  github_url text,
  live_url text,
  is_featured boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint projects_slug_format check (
    slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'
  )
);

create table public.project_skills (
  project_id uuid not null references public.projects (id) on delete cascade,
  skill_id uuid not null references public.skills (id) on delete cascade,
  primary key (project_id, skill_id)
);

-- ---------------------------------------------------------------------------
-- Certificates
-- ---------------------------------------------------------------------------
create table public.certificates (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete restrict,
  name text not null default '',
  description text not null default '',
  issued_month smallint not null check (issued_month between 1 and 12),
  issued_year smallint not null check (issued_year between 1950 and 2100),
  image_path text,
  pdf_path text,
  credential_url text,
  is_featured boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Social links
-- ---------------------------------------------------------------------------
create table public.social_links (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type public.social_link_type not null default 'professional',
  icon_key text not null default 'link',
  url text not null,
  sort_order int not null default 0,
  is_visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Singleton person guard
-- ---------------------------------------------------------------------------
create or replace function public.enforce_single_person()
returns trigger
language plpgsql
as $$
begin
  if (select count(*) from public.persons) >= 1 then
    raise exception 'Only one person row is allowed in this personal portfolio';
  end if;
  return new;
end;
$$;

create trigger persons_singleton
before insert on public.persons
for each row execute function public.enforce_single_person();

-- ---------------------------------------------------------------------------
-- updated_at
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger persons_updated_at before update on public.persons
for each row execute function public.set_updated_at();
create trigger organizations_updated_at before update on public.organizations
for each row execute function public.set_updated_at();
create trigger skills_updated_at before update on public.skills
for each row execute function public.set_updated_at();
create trigger experiences_updated_at before update on public.experiences
for each row execute function public.set_updated_at();
create trigger educations_updated_at before update on public.educations
for each row execute function public.set_updated_at();
create trigger projects_updated_at before update on public.projects
for each row execute function public.set_updated_at();
create trigger certificates_updated_at before update on public.certificates
for each row execute function public.set_updated_at();
create trigger social_links_updated_at before update on public.social_links
for each row execute function public.set_updated_at();
