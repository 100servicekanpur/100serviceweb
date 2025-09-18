-- Add default admin user to the database
-- This script should be run after the main schema is created

-- Note: This creates a user in the public.users table, but you'll need to create
-- the corresponding auth.users entry through Supabase Auth signup first

-- Default admin credentials:
-- Email: v9ibhav@gmail.com
-- Password: Vaibhav@1233

-- After creating the auth user through signup, update the role to admin:
UPDATE public.users 
SET role = 'admin', 
    full_name = 'System Administrator',
    is_verified = true
WHERE email = 'v9ibhav@gmail.com';

-- Create additional admin policies for unrestricted access
CREATE POLICY "Admins have full access" ON public.users
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can manage services" ON public.services
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can manage bookings" ON public.bookings
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can manage categories" ON public.categories
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can manage ratings" ON public.ratings
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can manage frontend_settings" ON public.frontend_settings
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can manage site_settings" ON public.site_settings
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );