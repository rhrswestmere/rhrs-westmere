-- Add designation request fields to payments table
-- This allows payments to be used for "Request Higher Post" feature
-- status: 'approved' (default for normal donations), 'pending' (for higher post requests), 'rejected'

ALTER TABLE payments ADD COLUMN IF NOT EXISTS requested_level text;
ALTER TABLE payments ADD COLUMN IF NOT EXISTS requested_title text;
ALTER TABLE payments ADD COLUMN IF NOT EXISTS status text DEFAULT 'approved';
ALTER TABLE payments ADD COLUMN IF NOT EXISTS member_id uuid;
