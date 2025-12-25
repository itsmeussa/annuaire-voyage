-- Add owner_id column to agencies table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'agencies' 
        AND column_name = 'owner_id'
    ) THEN
        ALTER TABLE public.agencies 
        ADD COLUMN owner_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;
        
        -- Create index for faster lookups
        CREATE INDEX IF NOT EXISTS agencies_owner_id_idx ON public.agencies(owner_id);
        
        -- Add comment
        COMMENT ON COLUMN public.agencies.owner_id IS 'User who owns and can manage this agency';
    END IF;
END $$;

-- Update RLS policy to allow agency owners to update their agencies
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'agencies' 
        AND policyname = 'Agency owners can update their agencies'
    ) THEN
        CREATE POLICY "Agency owners can update their agencies" 
        ON public.agencies
        FOR UPDATE
        TO authenticated
        USING (owner_id = auth.uid())
        WITH CHECK (owner_id = auth.uid());
    END IF;
END $$;
