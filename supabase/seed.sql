-- Seed de ejemplo (solo Español).
-- 1) Crear usuario Auth en Dashboard (email/password).
-- 2) Insertar admin (ver setup_admin.sql).
-- Los catálogos ya se insertan en 0001 / 0006 (UUIDs fijos).

insert into public.persons (
  id, first_name, last_name, email, availability_status_id,
  professional_title, subtitle, about,
  meta_title, meta_description
)
select
  '22222222-2222-2222-2222-222222222001',
  'Nombre',
  'Apellido',
  'hola@example.com',
  'a2222222-2222-2222-2222-222222222001', -- Disponible
  'Software Engineer',
  'Diseño y construyo productos digitales con foco en calidad.',
  'Profesional orientado a producto, con experiencia en frontend moderno y sistemas escalables.',
  'Portfolio profesional',
  'Portfolio profesional con proyectos, experiencia y formación.'
where not exists (select 1 from public.persons);

insert into public.organizations (id, name, type_id, website_url, location, description) values
  ('33333333-3333-3333-3333-333333333001', 'Globant', 'a1111111-1111-1111-1111-111111111001', 'https://www.globant.com', 'Buenos Aires', 'Consultora tecnológica global.'),
  ('33333333-3333-3333-3333-333333333002', 'Universidad Nacional', 'a1111111-1111-1111-1111-111111111002', null, 'Mar del Plata', 'Institución universitaria.'),
  ('33333333-3333-3333-3333-333333333003', 'AWS', 'a1111111-1111-1111-1111-111111111001', 'https://aws.amazon.com', 'Estados Unidos', 'Proveedor cloud.'),
  ('33333333-3333-3333-3333-333333333004', 'Proyecto Personal', 'a1111111-1111-1111-1111-111111111005', null, null, 'Proyectos independientes.')
on conflict do nothing;

insert into public.skills (id, name, type_id, sort_order, label) values
  ('44444444-4444-4444-4444-444444444001', 'TypeScript', 'a5555555-5555-5555-5555-555555555001', 1, 'TypeScript'),
  ('44444444-4444-4444-4444-444444444002', 'React', 'a5555555-5555-5555-5555-555555555002', 2, 'React'),
  ('44444444-4444-4444-4444-444444444003', 'Next.js', 'a5555555-5555-5555-5555-555555555002', 3, 'Next.js'),
  ('44444444-4444-4444-4444-444444444004', 'PostgreSQL', 'a5555555-5555-5555-5555-555555555006', 4, 'PostgreSQL'),
  ('44444444-4444-4444-4444-444444444005', 'Supabase', 'a5555555-5555-5555-5555-555555555008', 5, 'Supabase'),
  ('44444444-4444-4444-4444-444444444006', 'Tailwind CSS', 'a5555555-5555-5555-5555-555555555002', 6, 'Tailwind CSS'),
  ('44444444-4444-4444-4444-444444444007', 'Liderazgo', 'a5555555-5555-5555-5555-555555555004', 7, 'Liderazgo')
on conflict (name) do nothing;

insert into public.experiences (
  id, organization_id, type_id, start_month, start_year,
  end_month, end_year, is_current, sort_order, title, description
) values (
  '55555555-5555-5555-5555-555555555001',
  '33333333-3333-3333-3333-333333333001',
  'a3333333-3333-3333-3333-333333333002', -- Híbrido
  3, 2022, null, null, true, 1,
  'Frontend Developer',
  'Desarrollo de interfaces con React y TypeScript.'
) on conflict do nothing;

insert into public.experience_skills (experience_id, skill_id) values
  ('55555555-5555-5555-5555-555555555001', '44444444-4444-4444-4444-444444444001'),
  ('55555555-5555-5555-5555-555555555001', '44444444-4444-4444-4444-444444444002'),
  ('55555555-5555-5555-5555-555555555001', '44444444-4444-4444-4444-444444444003')
on conflict do nothing;

insert into public.educations (
  id, organization_id, type_id, start_month, start_year,
  end_month, end_year, is_current, sort_order, title, description
) values (
  '66666666-6666-6666-6666-666666666001',
  '33333333-3333-3333-3333-333333333002',
  'a4444444-4444-4444-4444-444444444001', -- Carrera
  3, 2018, 12, 2022, false, 1,
  'Licenciatura en Sistemas',
  'Formación en ingeniería de software y bases de datos.'
) on conflict do nothing;

insert into public.education_skills (education_id, skill_id) values
  ('66666666-6666-6666-6666-666666666001', '44444444-4444-4444-4444-444444444004')
on conflict do nothing;

insert into public.projects (
  id, organization_id, slug, start_month, start_year,
  image_path, github_url, live_url, is_featured, sort_order,
  name, summary, description
) values
  (
    '77777777-7777-7777-7777-777777777001',
    '33333333-3333-3333-3333-333333333004',
    'erp-webservices', 1, 2023,
    null, 'https://github.com/example/erp-webservices', null, true, 1,
    'ERP Web Services', 'API e integración para ERP.',
    'Sistema de servicios web para integración con ERP.'
  ),
  (
    '77777777-7777-7777-7777-777777777002',
    '33333333-3333-3333-3333-333333333004',
    'portfolio-next', 6, 2024,
    null, 'https://github.com/example/portfolio-next', null, true, 2,
    'Portfolio Next', 'Portfolio con CMS en Supabase.',
    'Portfolio profesional con panel de administración.'
  ),
  (
    '77777777-7777-7777-7777-777777777003',
    null, 'music-tab', 2, 2024,
    null, 'https://github.com/example/music-tab', null, false, 3,
    'Music Tab', 'App de tablaturas.',
    'Aplicación para gestionar tablaturas musicales.'
  )
on conflict (slug) do nothing;

insert into public.project_skills (project_id, skill_id) values
  ('77777777-7777-7777-7777-777777777001', '44444444-4444-4444-4444-444444444001'),
  ('77777777-7777-7777-7777-777777777001', '44444444-4444-4444-4444-444444444004'),
  ('77777777-7777-7777-7777-777777777002', '44444444-4444-4444-4444-444444444003'),
  ('77777777-7777-7777-7777-777777777002', '44444444-4444-4444-4444-444444444005'),
  ('77777777-7777-7777-7777-777777777003', '44444444-4444-4444-4444-444444444002')
on conflict do nothing;

insert into public.certificates (
  id, organization_id, issued_month, issued_year, is_featured, sort_order,
  name, description
) values (
  '88888888-8888-8888-8888-888888888001',
  '33333333-3333-3333-3333-333333333003',
  8, 2023, true, 1,
  'AWS Cloud Practitioner',
  'Fundamentos de la nube AWS.'
) on conflict do nothing;

insert into public.social_links (id, name, type_id, icon_key, url, sort_order, is_visible) values
  ('99999999-9999-9999-9999-999999999001', 'GitHub', 'a6666666-6666-6666-6666-666666666001', 'github', 'https://github.com/example', 1, true),
  ('99999999-9999-9999-9999-999999999002', 'LinkedIn', 'a6666666-6666-6666-6666-666666666001', 'linkedin', 'https://linkedin.com/in/example', 2, true),
  ('99999999-9999-9999-9999-999999999003', 'Email', 'a6666666-6666-6666-6666-666666666003', 'mail', 'mailto:hola@example.com', 3, true)
on conflict do nothing;
