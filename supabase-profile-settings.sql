-- Add new columns to profiles table for settings
alter table public.profiles 
add column if not exists phone_number text,
add column if not exists facebook text,
add column if not exists instagram text,
add column if not exists linkedin text,
add column if not exists website text;
