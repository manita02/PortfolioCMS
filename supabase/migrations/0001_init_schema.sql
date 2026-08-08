-- Portfolio personal — schema definitivo (solo Español).
-- Singleton admin + singleton person. Sin multi-tenant ni tablas de traducción.
-- Los tipos viven en tablas catálogo (id + name), no en enums.

-- ---------------------------------------------------------------------------
-- Catálogos (UUIDs fijos para defaults y seed)
-- ---------------------------------------------------------------------------
create table public.organization_types (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  sort_order int not null default 0
);

create table public.availability_statuses (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  sort_order int not null default 0
);

create table public.experience_types (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  sort_order int not null default 0
);

create table public.experience_modalities (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  sort_order int not null default 0
);

create table public.education_types (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  sort_order int not null default 0
);

create table public.skill_types (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  sort_order int not null default 0
);

create table public.social_link_types (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  sort_order int not null default 0
);

insert into public.organization_types (id, name, sort_order) values
  ('a1111111-1111-1111-1111-111111111001', 'Empresa', 1),
  ('a1111111-1111-1111-1111-111111111002', 'Universidad', 2),
  ('a1111111-1111-1111-1111-111111111003', 'Escuela', 3),
  ('a1111111-1111-1111-1111-111111111004', 'Comunidad', 4),
  ('a1111111-1111-1111-1111-111111111005', 'Otro', 5);

insert into public.availability_statuses (id, name, sort_order) values
  ('a2222222-2222-2222-2222-222222222001', 'Disponible', 1),
  ('a2222222-2222-2222-2222-222222222002', 'Selectivo', 2),
  ('a2222222-2222-2222-2222-222222222003', 'No disponible', 3);

insert into public.experience_types (id, name, sort_order) values
  ('a3333333-3333-3333-3333-333333333001', 'Jornada completa', 1),
  ('a3333333-3333-3333-3333-333333333002', 'Jornada parcial', 2),
  ('a3333333-3333-3333-3333-333333333003', 'Por cuenta propia', 3),
  ('a3333333-3333-3333-3333-333333333004', 'Autónomo', 4),
  ('a3333333-3333-3333-3333-333333333005', 'Contrato por servicio', 5),
  ('a3333333-3333-3333-3333-333333333006', 'Prácticas', 6),
  ('a3333333-3333-3333-3333-333333333007', 'Prácticas laborales', 7),
  ('a3333333-3333-3333-3333-333333333008', 'Trabajo de temporada', 8);

insert into public.experience_modalities (id, name, sort_order) values
  ('a7777777-7777-7777-7777-777777777001', 'Presencial', 1),
  ('a7777777-7777-7777-7777-777777777002', 'Híbrido', 2),
  ('a7777777-7777-7777-7777-777777777003', 'Remoto', 3);

insert into public.education_types (id, name, sort_order) values
  ('a4444444-4444-4444-4444-444444444006', 'Formación académica', 0),
  ('a4444444-4444-4444-4444-444444444001', 'Carrera', 1),
  ('a4444444-4444-4444-4444-444444444002', 'Curso', 2),
  ('a4444444-4444-4444-4444-444444444003', 'Bootcamp', 3),
  ('a4444444-4444-4444-4444-444444444004', 'Programa de certificación', 4),
  ('a4444444-4444-4444-4444-444444444005', 'Otro', 5);

insert into public.skill_types (id, name, sort_order) values
  ('a5555555-5555-5555-5555-555555555010', 'Backend & Lenguajes', 1),
  ('a5555555-5555-5555-5555-555555555011', 'Frontend', 2),
  ('a5555555-5555-5555-5555-555555555012', 'Herramientas & Prácticas', 3),
  ('a5555555-5555-5555-5555-555555555006', 'Base de datos', 4),
  ('a5555555-5555-5555-5555-555555555008', 'Cloud / DevOps', 5),
  ('a5555555-5555-5555-5555-555555555013', 'No visibles', 100);

insert into public.social_link_types (id, name, sort_order) values
  ('a6666666-6666-6666-6666-666666666001', 'Profesional', 1),
  ('a6666666-6666-6666-6666-666666666002', 'Social', 2),
  ('a6666666-6666-6666-6666-666666666003', 'Contacto', 3),
  ('a6666666-6666-6666-6666-666666666004', 'Otro', 4);

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
  availability_status_id uuid not null
    references public.availability_statuses (id) on delete restrict
    default 'a2222222-2222-2222-2222-222222222001',
  professional_title text not null default '',
  subtitle text not null default '',
  about text not null default '',
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
  type_id uuid not null
    references public.organization_types (id) on delete restrict
    default 'a1111111-1111-1111-1111-111111111001',
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
  type_id uuid not null
    references public.skill_types (id) on delete restrict
    default 'a5555555-5555-5555-5555-555555555012',
  icon_path text,
  destacada boolean not null default false,
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
  type_id uuid not null
    references public.experience_types (id) on delete restrict
    default 'a3333333-3333-3333-3333-333333333001',
  modality_id uuid not null
    references public.experience_modalities (id) on delete restrict
    default 'a7777777-7777-7777-7777-777777777003',
  title text not null default '',
  description text not null default '',
  start_month smallint not null check (start_month between 1 and 12),
  start_year smallint not null check (start_year between 1950 and 2100),
  end_month smallint check (end_month between 1 and 12),
  end_year smallint check (end_year between 1950 and 2100),
  is_current boolean not null default false,
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
  type_id uuid not null
    references public.education_types (id) on delete restrict
    default 'a4444444-4444-4444-4444-444444444001',
  title text not null default '',
  description text not null default '',
  start_month smallint not null check (start_month between 1 and 12),
  start_year smallint not null check (start_year between 1950 and 2100),
  end_month smallint check (end_month between 1 and 12),
  end_year smallint check (end_year between 1950 and 2100),
  is_current boolean not null default false,
  diploma_image_path text,
  diploma_pdf_path text,
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
-- Social links
-- ---------------------------------------------------------------------------
create table public.social_links (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type_id uuid not null
    references public.social_link_types (id) on delete restrict
    default 'a6666666-6666-6666-6666-666666666001',
  icon_image text,
  url text not null,
  sort_order int not null default 0,
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
create trigger social_links_updated_at before update on public.social_links
for each row execute function public.set_updated_at();
