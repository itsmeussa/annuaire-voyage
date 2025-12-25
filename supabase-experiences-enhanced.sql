-- Add new columns to experiences table for more details
alter table public.experiences 
add column if not exists location text,
add column if not exists price decimal(10,2),
add column if not exists currency text default 'USD',
add column if not exists duration text,
add column if not exists max_participants integer,
add column if not exists highlights text[];
