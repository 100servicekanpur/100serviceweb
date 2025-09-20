-- ===============================================
-- DIAGNOSTIC SCRIPT - CHECK TABLE STRUCTURES
-- ===============================================
-- Run this to see what's currently in your database

-- Check existing table structures
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name IN ('users', 'services', 'bookings', 'service_assignments', 'reviews', 'payment_transactions')
ORDER BY table_name, ordinal_position;

-- Check foreign key constraints
SELECT 
    tc.constraint_name,
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY'
AND tc.table_schema = 'public'
ORDER BY tc.table_name, tc.constraint_name;

-- Check which tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;

-- Check services and users ID types specifically
DO $$
DECLARE
    services_id_type text;
    users_id_type text;
    table_count int;
BEGIN
    -- Count tables
    SELECT COUNT(*) INTO table_count
    FROM information_schema.tables 
    WHERE table_schema = 'public'
    AND table_name IN ('users', 'services', 'bookings', 'service_assignments', 'reviews', 'payment_transactions');
    
    -- Get ID types
    SELECT data_type INTO services_id_type 
    FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'services' 
    AND column_name = 'id';
    
    SELECT data_type INTO users_id_type 
    FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'users' 
    AND column_name = 'id';
    
    RAISE NOTICE '===============================';
    RAISE NOTICE 'DIAGNOSTIC SUMMARY';
    RAISE NOTICE '===============================';
    RAISE NOTICE 'Total tables found: %', table_count;
    RAISE NOTICE 'services.id type: %', COALESCE(services_id_type, 'TABLE NOT FOUND');
    RAISE NOTICE 'users.id type: %', COALESCE(users_id_type, 'TABLE NOT FOUND');
    
    IF services_id_type = 'uuid' THEN
        RAISE NOTICE 'PROBLEM: services.id is UUID but should be INTEGER';
        RAISE NOTICE 'SOLUTION: Run fix-foreign-key-types.sql';
    ELSIF services_id_type = 'integer' THEN
        RAISE NOTICE 'GOOD: services.id is INTEGER (correct)';
    END IF;
    
    IF users_id_type = 'uuid' THEN
        RAISE NOTICE 'GOOD: users.id is UUID (correct for Clerk)';
    END IF;
    
    RAISE NOTICE '===============================';
END $$;