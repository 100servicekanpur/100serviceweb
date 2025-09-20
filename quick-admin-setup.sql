-- ===============================================
-- QUICK ADMIN CREATION - CLERK COMPATIBLE
-- ===============================================
-- Replace the Clerk ID below with your actual ID from the auth-test page

-- STEP 1: Replace 'YOUR_CLERK_ID_HERE' with your actual Clerk User ID
-- You can find it on the auth-test page under "User ID: user_32xBta9yzysBdC0F4kScowyq5Ai"

-- STEP 2: Run this script in Supabase SQL Editor

-- Delete any existing conflicting users first
DELETE FROM public.users WHERE email = 'v9ibhav@gmail.com';

-- Create the admin user with your Clerk ID
INSERT INTO public.users (
    id,
    email,
    full_name,
    role,
    is_verified,
    created_at,
    updated_at
) VALUES (
    'user_32xBta9yzysBdC0F4kScowyq5Ai',  -- ⚠️ REPLACE THIS WITH YOUR ACTUAL CLERK ID
    'v9ibhav@gmail.com',
    'Vaibhav Katiyar',
    'admin',
    true,
    NOW(),
    NOW()
);

-- Verify it worked
SELECT 'SUCCESS! Admin user created:' as result;
SELECT id, email, role, is_verified FROM public.users WHERE email = 'v9ibhav@gmail.com';

-- Test if the user can be found by Clerk ID
SELECT 'User lookup by Clerk ID:' as test;
SELECT * FROM public.users WHERE id = 'user_32xBta9yzysBdC0F4kScowyq5Ai';