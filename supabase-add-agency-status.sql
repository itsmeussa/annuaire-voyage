-- Add status column to agencies table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'agencies' 
        AND column_name = 'status'
    ) THEN
        ALTER TABLE public.agencies 
        ADD COLUMN status TEXT DEFAULT 'approved';
    END IF;
END $$;

-- Update all existing agencies to 'approved' status
UPDATE public.agencies 
SET status = 'approved' 
WHERE status IS NULL;

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_agencies_status ON public.agencies(status);

-- Add comment
COMMENT ON COLUMN public.agencies.status IS 'Agency approval status: pending, approved, rejected';
