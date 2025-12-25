-- ========================================
-- MAKE YOURSELF AN ADMIN
-- ========================================
-- Run this AFTER completing supabase-admin-setup.sql

-- Step 1: View all users
SELECT id, email, full_name, is_admin, created_at
FROM public.profiles
ORDER BY created_at DESC;

-- Step 2: Make yourself admin (choose ONE option below)

-- Option A: If your profile exists
-- Replace 'your@email.com' with your actual email
UPDATE public.profiles
SET is_admin = true
WHERE email = 'your@email.com';

-- Option B: If profile doesn't exist yet
-- Replace 'your@email.com' with your actual email
INSERT INTO public.profiles (id, email, is_admin)
SELECT id, email, true
FROM auth.users
WHERE email = 'your@email.com'
ON CONFLICT (id) DO UPDATE
SET is_admin = true;

-- Step 3: Verify it worked
SELECT id, email, full_name, is_admin
FROM public.profiles
WHERE is_admin = true;
