-- ===============================================
-- DEBUG USER LOOKUP ISSUE
-- ===============================================
-- Run this to see what users exist in your database

-- Check what users exist in the database
SELECT 
    id,
    email,
    role,
    is_verified,
    created_at,
    LENGTH(id) as id_length,
    CASE 
        WHEN id LIKE 'user_%' THEN 'Clerk ID Format'
        WHEN LENGTH(id) = 36 AND id ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' THEN 'UUID Format'
        ELSE 'Unknown Format'
    END as id_format
FROM public.users
ORDER BY created_at DESC;

-- Check if there's a user with the specific Clerk ID
SELECT 'User with Clerk ID exists?' as check_type, 
       EXISTS(SELECT 1 FROM public.users WHERE id = 'user_32xBta9yzysBdC0F4kScowyq5Ai') as result;

-- Check if there's a user with the email
SELECT 'User with email exists?' as check_type,
       EXISTS(SELECT 1 FROM public.users WHERE email = 'v9ibhav@gmail.com') as result;

-- Check table structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'users'
ORDER BY ordinal_position;

-- Check RLS policies on users table
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies 
WHERE schemaname = 'public' AND tablename = 'users';

-- Test if we can insert a user with Clerk ID format
INSERT INTO public.users (id, email, full_name, role, is_verified) 
VALUES ('test_clerk_id_format', 'test@example.com', 'Test User', 'customer', true)
ON CONFLICT (id) DO NOTHING;

-- Check if the test insert worked
SELECT 'Test insert worked?' as check_type,
       EXISTS(SELECT 1 FROM public.users WHERE id = 'test_clerk_id_format') as result;

-- Clean up test data
DELETE FROM public.users WHERE id = 'test_clerk_id_format';