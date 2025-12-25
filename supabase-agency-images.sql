-- ========================================
-- ADD IMAGE SUPPORT TO AGENCIES
-- ========================================

-- Add image_url column to agencies table
ALTER TABLE public.agencies 
ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Add comment
COMMENT ON COLUMN public.agencies.image_url IS 'URL of the agency main image stored in Supabase Storage';

-- ========================================
-- SUPABASE STORAGE BUCKET SETUP
-- ========================================

-- Create bucket for agency images (if it doesn't exist)
INSERT INTO storage.buckets (id, name, public)
VALUES ('agency-images', 'agency-images', true)
ON CONFLICT (id) DO NOTHING;

-- ========================================
-- STORAGE POLICIES
-- ========================================

-- Drop existing policies first
DROP POLICY IF EXISTS "Public can view agency images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated can upload agency images" ON storage.objects;
DROP POLICY IF EXISTS "Agency owners can update their images" ON storage.objects;
DROP POLICY IF EXISTS "Agency owners can delete their images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can manage all agency images" ON storage.objects;

-- Allow anyone to view images
CREATE POLICY "Public can view agency images"
ON storage.objects FOR SELECT
USING (bucket_id = 'agency-images');

-- Allow authenticated users to upload images
CREATE POLICY "Authenticated can upload agency images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'agency-images');

-- Allow users to update their own images
CREATE POLICY "Users can update their images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'agency-images');

-- Allow users to delete their own images
CREATE POLICY "Users can delete their images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'agency-images');

-- Admins can do anything with images
CREATE POLICY "Admins can manage all agency images"
ON storage.objects FOR ALL
TO authenticated
USING (
    bucket_id = 'agency-images' AND
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid()
        AND profiles.is_admin = true
    )
);

-- ========================================
-- VERIFICATION
-- ========================================

-- Check if bucket was created
SELECT * FROM storage.buckets WHERE id = 'agency-images';

-- Verify image_url column was added
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'agencies' AND column_name = 'image_url';
