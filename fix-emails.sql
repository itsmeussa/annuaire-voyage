-- ========================================
-- FIX: POPULATE EMAILS FOR EXISTING USERS
-- ========================================
-- This backfills email data for users who signed up before the migration

-- Insert or update profiles for all existing users
INSERT INTO public.profiles (id, email, full_name, avatar_url)
SELECT 
    id,
    email,
    COALESCE(raw_user_meta_data->>'full_name', raw_user_meta_data->>'name') as full_name,
    raw_user_meta_data->>'avatar_url' as avatar_url
FROM auth.users
ON CONFLICT (id) DO UPDATE
SET 
    email = EXCLUDED.email,
    full_name = COALESCE(EXCLUDED.full_name, public.profiles.full_name),
    avatar_url = COALESCE(EXCLUDED.avatar_url, public.profiles.avatar_url);

-- Verify emails are now populated
SELECT id, email, full_name, is_admin, created_at
FROM public.profiles
ORDER BY created_at DESC;
