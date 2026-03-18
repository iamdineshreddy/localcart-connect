ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS address text DEFAULT '',
  ADD COLUMN IF NOT EXISTS city text DEFAULT '',
  ADD COLUMN IF NOT EXISTS state text DEFAULT '',
  ADD COLUMN IF NOT EXISTS pincode text DEFAULT '',
  ADD COLUMN IF NOT EXISTS latitude double precision,
  ADD COLUMN IF NOT EXISTS longitude double precision;