-- ========================================
-- FIX ADMIN PERMISSIONS & RLS RECURSION
-- ========================================

-- 1. Create a safe, non-recursive function to check admin status
-- This function bypasses RLS on the profiles table using SECURITY DEFINER
-- AND explicitly avoids self-referential policy queries by selecting raw data
CREATE OR REPLACE FUNCTION public.check_is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    is_admin_val BOOLEAN;
BEGIN
    -- Directly query the table, bypassing RLS (due to SECURITY DEFINER)
    SELECT is_admin INTO is_admin_val
    FROM public.profiles
    WHERE id = auth.uid();

    RETURN COALESCE(is_admin_val, false);
END;
$$;

-- 2. Drop existing problematic policies
DROP POLICY IF EXISTS "Admins can delete any agency" ON public.agencies;
DROP POLICY IF EXISTS "Admins can update any agency" ON public.agencies;
DROP POLICY IF EXISTS "Admins can view any agency" ON public.agencies;

-- 3. Re-create robust policies using the safe function
CREATE POLICY "Admins can delete any agency"
ON public.agencies FOR DELETE
TO authenticated
USING (check_is_admin());

CREATE POLICY "Admins can update any agency"
ON public.agencies FOR UPDATE
TO authenticated
USING (check_is_admin());

CREATE POLICY "Admins can view any agency"
ON public.agencies FOR SELECT
TO authenticated
USING (check_is_admin());

-- 4. Ensure profiles are readable to avoid recursion in other checks
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Profiles are viewable by everyone"
ON public.profiles FOR SELECT
USING (true);

-- 5. Grant explicit delete permissions (just in case they were revoked)
GRANT DELETE ON public.agencies TO authenticated;
GRANT DELETE ON public.agencies TO service_role;

-- 6. Verify the fix
SELECT 
    schemaname, 
    tablename, 
    policyname, 
    permissive, 
    roles, 
    cmd, 
    qual 
FROM pg_policies 
WHERE tablename = 'agencies';
