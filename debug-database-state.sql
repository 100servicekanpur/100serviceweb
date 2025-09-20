-- Debug script to check what happened after running the setup
-- Run this in Supabase SQL Editor to see the current state

SELECT '=== CHECKING DATABASE SETUP ===' as status;

-- 1. Check if tables exist
SELECT 
    'TABLES CHECK' as check_type,
    table_name,
    'EXISTS' as status
FROM information_schema.tables 
WHERE table_schema = 'public' 
    AND table_name IN ('users', 'services', 'bookings', 'service_assignments', 'reviews', 'payment_transactions')
ORDER BY table_name;

-- 2. Check users table structure and data
SELECT '=== USERS TABLE CHECK ===' as status;

SELECT COUNT(*) as total_users FROM public.users;

-- Check if admin user exists
SELECT 
    id, 
    email, 
    role, 
    is_verified,
    created_at,
    'ADMIN USER' as user_type
FROM public.users 
WHERE email = 'v9ibhav@gmail.com';

-- Check all users if any
SELECT 
    id, 
    email, 
    role, 
    is_verified,
    'ALL USERS' as user_type
FROM public.users 
LIMIT 10;

-- 3. Check RLS status
SELECT '=== RLS CHECK ===' as status;

SELECT 
    schemaname,
    tablename,
    rowsecurity,
    CASE WHEN rowsecurity THEN 'ENABLED' ELSE 'DISABLED' END as rls_status
FROM pg_tables 
WHERE schemaname = 'public' 
    AND tablename IN ('users', 'services', 'bookings', 'service_assignments', 'reviews', 'payment_transactions')
ORDER BY tablename;

-- 4. Check policies
SELECT '=== POLICIES CHECK ===' as status;

SELECT 
    schemaname,
    tablename,
    policyname,
    'POLICY EXISTS' as status
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- 5. Check services
SELECT '=== SERVICES CHECK ===' as status;

SELECT COUNT(*) as total_services FROM public.services;

-- 6. Check triggers
SELECT '=== TRIGGERS CHECK ===' as status;

SELECT 
    trigger_name,
    event_object_table,
    'TRIGGER EXISTS' as status
FROM information_schema.triggers 
WHERE trigger_schema = 'public'
    AND event_object_table IN ('users', 'services', 'bookings')
ORDER BY event_object_table, trigger_name;