-- Create a table for public profiles using Supabase techniques
create table if not exists public.profiles (
  id uuid not null references auth.users(id) on delete cascade,
  full_name text,
  referral_code text unique,
  referred_by text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (id)
);

-- RLS Policies (Drop existing to avoid errors or just use idempotent creation if possible, but simpler to skip if enabled)
alter table public.profiles enable row level security;

-- Drop policies if they exist to re-create them ensures updates
drop policy if exists "Public profiles are viewable by everyone" on profiles;
create policy "Public profiles are viewable by everyone"
  on profiles for select
  using ( true );

drop policy if exists "Users can insert their own profile" on profiles;
create policy "Users can insert their own profile"
  on profiles for insert
  with check ( auth.uid() = id );

drop policy if exists "Users can update own profile" on profiles;
create policy "Users can update own profile"
  on profiles for update
  using ( auth.uid() = id );

-- Function to check if a referral code exists (Secure RPC)
create or replace function check_referral_code(code text)
returns boolean
language plpgsql
security definer
as $$
begin
  return exists (
    select 1 from public.profiles
    where referral_code = code
  );
end;
$$;

-- Function to handle new user signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
as $$
declare
  new_referral_code text;
  referrer_code text;
begin
  -- Generate a unique referral code: First name part + Random chars
  new_referral_code := upper(substring(coalesce(new.raw_user_meta_data->>'full_name', 'USER'), 1, 4)) || '-' || upper(substring(md5(random()::text), 1, 4));
  
  -- Ensure uniqueness (simple loop)
  while exists(select 1 from public.profiles where referral_code = new_referral_code) loop
    new_referral_code := upper(substring(coalesce(new.raw_user_meta_data->>'full_name', 'USER'), 1, 4)) || '-' || upper(substring(md5(random()::text), 1, 4));
  end loop;

  -- Get referrer code from metadata
  referrer_code := new.raw_user_meta_data->>'referred_by';

  -- For mandatory referral:
  -- Only enforce if there is at least one profile already (bootstrapping)
  if exists (select 1 from public.profiles) then
    if referrer_code is null or not exists (select 1 from public.profiles where referral_code = referrer_code) then
        raise exception 'Invalid referral code';
    end if;
  end if;

  insert into public.profiles (id, full_name, referral_code, referred_by)
  values (new.id, new.raw_user_meta_data->>'full_name', new_referral_code, referrer_code);
  
  return new;
end;
$$;

-- Drop trigger if it exists to avoid conflict
drop trigger if exists on_auth_user_created on auth.users;

-- Trigger the function every time a user is created
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
