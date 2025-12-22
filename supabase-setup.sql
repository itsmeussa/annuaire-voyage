-- Create contacted_agencies table
CREATE TABLE contacted_agencies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  agency_id TEXT NOT NULL UNIQUE,
  contacted BOOLEAN DEFAULT true,
  contacted_by TEXT NOT NULL,
  contacted_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create tried_agencies table
CREATE TABLE tried_agencies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  agency_id TEXT NOT NULL UNIQUE,
  tried BOOLEAN DEFAULT true,
  tried_by TEXT NOT NULL,
  tried_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (optional but recommended)
ALTER TABLE contacted_agencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE tried_agencies ENABLE ROW LEVEL SECURITY;

-- Create policies to allow all operations (for now - you can restrict later)
CREATE POLICY "Allow all operations on contacted_agencies" ON contacted_agencies
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on tried_agencies" ON tried_agencies
  FOR ALL USING (true) WITH CHECK (true);

-- Enable realtime for both tables
ALTER PUBLICATION supabase_realtime ADD TABLE contacted_agencies;
ALTER PUBLICATION supabase_realtime ADD TABLE tried_agencies;
