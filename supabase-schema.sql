-- ============================================
-- ConcursoTrack Database Schema
-- ============================================
-- Run this entire script in Supabase SQL Editor
-- Project: ConcursoTrack (Next.js)
-- Database: PostgreSQL with Row Level Security
-- ============================================

-- Enable UUID extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. PROFILES TABLE
-- ============================================
-- Stores additional user profile information
-- Linked to Supabase auth.users table

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles RLS Policies
CREATE POLICY "Users can view own profile"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS profiles_email_idx ON public.profiles(email);

-- ============================================
-- 2. EXAMS TABLE
-- ============================================
-- Stores Brazilian public exam information

CREATE TABLE IF NOT EXISTS public.exams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Basic Information
  name TEXT NOT NULL,
  public_body TEXT NOT NULL,
  position TEXT NOT NULL,
  exam_board TEXT,
  city TEXT,
  state TEXT,
  
  -- Status (waiting, registered, taken, approved, rejected)
  status TEXT NOT NULL DEFAULT 'waiting' 
    CHECK (status IN ('waiting', 'registered', 'taken', 'approved', 'rejected')),
  
  -- Important Dates (stored as DATE, not TIMESTAMP)
  registration_open DATE,
  registration_deadline DATE,
  payment_deadline DATE,
  exam_date DATE,
  results_date DATE,
  
  -- Documents checklist (stored as JSONB array)
  documents JSONB DEFAULT '[]'::jsonb,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on exams
ALTER TABLE public.exams ENABLE ROW LEVEL SECURITY;

-- Exams RLS Policies
CREATE POLICY "Users can view own exams"
  ON public.exams
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own exams"
  ON public.exams
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own exams"
  ON public.exams
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own exams"
  ON public.exams
  FOR DELETE
  USING (auth.uid() = user_id);

-- Indexes for faster queries
CREATE INDEX IF NOT EXISTS exams_user_id_idx ON public.exams(user_id);
CREATE INDEX IF NOT EXISTS exams_status_idx ON public.exams(status);
CREATE INDEX IF NOT EXISTS exams_exam_date_idx ON public.exams(exam_date);
CREATE INDEX IF NOT EXISTS exams_created_at_idx ON public.exams(created_at DESC);

-- ============================================
-- 3. FUNCTIONS
-- ============================================

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 4. TRIGGERS
-- ============================================

-- Trigger to update updated_at on profiles
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger to update updated_at on exams
DROP TRIGGER IF EXISTS update_exams_updated_at ON public.exams;
CREATE TRIGGER update_exams_updated_at
  BEFORE UPDATE ON public.exams
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger to create profile when user signs up
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- 5. SAMPLE DATA (Optional - for testing)
-- ============================================
-- Uncomment the section below to insert sample data for testing
-- Make sure to replace 'YOUR_USER_ID' with actual user ID after signup

/*
-- Insert sample exam
INSERT INTO public.exams (
  user_id,
  name,
  public_body,
  position,
  exam_board,
  city,
  state,
  status,
  registration_open,
  registration_deadline,
  payment_deadline,
  exam_date,
  results_date,
  documents
) VALUES (
  'YOUR_USER_ID',  -- Replace with actual user ID
  'Analista Judiciário - TRF 3ª Região',
  'Tribunal Regional Federal da 3ª Região',
  'Analista Judiciário - Área Administrativa',
  'FCC',
  'São Paulo',
  'SP',
  'registered',
  '2024-01-15',
  '2024-02-15',
  '2024-02-20',
  '2024-04-15',
  '2024-06-01',
  '["RG", "CPF", "Comprovante de Residência", "Diploma"]'
);
*/

-- ============================================
-- SCHEMA SETUP COMPLETE
-- ============================================

-- Verify tables were created
SELECT 
  tablename,
  tableowner,
  tablespace
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;

-- Verify RLS is enabled
SELECT
  tablename,
  rowsecurity AS rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ Database schema created successfully!';
  RAISE NOTICE '📋 Tables created: profiles, exams';
  RAISE NOTICE '🔒 Row Level Security (RLS) enabled on all tables';
  RAISE NOTICE '⚡ Triggers created for auto-updating timestamps';
  RAISE NOTICE '👤 User profile auto-creation trigger enabled';
  RAISE NOTICE '';
  RAISE NOTICE '🎯 Next Steps:';
  RAISE NOTICE '1. Go to Authentication → Users in Supabase dashboard';
  RAISE NOTICE '2. Test signup in your Next.js app';
  RAISE NOTICE '3. Verify profile is auto-created';
  RAISE NOTICE '4. Start creating exams!';
END $$;
