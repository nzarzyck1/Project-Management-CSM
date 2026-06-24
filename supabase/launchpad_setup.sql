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

create policy "launchpad_select_own_merchants"
on public.launchpad_merchants
for select
to authenticated
using (auth.uid() = user_id);

create policy "launchpad_insert_own_merchants"
on public.launchpad_merchants
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "launchpad_update_own_merchants"
on public.launchpad_merchants
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

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
