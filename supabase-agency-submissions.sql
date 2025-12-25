-- Add owner_id and status columns to agencies table
alter table public.agencies 
add column if not exists owner_id uuid references auth.users(id),
add column if not exists status text default 'approved' check (status in ('pending', 'approved', 'rejected'));

-- Update existing agencies to have 'approved' status (legacy data)
update public.agencies set status = 'approved' where status is null;

-- Create index for faster queries
create index if not exists agencies_owner_id_idx on public.agencies(owner_id);
create index if not exists agencies_status_idx on public.agencies(status);

-- Update RLS policy to allow users to insert their own agencies
drop policy if exists "Allow authenticated users to insert agencies" on agencies;
create policy "Allow authenticated users to insert agencies"
  on agencies for insert
  to authenticated
  with check (auth.uid() = owner_id);

-- Allow users to view their own pending agencies
drop policy if exists "Users can view own agencies" on agencies;
create policy "Users can view own agencies"
  on agencies for select
  using (
    status = 'approved' OR 
    (auth.uid() = owner_id)
  );

-- Allow users to update their own pending agencies
drop policy if exists "Users can update own pending agencies" on agencies;
create policy "Users can update own pending agencies"
  on agencies for update
  using (auth.uid() = owner_id AND status = 'pending')
  with check (auth.uid() = owner_id AND status = 'pending');
