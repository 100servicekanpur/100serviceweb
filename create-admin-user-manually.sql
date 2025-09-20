-- ===============================================
-- MANUAL ADMIN USER CREATION FOR CLERK + SUPABASE
-- ===============================================
-- Run this if automatic user creation is not working
-- This works with the Clerk-compatible database schema

-- First, check if user already exists
SELECT 'Checking existing users...' as status;
SELECT id, email, role, is_verified FROM public.users WHERE email = 'v9ibhav@gmail.com';

-- If no user exists, create the admin user manually with Clerk ID
-- Replace 'user_32xBta9yzysBdC0F4kScowyq5Ai' with your actual Clerk User ID
INSERT INTO public.users (
    id,                                    -- Use your actual Clerk ID here
    email, 
    full_name, 
    role, 
    is_verified
)
VALUES (
    'user_32xBta9yzysBdC0F4kScowyq5Ai',    -- Your Clerk User ID
    'v9ibhav@gmail.com',
    'Vaibhav Katiyar',
    'admin',
    true
)
ON CONFLICT (id) 
DO UPDATE SET 
    role = 'admin',
    is_verified = true,
    full_name = EXCLUDED.full_name,
    updated_at = NOW()
WHERE public.users.email = 'v9ibhav@gmail.com';

-- Also handle email conflicts (in case old user exists)
INSERT INTO public.users (
    id,
    email, 
    full_name, 
    role, 
    is_verified
)
VALUES (
    'user_32xBta9yzysBdC0F4kScowyq5Ai',
    'v9ibhav@gmail.com',
    'Vaibhav Katiyar',
    'admin',
    true
)
ON CONFLICT (email) 
DO UPDATE SET 
    id = EXCLUDED.id,                      -- Update to use Clerk ID
    role = 'admin',
    is_verified = true,
    full_name = EXCLUDED.full_name,
    updated_at = NOW();

-- Verify the user was created/updated
SELECT 'Admin user after creation/update:' as status;
SELECT id, email, full_name, role, is_verified, created_at 
FROM public.users 
WHERE email = 'v9ibhav@gmail.com' OR id = 'user_32xBta9yzysBdC0F4kScowyq5Ai';

-- Clean up any duplicate users (in case both email and ID conflicts existed)
DELETE FROM public.users 
WHERE email = 'v9ibhav@gmail.com' 
  AND id != 'user_32xBta9yzysBdC0F4kScowyq5Ai';

-- Final verification
SELECT 'Final admin user state:' as status;
SELECT id, email, full_name, role, is_verified, created_at 
FROM public.users 
WHERE id = 'user_32xBta9yzysBdC0F4kScowyq5Ai';