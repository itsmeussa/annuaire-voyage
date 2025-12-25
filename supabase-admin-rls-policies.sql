-- ========================================
-- CREATE TABLES IF NOT EXISTS
-- ========================================

-- Services table
CREATE TABLE IF NOT EXISTS public.services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  agency_id UUID NOT NULL REFERENCES public.agencies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS services_agency_id_idx ON public.services(agency_id);

-- Experiences table  
CREATE TABLE IF NOT EXISTS public.experiences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  agency_id UUID NOT NULL REFERENCES public.agencies(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS experiences_agency_id_idx ON public.experiences(agency_id);

-- Enable RLS on tables
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experiences ENABLE ROW LEVEL SECURITY;

-- ========================================
-- ADMIN RLS POLICIES - FULL CONTROL
-- ========================================
-- Give admins full access to all tables

-- Helper function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid()
        AND profiles.is_admin = true
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ========================================
-- AGENCIES TABLE
-- ========================================

-- Admins can SELECT any agency
DROP POLICY IF EXISTS "Admins can view any agency" ON public.agencies;
CREATE POLICY "Admins can view any agency"
ON public.agencies FOR SELECT
TO authenticated
USING (is_admin());

-- Admins can UPDATE any agency
DROP POLICY IF EXISTS "Admins can update any agency" ON public.agencies;
CREATE POLICY "Admins can update any agency"
ON public.agencies FOR UPDATE
TO authenticated
USING (is_admin());

-- Admins can DELETE any agency
DROP POLICY IF EXISTS "Admins can delete any agency" ON public.agencies;
CREATE POLICY "Admins can delete any agency"
ON public.agencies FOR DELETE
TO authenticated
USING (is_admin());

-- Admins can INSERT agencies
DROP POLICY IF EXISTS "Admins can insert agencies" ON public.agencies;
CREATE POLICY "Admins can insert agencies"
ON public.agencies FOR INSERT
TO authenticated
WITH CHECK (is_admin());

-- ========================================
-- SERVICES TABLE
-- ========================================

-- Admins can SELECT any service
DROP POLICY IF EXISTS "Admins can view any service" ON public.services;
CREATE POLICY "Admins can view any service"
ON public.services FOR SELECT
TO authenticated
USING (is_admin());

-- Admins can INSERT services for any agency
DROP POLICY IF EXISTS "Admins can insert any service" ON public.services;
CREATE POLICY "Admins can insert any service"
ON public.services FOR INSERT
TO authenticated
WITH CHECK (is_admin());

-- Admins can UPDATE any service
DROP POLICY IF EXISTS "Admins can update any service" ON public.services;
CREATE POLICY "Admins can update any service"
ON public.services FOR UPDATE
TO authenticated
USING (is_admin());

-- Admins can DELETE any service
DROP POLICY IF EXISTS "Admins can delete any service" ON public.services;
CREATE POLICY "Admins can delete any service"
ON public.services FOR DELETE
TO authenticated
USING (is_admin());

-- ========================================
-- EXPERIENCES TABLE
-- ========================================

-- Admins can SELECT any experience
DROP POLICY IF EXISTS "Admins can view any experience" ON public.experiences;
CREATE POLICY "Admins can view any experience"
ON public.experiences FOR SELECT
TO authenticated
USING (is_admin());

-- Admins can INSERT experiences for any agency
DROP POLICY IF EXISTS "Admins can insert any experience" ON public.experiences;
CREATE POLICY "Admins can insert any experience"
ON public.experiences FOR INSERT
TO authenticated
WITH CHECK (is_admin());

-- Admins can UPDATE any experience
DROP POLICY IF EXISTS "Admins can update any experience" ON public.experiences;
CREATE POLICY "Admins can update any experience"
ON public.experiences FOR UPDATE
TO authenticated
USING (is_admin());

-- Admins can DELETE any experience
DROP POLICY IF EXISTS "Admins can delete any experience" ON public.experiences;
CREATE POLICY "Admins can delete any experience"
ON public.experiences FOR DELETE
TO authenticated
USING (is_admin());

-- ========================================
-- ACCESS REQUESTS TABLE
-- ========================================

-- Admins can view all access requests
DROP POLICY IF EXISTS "Admins can view access requests" ON public.agency_access_requests;
CREATE POLICY "Admins can view access requests"
ON public.agency_access_requests FOR SELECT
TO authenticated
USING (is_admin());

-- Admins can update access requests
DROP POLICY IF EXISTS "Admins can update access requests" ON public.agency_access_requests;
CREATE POLICY "Admins can update access requests" 
ON public.agency_access_requests FOR UPDATE
TO authenticated
USING (is_admin());

-- Admins can delete access requests
DROP POLICY IF EXISTS "Admins can delete access requests" ON public.agency_access_requests;
CREATE POLICY "Admins can delete access requests"
ON public.agency_access_requests FOR DELETE
TO authenticated
USING (is_admin());

-- ========================================
-- PROFILES TABLE
-- ========================================

-- Admins can view all profiles
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
CREATE POLICY "Admins can view all profiles"
ON public.profiles FOR SELECT
TO authenticated
USING (is_admin());

-- Admins can update any profile (e.g., grant/revoke admin)
DROP POLICY IF EXISTS "Admins can update any profile" ON public.profiles;
CREATE POLICY "Admins can update any profile"
ON public.profiles FOR UPDATE
TO authenticated
USING (is_admin());

-- ========================================
-- REGULAR USER POLICIES (for services & experiences)
-- ========================================

-- Users can view services for approved agencies
DROP POLICY IF EXISTS "Anyone can view services for approved agencies" ON public.services;
CREATE POLICY "Anyone can view services for approved agencies"
ON public.services FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.agencies
        WHERE agencies.id = services.agency_id
        AND agencies.status = 'approved'
    )
);

