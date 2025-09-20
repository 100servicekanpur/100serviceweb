-- Setup script for admin user role-based authentication
-- Run this in your Supabase SQL Editor

-- First, ensure RLS is enabled on users table
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.users;
DROP POLICY IF EXISTS "Admins have full access to users" ON public.users;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;

-- Create comprehensive RLS policies
CREATE POLICY "Users can insert their own profile" ON public.users
  FOR INSERT 
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view their own profile" ON public.users
  FOR SELECT 
  USING (auth.uid() = id OR EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "Users can update their own profile" ON public.users
  FOR UPDATE 
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins have full access to users" ON public.users
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Set v9ibhav@gmail.com as admin (update if user already exists)
UPDATE public.users 
SET role = 'admin', is_verified = true, updated_at = NOW()
WHERE email = 'v9ibhav@gmail.com';

-- If the user doesn't exist in the users table yet, they will be created automatically
-- when they first sign in through Clerk, and the role will be set to 'admin' 
-- based on the email check in the AuthContext.

-- Grant necessary permissions for the application
GRANT ALL ON public.users TO authenticated;
GRANT ALL ON public.services TO authenticated;
GRANT ALL ON public.bookings TO authenticated;
GRANT ALL ON public.service_assignments TO authenticated;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);

-- Create function to automatically set admin role for specific email
CREATE OR REPLACE FUNCTION set_admin_role()
RETURNS TRIGGER AS $$
BEGIN
  -- Set admin role for v9ibhav@gmail.com
  IF NEW.email = 'v9ibhav@gmail.com' THEN
    NEW.role = 'admin';
    NEW.is_verified = true;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically set admin role on insert
DROP TRIGGER IF EXISTS trigger_set_admin_role ON public.users;
CREATE TRIGGER trigger_set_admin_role
  BEFORE INSERT ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION set_admin_role();