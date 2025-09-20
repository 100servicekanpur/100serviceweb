-- Database verification script for 100Service
-- Run this in your Supabase SQL Editor to check if all tables exist

-- Check if tables exist
SELECT 
    table_name,
    CASE 
        WHEN table_name IS NOT NULL THEN '✅ Exists'
        ELSE '❌ Missing'
    END as status
FROM information_schema.tables 
WHERE table_schema = 'public' 
    AND table_name IN (
        'users', 
        'categories', 
        'services', 
        'bookings', 
        'reviews', 
        'service_images',
        'notifications',
        'payments'
    )
ORDER BY table_name;

-- Check if users table has admin user
SELECT 
    email, 
    full_name, 
    role,
    is_verified,
    created_at
FROM public.users 
WHERE role = 'admin'
LIMIT 5;

-- Check categories count
SELECT COUNT(*) as category_count FROM public.categories;

-- Check services count  
SELECT COUNT(*) as service_count FROM public.services;

-- Verify RLS policies are enabled
SELECT 
    schemaname,
    tablename,
    rowsecurity as "RLS Enabled"
FROM pg_tables 
WHERE schemaname = 'public' 
    AND tablename IN ('users', 'categories', 'services', 'bookings')
ORDER BY tablename;