-- Buckets definitivos — un propósito por bucket.
-- DB solo guarda path relativo al bucket.

insert into storage.buckets (id, name, public)
values
  ('person', 'person', true),
  ('projects', 'projects', true),
  ('organizations', 'organizations', true),
  ('educations', 'educations', true),
  ('certificates', 'certificates', true),
  ('icons', 'icons', true)
on conflict (id) do nothing;

create policy storage_public_read on storage.objects
  for select
  using (bucket_id in (
    'person', 'projects', 'organizations', 'educations',
    'certificates', 'icons'
  ));

create policy storage_admin_insert on storage.objects
  for insert
  with check (
    bucket_id in (
      'person', 'projects', 'organizations', 'educations',
      'certificates', 'icons'
    )
    and public.is_admin()
  );

create policy storage_admin_update on storage.objects
  for update
  using (
    bucket_id in (
      'person', 'projects', 'organizations', 'educations',
      'certificates', 'icons'
    )
    and public.is_admin()
  )
  with check (
    bucket_id in (
      'person', 'projects', 'organizations', 'educations',
      'certificates', 'icons'
    )
    and public.is_admin()
  );

create policy storage_admin_delete on storage.objects
  for delete
  using (
    bucket_id in (
      'person', 'projects', 'organizations', 'educations',
      'certificates', 'icons'
    )
    and public.is_admin()
  );
