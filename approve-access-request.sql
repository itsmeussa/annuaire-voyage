-- How to Properly Approve an Access Request
-- Run this in Supabase SQL Editor

-- STEP 1: Find the request details
SELECT 
  aar.id as request_id,
  aar.user_id,
  aar.user_email,
  aar.user_name,
  aar.message,
  a.id as agency_id,
  a.title as agency_title,
  a.owner_id as current_owner_id
FROM agency_access_requests aar
JOIN agencies a ON a.id = aar.agency_id
WHERE aar.status = 'pending'
ORDER BY aar.created_at DESC;

-- STEP 2: Approve the request (replace with actual IDs from STEP 1)
-- This is a TRANSACTION - both updates must succeed or both will rollback

BEGIN;

-- Grant ownership by setting owner_id in agencies table
UPDATE agencies 
SET owner_id = 'PASTE_USER_ID_HERE'  -- From step 1: aar.user_id
WHERE id = 'PASTE_AGENCY_ID_HERE';    -- From step 1: a.id

-- Mark request as approved
UPDATE agency_access_requests
SET 
  status = 'approved', 
  reviewed_at = NOW()
WHERE id = 'PASTE_REQUEST_ID_HERE';   -- From step 1: aar.id

COMMIT;

-- STEP 3: Verify the approval worked
SELECT 
  a.title,
  a.owner_id,
  aar.status,
  aar.reviewed_at
FROM agencies a
JOIN agency_access_requests aar ON aar.agency_id = a.id
WHERE aar.id = 'PASTE_REQUEST_ID_HERE';  -- Same request ID from STEP 2
