-- Create experiences table
create table if not exists public.experiences (
  id uuid default gen_random_uuid() primary key,
  agency_id uuid not null references public.agencies(id) on delete cascade,
  title text not null,
  description text,
  images text[] default '{}', -- Array of image URLs (max 3)
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create index for faster lookups
create index if not exists experiences_agency_id_idx on public.experiences(agency_id);

-- RLS Policies
alter table public.experiences enable row level security;

-- Everyone can view approved agency experiences
create policy "Anyone can view experiences for approved agencies"
  on experiences for select
  using (
    exists (
      select 1 from public.agencies
      where agencies.id = experiences.agency_id
      and agencies.status = 'approved'
    )
  );

-- Agency owners can insert experiences for their agencies
create policy "Agency owners can insert experiences"
  on experiences for insert
  to authenticated
  with check (
    exists (
      select 1 from public.agencies
      where agencies.id = experiences.agency_id
      and agencies.owner_id = auth.uid()
    )
  );

-- Agency owners can update their experiences
create policy "Agency owners can update experiences"
  on experiences for update
  using (
    exists (
      select 1 from public.agencies
      where agencies.id = experiences.agency_id
      and agencies.owner_id = auth.uid()
    )
  );

-- Agency owners can delete their experiences
create policy "Agency owners can delete experiences"
  on experiences for delete
  using (
    exists (
      select 1 from public.agencies
      where agencies.id = experiences.agency_id
      and agencies.owner_id = auth.uid()
    )
  );

-- Storage bucket setup (run this in Supabase Dashboard > Storage)
-- 1. Create a bucket named 'agency-images' with public access
-- 2. Set policies for upload/delete:
--    - INSERT: authenticated users can upload
--    - SELECT: everyone can view
--    - DELETE: users can delete their own uploads

-- Note: Storage policies are managed through the Supabase Dashboard UI
-- or via SQL using the storage schema
