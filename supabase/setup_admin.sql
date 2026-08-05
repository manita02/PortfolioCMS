-- Admin actual (usuario Auth confirmado).
-- Si recreás el usuario, actualizá el UUID con:
--   select id, email from auth.users order by created_at desc;

insert into public.admins (user_id, email)
values (
  '7de93fe5-ed20-4f8c-81a8-939b1f57ddc0',
  'manitacoqui@gmail.com'
)
on conflict (user_id) do update
set email = excluded.email;
