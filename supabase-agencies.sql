-- Drop the table if it already exists to ensure a clean slate
DROP TABLE IF EXISTS agencies;

-- Create the agencies table
CREATE TABLE agencies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  total_score DECIMAL(3, 1),
  reviews_count INTEGER,
  street TEXT,
  city TEXT,
  state TEXT,
  country_code TEXT,
  country_normalized TEXT,
  website TEXT,
  phone TEXT,
  category_name TEXT,
  category_normalized TEXT,
  url TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  city_normalized TEXT,
  featured BOOLEAN DEFAULT false,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
-- This blocks all access by default unless a policy allows it.
ALTER TABLE agencies ENABLE ROW LEVEL SECURITY;

-- 1. READ Policy: Allow public read access
-- This allows anyone (anon or authenticated) to run SELECT queries.
CREATE POLICY "Allow public read access" ON agencies
  FOR SELECT
  TO public
  USING (true);

-- 3. WRITE Policy: Implicitly Denied for 'public' and 'anon'
-- We do NOT create any INSERT/UPDATE/DELETE policies for the public role.
-- This ensures that no one can modify the database from the browser console.
-- The 'service_role' (used in migration scripts) always bypasses RLS, so it can still write.

-- 4. INSERT Policy: Allow authenticated users (Admins) to insert
CREATE POLICY "Allow authenticated insert" ON agencies
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX idx_agencies_slug ON agencies(slug);
CREATE INDEX idx_agencies_city_normalized ON agencies(city_normalized);
CREATE INDEX idx_agencies_country_normalized ON agencies(country_normalized);
CREATE INDEX idx_agencies_category_normalized ON agencies(category_normalized);
CREATE INDEX idx_agencies_featured ON agencies(featured);
