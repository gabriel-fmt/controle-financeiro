create extension if not exists pgcrypto;

create table if not exists public.admin_users (
  email text primary key,
  created_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admin_users
    where lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

create policy "admins can read own allowlist row"
on public.admin_users for select
to authenticated
using (lower(email) = lower(coalesce(auth.jwt() ->> 'email', '')));

-- Crie o usuário em Supabase Authentication e adicione o e-mail à lista:
-- insert into public.admin_users (email) values ('admin@exemplo.com');
