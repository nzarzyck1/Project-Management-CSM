create table if not exists public.launchpad_merchants (
  id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  dba_name text,
  mid text,
  task_name text,
  stage text,
  programming_type text,
  merchant_data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.launchpad_merchants enable row level security;

drop policy if exists "launchpad_select_own_merchants" on public.launchpad_merchants;
create policy "launchpad_select_own_merchants"
on public.launchpad_merchants
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "launchpad_insert_own_merchants" on public.launchpad_merchants;
create policy "launchpad_insert_own_merchants"
on public.launchpad_merchants
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "launchpad_update_own_merchants" on public.launchpad_merchants;
create policy "launchpad_update_own_merchants"
on public.launchpad_merchants
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "launchpad_delete_own_merchants" on public.launchpad_merchants;
create policy "launchpad_delete_own_merchants"
on public.launchpad_merchants
for delete
to authenticated
using (auth.uid() = user_id);

create index if not exists launchpad_merchants_user_updated_idx
on public.launchpad_merchants (user_id, updated_at desc);

create index if not exists launchpad_merchants_user_dba_idx
on public.launchpad_merchants (user_id, dba_name);

create index if not exists launchpad_merchants_user_mid_idx
on public.launchpad_merchants (user_id, mid);

create table if not exists public.launchpad_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  approved boolean not null default false,
  is_admin boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.launchpad_is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce((select is_admin from public.launchpad_profiles where user_id = auth.uid()), false);
$$;

create or replace function public.launchpad_is_approved()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce((select approved from public.launchpad_profiles where user_id = auth.uid()), false);
$$;

create or replace function public.launchpad_create_profile()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.launchpad_profiles (user_id, email, approved, is_admin)
  values (
    new.id,
    coalesce(new.email, ''),
    lower(coalesce(new.email, '')) = 'ngzarzycki@gmail.com',
    lower(coalesce(new.email, '')) = 'ngzarzycki@gmail.com'
  )
  on conflict (user_id) do update set email = excluded.email;
  return new;
end;
$$;

drop trigger if exists launchpad_auth_user_created on auth.users;
create trigger launchpad_auth_user_created
after insert or update of email on auth.users
for each row execute procedure public.launchpad_create_profile();

insert into public.launchpad_profiles (user_id, email, approved, is_admin)
select id, coalesce(email, ''), lower(coalesce(email, '')) = 'ngzarzycki@gmail.com', lower(coalesce(email, '')) = 'ngzarzycki@gmail.com'
from auth.users
on conflict (user_id) do update set
  email = excluded.email,
  approved = public.launchpad_profiles.approved or excluded.approved,
  is_admin = public.launchpad_profiles.is_admin or excluded.is_admin;

alter table public.launchpad_profiles enable row level security;

drop policy if exists "launchpad_profiles_select" on public.launchpad_profiles;
create policy "launchpad_profiles_select"
on public.launchpad_profiles for select to authenticated
using (auth.uid() = user_id or public.launchpad_is_admin());

drop policy if exists "launchpad_profiles_admin_update" on public.launchpad_profiles;
create policy "launchpad_profiles_admin_update"
on public.launchpad_profiles for update to authenticated
using (public.launchpad_is_admin())
with check (public.launchpad_is_admin());

drop policy if exists "launchpad_select_own_merchants" on public.launchpad_merchants;
create policy "launchpad_select_own_merchants"
on public.launchpad_merchants for select to authenticated
using (auth.uid() = user_id and public.launchpad_is_approved());

drop policy if exists "launchpad_insert_own_merchants" on public.launchpad_merchants;
create policy "launchpad_insert_own_merchants"
on public.launchpad_merchants for insert to authenticated
with check (auth.uid() = user_id and public.launchpad_is_approved());

drop policy if exists "launchpad_update_own_merchants" on public.launchpad_merchants;
create policy "launchpad_update_own_merchants"
on public.launchpad_merchants for update to authenticated
using (auth.uid() = user_id and public.launchpad_is_approved())
with check (auth.uid() = user_id and public.launchpad_is_approved());

drop policy if exists "launchpad_delete_own_merchants" on public.launchpad_merchants;
create policy "launchpad_delete_own_merchants"
on public.launchpad_merchants for delete to authenticated
using (auth.uid() = user_id and public.launchpad_is_approved());
