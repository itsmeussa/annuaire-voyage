-- ========================================
-- IMPLEMENT SOFT DELETE & 24H RETENTION
-- ========================================

-- 1. Add deleted_at column
ALTER TABLE public.agencies 
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ DEFAULT NULL;

-- 2. Index for performance
CREATE INDEX IF NOT EXISTS idx_agencies_deleted_at ON public.agencies(deleted_at);

-- 3. Function to clean up old deleted agencies (Permanent Delete)
-- This function deletes agencies that have been "soft deleted" for more than 24 hours
CREATE OR REPLACE FUNCTION public.cleanup_soft_deleted_agencies()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    DELETE FROM public.agencies
    WHERE deleted_at IS NOT NULL 
    AND deleted_at < NOW() - INTERVAL '24 hours';
END;
$$;

-- 4. (Optional) You can run this function periodically using pg_cron or manually
-- SELECT public.cleanup_soft_deleted_agencies();

-- 5. Update RLS to prevent public access to deleted agencies (Safety Net)
-- Only allow "active" agencies (deleted_at IS NULL) to be viewed by public
DROP POLICY IF EXISTS "Allow public read access" ON public.agencies;
CREATE POLICY "Allow public read access" ON public.agencies
  FOR SELECT
  TO public
  USING (deleted_at IS NULL);
