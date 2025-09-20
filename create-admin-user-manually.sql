-- Manual admin user creation script
-- Run this if the automatic user creation is not working

-- First, check if user already exists
SELECT 'Checking existing users...' as status;
SELECT id, email, role, is_verified FROM public.users WHERE email = 'v9ibhav@gmail.com';

-- If no user exists, create the admin user manually
INSERT INTO public.users (email, full_name, name, role, is_verified)
VALUES (
    'v9ibhav@gmail.com',
    'Vaibhav Katiyar',
    'Vaibhav Katiyar', 
    'admin',
    true
)
ON CONFLICT (email) 
DO UPDATE SET 
    role = 'admin',
    is_verified = true,
    full_name = EXCLUDED.full_name,
    name = EXCLUDED.name,
    updated_at = NOW();

-- Verify the user was created/updated
SELECT 'Admin user after creation/update:' as status;
SELECT id, email, full_name, role, is_verified, created_at FROM public.users WHERE email = 'v9ibhav@gmail.com';