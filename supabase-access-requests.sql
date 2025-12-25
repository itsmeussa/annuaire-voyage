-- Create agency_access_requests table
CREATE TABLE IF NOT EXISTS public.agency_access_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  agency_id UUID NOT NULL REFERENCES public.agencies(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  message TEXT,
  user_email TEXT NOT NULL,
  user_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMPTZ
);

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS agency_access_requests_agency_id_idx ON public.agency_access_requests(agency_id);
CREATE INDEX IF NOT EXISTS agency_access_requests_user_id_idx ON public.agency_access_requests(user_id);
CREATE INDEX IF NOT EXISTS agency_access_requests_status_idx ON public.agency_access_requests(status);

-- Unique constraint: one pending request per user per agency
CREATE UNIQUE INDEX IF NOT EXISTS agency_access_requests_unique_pending_idx 
  ON public.agency_access_requests(agency_id, user_id) 
  WHERE status = 'pending';

-- Enable Row Level Security
ALTER TABLE public.agency_access_requests ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own requests
CREATE POLICY "Users can view their own access requests"
  ON public.agency_access_requests
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Policy: Authenticated users can create access requests
CREATE POLICY "Authenticated users can create access requests"
  ON public.agency_access_requests
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1 FROM public.agencies
      WHERE agencies.id = agency_access_requests.agency_id
      AND agencies.owner_id IS NULL
    )
  );

-- Policy: Users can update their own pending requests (e.g., update message)
CREATE POLICY "Users can update their own pending requests"
  ON public.agency_access_requests
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id AND status = 'pending')
  WITH CHECK (auth.uid() = user_id AND status = 'pending');

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_access_request_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to call the function before update
CREATE TRIGGER update_access_request_updated_at_trigger
  BEFORE UPDATE ON public.agency_access_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_access_request_updated_at();

-- Comment on table
COMMENT ON TABLE public.agency_access_requests IS 'Stores requests from users to claim ownership of unclaimed agencies';
