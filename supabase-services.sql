-- Create services table
create table if not exists public.services (
  id uuid default gen_random_uuid() primary key,
  agency_id uuid not null references public.agencies(id) on delete cascade,
  name text not null,
  description text,
  icon text, -- emoji or icon name
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create index for faster lookups
create index if not exists services_agency_id_idx on public.services(agency_id);

-- RLS Policies
alter table public.services enable row level security;

-- Everyone can view services for approved agencies
create policy "Anyone can view services for approved agencies"
  on services for select
  using (
    exists (
      select 1 from public.agencies
      where agencies.id = services.agency_id
      and agencies.status = 'approved'
    )
  );

-- Agency owners can insert services for their agencies
create policy "Agency owners can insert services"
  on services for insert
  to authenticated
  with check (
    exists (
      select 1 from public.agencies
      where agencies.id = services.agency_id
      and agencies.owner_id = auth.uid()
    )
  );

-- Agency owners can update their services
create policy "Agency owners can update services"
  on services for update
  using (
    exists (
      select 1 from public.agencies
      where agencies.id = services.agency_id
      and agencies.owner_id = auth.uid()
    )
  );

-- Agency owners can delete their services
create policy "Agency owners can delete services"
  on services for delete
  using (
    exists (
      select 1 from public.agencies
      where agencies.id = services.agency_id
      and agencies.owner_id = auth.uid()
    )
  );
