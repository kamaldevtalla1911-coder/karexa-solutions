create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  full_name text not null check (char_length(trim(full_name)) between 2 and 120),
  email text not null check (char_length(trim(email)) between 3 and 254 and position('@' in email) > 1),
  phone text not null default '' check (char_length(phone) <= 30),
  company text not null default '' check (char_length(company) <= 160),
  service text not null check (
    service in (
      'AppSheet Custom Applications',
      'Business Process Automation',
      'ERP Consultation & Support',
      'Data Management & Reporting',
      'Workflow Optimization'
    )
  ),
  message text not null check (char_length(trim(message)) between 1 and 5000),
  status text not null default 'new' check (status in ('new', 'contacted', 'closed'))
);

alter table public.inquiries enable row level security;

revoke all on table public.inquiries from public, anon, authenticated;
grant insert (full_name, email, phone, company, service, message)
  on table public.inquiries to anon, authenticated;
grant select on table public.inquiries to authenticated;

drop policy if exists inquiries_public_insert on public.inquiries;
create policy inquiries_public_insert
  on public.inquiries
  for insert
  to anon, authenticated
  with check (status = 'new');

drop policy if exists inquiries_admin_read on public.inquiries;
create policy inquiries_admin_read
  on public.inquiries
  for select
  to authenticated
  using (lower(coalesce(auth.jwt() ->> 'email', '')) = 'kamaldevtalla1911@gmail.com');
