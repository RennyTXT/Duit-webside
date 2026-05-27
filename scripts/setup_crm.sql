-- =======================================================
-- DUIT THAILAND: CRM & AUTHENTICATION DATABASE SETUP
-- =======================================================

-- 1. Create Profiles Table (Customer Data linked to Supabase Auth)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE,
  full_name TEXT,
  phone_number TEXT,
  tier TEXT DEFAULT 'Silver', -- Silver, Gold, Platinum Elite
  duit_coins INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile." ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile." ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Trigger to automatically create a profile when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if exists to prevent errors
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();


-- 2. Create Pets Table (Duit Pet Health Passport)
CREATE TABLE IF NOT EXISTS public.pets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL, -- dog, cat
  breed TEXT,
  size TEXT, -- small, medium, large
  weight DECIMAL(5,2), -- in kg
  birth_date DATE,
  allergies TEXT,
  vaccine_history JSONB DEFAULT '[]'::jsonb, -- Store vaccine records
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for pets
ALTER TABLE public.pets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own pets." ON public.pets FOR SELECT USING (auth.uid() = owner_id);
CREATE POLICY "Users can insert their own pets." ON public.pets FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Users can update their own pets." ON public.pets FOR UPDATE USING (auth.uid() = owner_id);
CREATE POLICY "Users can delete their own pets." ON public.pets FOR DELETE USING (auth.uid() = owner_id);


-- 3. Create Adoptions Table (Adoption & Shelter Spotlight)
CREATE TABLE IF NOT EXISTS public.adoptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL, -- dog, cat
  breed TEXT,
  age TEXT,
  gender TEXT,
  health_status TEXT,
  story TEXT,
  shelter_name TEXT NOT NULL,
  contact_info TEXT NOT NULL,
  image_url TEXT NOT NULL,
  status TEXT DEFAULT 'available', -- available, adopted
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for adoptions
ALTER TABLE public.adoptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Adoptions are viewable by everyone." ON public.adoptions FOR SELECT USING (true);
-- Only admins (managed via a separate role or manual insertion) can insert/update/delete adoptions
