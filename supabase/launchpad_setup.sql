create table if not exists public.launchpad_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  approved boolean not null default false,
  is_admin boolean not null default false,
  read_only boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.launchpad_profiles
add column if not exists read_only boolean not null default false;

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

create table if not exists public.launchpad_account_access (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid not null references auth.users(id) on delete cascade,
  owner_email text not null,
  viewer_user_id uuid references auth.users(id) on delete cascade,
  viewer_email text not null,
  access_level text not null default 'read' check (access_level = 'read'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.launchpad_account_access
alter column viewer_user_id drop not null;

alter table public.launchpad_account_access
drop constraint if exists launchpad_account_access_owner_user_id_viewer_user_id_key;

create index if not exists launchpad_merchants_user_updated_idx
on public.launchpad_merchants (user_id, updated_at desc);

create index if not exists launchpad_merchants_user_dba_idx
on public.launchpad_merchants (user_id, dba_name);

create index if not exists launchpad_merchants_user_mid_idx
on public.launchpad_merchants (user_id, mid);

create index if not exists launchpad_account_access_owner_idx
on public.launchpad_account_access (owner_user_id, viewer_email);

create index if not exists launchpad_account_access_viewer_idx
on public.launchpad_account_access (viewer_user_id, owner_email);

create unique index if not exists launchpad_account_access_owner_viewer_email_idx
on public.launchpad_account_access (owner_user_id, lower(viewer_email));

create or replace function public.launchpad_is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select lower(coalesce(auth.jwt() ->> 'email', '')) = 'ngzarzycki@gmail.com';
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

create or replace function public.launchpad_can_write()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce((
    select approved and not read_only
    from public.launchpad_profiles
    where user_id = auth.uid()
  ), false);
$$;

create or replace function public.launchpad_can_view_merchants(owner_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(auth.uid() = owner_id and public.launchpad_is_approved(), false)
    or exists (
    select 1
    from public.launchpad_account_access access
    where access.owner_user_id = owner_id
      and (
        access.viewer_user_id = auth.uid()
        or lower(access.viewer_email) = lower(coalesce(auth.jwt() ->> 'email', ''))
      )
      and access.access_level = 'read'
  );
$$;

create or replace function public.launchpad_create_profile()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.launchpad_profiles (user_id, email, approved, is_admin, read_only)
  values (
    new.id,
    coalesce(new.email, ''),
    lower(coalesce(new.email, '')) = 'ngzarzycki@gmail.com',
    lower(coalesce(new.email, '')) = 'ngzarzycki@gmail.com',
    false
  )
  on conflict (user_id) do update set
    email = excluded.email,
    updated_at = now();
  return new;
end;
$$;

drop trigger if exists launchpad_auth_user_created on auth.users;
create trigger launchpad_auth_user_created
after insert or update of email on auth.users
for each row execute procedure public.launchpad_create_profile();

insert into public.launchpad_profiles (user_id, email, approved, is_admin, read_only)
select
  id,
  coalesce(email, ''),
  lower(coalesce(email, '')) = 'ngzarzycki@gmail.com',
  lower(coalesce(email, '')) = 'ngzarzycki@gmail.com',
  false
from auth.users
on conflict (user_id) do update set
  email = excluded.email,
  approved = public.launchpad_profiles.approved or excluded.approved,
  is_admin = public.launchpad_profiles.is_admin or excluded.is_admin;

alter table public.launchpad_profiles enable row level security;
alter table public.launchpad_merchants enable row level security;
alter table public.launchpad_account_access enable row level security;

drop policy if exists "launchpad_profiles_select" on public.launchpad_profiles;
create policy "launchpad_profiles_select"
on public.launchpad_profiles for select to authenticated
using (true);

drop policy if exists "launchpad_profiles_admin_update" on public.launchpad_profiles;
create policy "launchpad_profiles_admin_update"
on public.launchpad_profiles for update to authenticated
using (public.launchpad_is_admin())
with check (public.launchpad_is_admin());

drop policy if exists "launchpad_account_access_select" on public.launchpad_account_access;
create policy "launchpad_account_access_select"
on public.launchpad_account_access for select to authenticated
using (
  auth.uid() = owner_user_id
  or auth.uid() = viewer_user_id
  or lower(viewer_email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  or public.launchpad_is_admin()
);

drop policy if exists "launchpad_account_access_insert" on public.launchpad_account_access;
create policy "launchpad_account_access_insert"
on public.launchpad_account_access for insert to authenticated
with check (auth.uid() = owner_user_id and public.launchpad_can_write());

drop policy if exists "launchpad_account_access_update" on public.launchpad_account_access;
create policy "launchpad_account_access_update"
on public.launchpad_account_access for update to authenticated
using (auth.uid() = owner_user_id and public.launchpad_can_write())
with check (auth.uid() = owner_user_id and public.launchpad_can_write());

drop policy if exists "launchpad_account_access_delete" on public.launchpad_account_access;
create policy "launchpad_account_access_delete"
on public.launchpad_account_access for delete to authenticated
using (auth.uid() = owner_user_id and public.launchpad_can_write());

drop policy if exists "launchpad_select_own_merchants" on public.launchpad_merchants;
create policy "launchpad_select_own_merchants"
on public.launchpad_merchants for select to authenticated
using (public.launchpad_can_view_merchants(user_id));

drop policy if exists "launchpad_insert_own_merchants" on public.launchpad_merchants;
create policy "launchpad_insert_own_merchants"
on public.launchpad_merchants for insert to authenticated
with check (auth.uid() = user_id and public.launchpad_can_write());

drop policy if exists "launchpad_update_own_merchants" on public.launchpad_merchants;
create policy "launchpad_update_own_merchants"
on public.launchpad_merchants for update to authenticated
using (auth.uid() = user_id and public.launchpad_can_write())
with check (auth.uid() = user_id and public.launchpad_can_write());

drop policy if exists "launchpad_delete_own_merchants" on public.launchpad_merchants;
create policy "launchpad_delete_own_merchants"
on public.launchpad_merchants for delete to authenticated
using (auth.uid() = user_id and public.launchpad_can_write());
