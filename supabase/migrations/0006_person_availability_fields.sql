-- Disponibilidad configurable en persons (label + texto libres)
-- y puesto actual opcional (FK a experiences). Se deja de usar el catálogo.

alter table public.persons
  add column availability_label text not null default 'Disponibilidad',
  add column availability_text text not null default 'Disponible para nuevos desafíos',
  add column currently_working boolean not null default false,
  add column current_experience_id uuid null
    references public.experiences (id) on delete set null;

update public.persons p
set
  availability_text = coalesce(s.name, p.availability_text),
  availability_label = 'Disponibilidad'
from public.availability_statuses s
where p.availability_status_id = s.id;

alter table public.persons
  drop column availability_status_id;

drop policy if exists availability_statuses_select on public.availability_statuses;
drop table if exists public.availability_statuses;
