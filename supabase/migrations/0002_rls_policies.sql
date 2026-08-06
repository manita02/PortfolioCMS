-- RLS: visitante = solo lectura; admin = CRUD completo.
-- Nunca desactivar RLS.

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admins a
    where a.user_id = auth.uid()
       or lower(a.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

alter table public.admins enable row level security;
alter table public.organization_types enable row level security;
alter table public.availability_statuses enable row level security;
alter table public.experience_types enable row level security;
alter table public.education_types enable row level security;
alter table public.skill_types enable row level security;
alter table public.social_link_types enable row level security;
alter table public.persons enable row level security;
alter table public.organizations enable row level security;
alter table public.skills enable row level security;
alter table public.experiences enable row level security;
alter table public.experience_skills enable row level security;
alter table public.educations enable row level security;
alter table public.education_skills enable row level security;
alter table public.projects enable row level security;
alter table public.project_skills enable row level security;
alter table public.certificates enable row level security;
alter table public.social_links enable row level security;

-- admins: solo el admin puede leer su fila (gestión insert vía SQL Dashboard)
create policy admins_select on public.admins
  for select using (public.is_admin());

-- Lectura pública (catálogos: solo select; escritura vía SQL/seed)
create policy organization_types_select on public.organization_types for select using (true);
create policy availability_statuses_select on public.availability_statuses for select using (true);
create policy experience_types_select on public.experience_types for select using (true);
create policy education_types_select on public.education_types for select using (true);
create policy skill_types_select on public.skill_types for select using (true);
create policy social_link_types_select on public.social_link_types for select using (true);

create policy persons_select on public.persons for select using (true);
create policy organizations_select on public.organizations for select using (true);
create policy skills_select on public.skills for select using (true);
create policy experiences_select on public.experiences for select using (true);
create policy experience_skills_select on public.experience_skills for select using (true);
create policy educations_select on public.educations for select using (true);
create policy education_skills_select on public.education_skills for select using (true);
create policy projects_select on public.projects for select using (true);
create policy project_skills_select on public.project_skills for select using (true);
create policy certificates_select on public.certificates for select using (true);
create policy social_links_select on public.social_links for select using (true);

-- Escritura solo admin
create policy persons_write on public.persons for all using (public.is_admin()) with check (public.is_admin());
create policy organizations_write on public.organizations for all using (public.is_admin()) with check (public.is_admin());
create policy skills_write on public.skills for all using (public.is_admin()) with check (public.is_admin());
create policy experiences_write on public.experiences for all using (public.is_admin()) with check (public.is_admin());
create policy experience_skills_write on public.experience_skills for all using (public.is_admin()) with check (public.is_admin());
create policy educations_write on public.educations for all using (public.is_admin()) with check (public.is_admin());
create policy education_skills_write on public.education_skills for all using (public.is_admin()) with check (public.is_admin());
create policy projects_write on public.projects for all using (public.is_admin()) with check (public.is_admin());
create policy project_skills_write on public.project_skills for all using (public.is_admin()) with check (public.is_admin());
create policy certificates_write on public.certificates for all using (public.is_admin()) with check (public.is_admin());
create policy social_links_write on public.social_links for all using (public.is_admin()) with check (public.is_admin());