-- Agency owners can insert services
DROP POLICY IF EXISTS "Agency owners can insert services" ON public.services;
CREATE POLICY "Agency owners can insert services"
ON public.services FOR INSERT
TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.agencies
        WHERE agencies.id = services.agency_id
        AND agencies.owner_id = auth.uid()
    )
);

-- Agency owners can update their services
DROP POLICY IF EXISTS "Agency owners can update services" ON public.services;
CREATE POLICY "Agency owners can update services"
ON public.services FOR UPDATE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.agencies
        WHERE agencies.id = services.agency_id
        AND agencies.owner_id = auth.uid()
    )
);

-- Agency owners can delete their services
DROP POLICY IF EXISTS "Agency owners can delete services" ON public.services;
CREATE POLICY "Agency owners can delete services"
ON public.services FOR DELETE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.agencies
        WHERE agencies.id = services.agency_id
        AND agencies.owner_id = auth.uid()
    )
);

-- Users can view experiences for approved agencies
DROP POLICY IF EXISTS "Anyone can view experiences for approved agencies" ON public.experiences;
CREATE POLICY "Anyone can view experiences for approved agencies"
ON public.experiences FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.agencies
        WHERE agencies.id = experiences.agency_id
        AND agencies.status = 'approved'
    )
);

-- Agency owners can insert experiences
DROP POLICY IF EXISTS "Agency owners can insert experiences" ON public.experiences;
CREATE POLICY "Agency owners can insert experiences"
ON public.experiences FOR INSERT
TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.agencies
        WHERE agencies.id = experiences.agency_id
        AND agencies.owner_id = auth.uid()
    )
);

-- Agency owners can update their experiences
DROP POLICY IF EXISTS "Agency owners can update experiences" ON public.experiences;
CREATE POLICY "Agency owners can update experiences"
ON public.experiences FOR UPDATE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.agencies
        WHERE agencies.id = experiences.agency_id
        AND agencies.owner_id = auth.uid()
    )
);

-- Agency owners can delete their experiences
DROP POLICY IF EXISTS "Agency owners can delete experiences" ON public.experiences;
CREATE POLICY "Agency owners can delete experiences"
ON public.experiences FOR DELETE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.agencies
        WHERE agencies.id = experiences.agency_id
        AND agencies.owner_id = auth.uid()
    )
);

-- ========================================
-- VERIFICATION
-- ========================================

-- Check current user's admin status
SELECT 
    auth.uid() as current_user_id,
    is_admin() as is_current_user_admin;
