-- =====================================================
-- TEST USERS FOR ZENCODE POS
-- Run this in Supabase SQL Editor
-- =====================================================

-- STEP 1: Create users table if not exists
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE,
  name TEXT,
  role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('superadmin', 'admin', 'cashier', 'customer')),
  branch_id UUID REFERENCES branches(id),
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own data
CREATE POLICY "Users can view own data" ON public.users
  FOR SELECT USING (auth.uid() = id);

-- Policy: Superadmin can view all users
CREATE POLICY "Superadmin can view all users" ON public.users
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'superadmin'
    )
  );

-- =====================================================
-- STEP 2: Create test users via Supabase Auth
-- Go to: Authentication > Users > Add user (Confirm email checked)
-- 
-- Create these 4 users with password: Test@123
-- 
-- 1. superadmin@test.com
-- 2. admin@test.com
-- 3. cashier@test.com
-- 4. customer@test.com
-- =====================================================

-- STEP 3: After creating auth users, get their UUIDs from auth.users table
-- and insert into public.users with correct roles:

-- Example (replace UUIDs with actual ones from auth.users):
/*
INSERT INTO public.users (id, email, name, role) VALUES
  ('replace-with-superadmin-uuid', 'superadmin@test.com', 'Super Admin', 'superadmin'),
  ('replace-with-admin-uuid', 'admin@test.com', 'Admin User', 'admin'),
  ('replace-with-cashier-uuid', 'cashier@test.com', 'Cashier User', 'cashier'),
  ('replace-with-customer-uuid', 'customer@test.com', 'Customer User', 'customer');
*/

-- OR use this auto-insert trigger for new users:
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name, role)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    COALESCE(NEW.raw_user_meta_data->>'role', 'customer')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- TEST ACCOUNTS SUMMARY
-- =====================================================
-- Email                  | Password  | Role
-- -----------------------|-----------|------------
-- superadmin@test.com    | Test@123  | superadmin
-- admin@test.com         | Test@123  | admin
-- cashier@test.com       | Test@123  | cashier
-- customer@test.com      | Test@123  | customer
-- =====================================================
