-- Update profiles table with new registration fields
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS username TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS address_postal TEXT,
ADD COLUMN IF NOT EXISTS address_basic TEXT,
ADD COLUMN IF NOT EXISTS address_detail TEXT,
ADD COLUMN IF NOT EXISTS home_phone TEXT,
ADD COLUMN IF NOT EXISTS mobile_phone TEXT,
ADD COLUMN IF NOT EXISTS referral_code TEXT,
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'customer'; -- customer, admin

-- Update pets table with nickname
ALTER TABLE public.pets
ADD COLUMN IF NOT EXISTS nickname TEXT;

-- Re-verify RLS policies (Ensure they cover new columns)
-- profiles policies are already restrictive based on id, so no changes needed for RLS logic
-- pets policies are already restrictive based on owner_id, so no changes needed for RLS logic

-- Refresh the handle_new_user function to be more robust if needed
-- (The existing one uses raw_user_meta_data, which we will continue to use for initial name)
