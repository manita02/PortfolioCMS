create policy skill_types_write on public.skill_types
  for all using (public.is_admin())
  with check (public.is_admin());
