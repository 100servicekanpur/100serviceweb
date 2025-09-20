-- ===============================================
-- DATABASE VERIFICATION SCRIPT
-- ===============================================
-- Run this script to verify your database setup is correct

-- Check if all tables exist
DO $$
BEGIN
    RAISE NOTICE '=== CHECKING TABLES ===';
    
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'users' AND table_schema = 'public') THEN
        RAISE NOTICE '✓ Users table exists';
    ELSE
        RAISE NOTICE '✗ Users table missing';
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'services' AND table_schema = 'public') THEN
        RAISE NOTICE '✓ Services table exists';
    ELSE
        RAISE NOTICE '✗ Services table missing';
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'bookings' AND table_schema = 'public') THEN
        RAISE NOTICE '✓ Bookings table exists';
    ELSE
        RAISE NOTICE '✗ Bookings table missing';
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'service_assignments' AND table_schema = 'public') THEN
        RAISE NOTICE '✓ Service assignments table exists';
    ELSE
        RAISE NOTICE '✗ Service assignments table missing';
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'reviews' AND table_schema = 'public') THEN
        RAISE NOTICE '✓ Reviews table exists';
    ELSE
        RAISE NOTICE '✗ Reviews table missing';
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'payment_transactions' AND table_schema = 'public') THEN
        RAISE NOTICE '✓ Payment transactions table exists';
    ELSE
        RAISE NOTICE '✗ Payment transactions table missing';
    END IF;
END $$;

-- Check services count
SELECT 
    COUNT(*) as total_services,
    COUNT(*) FILTER (WHERE is_active = true) as active_services
FROM public.services;

-- Check RLS status
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE schemaname = 'public' 
ORDER BY tablename;

-- Check policies count
SELECT 
    schemaname,
    tablename,
    COUNT(*) as policy_count
FROM pg_policies 
WHERE schemaname = 'public'
GROUP BY schemaname, tablename
ORDER BY tablename;

-- Check indexes
SELECT 
    schemaname,
    tablename,
    indexname,
    indexdef
FROM pg_indexes 
WHERE schemaname = 'public'
ORDER BY tablename, indexname;

-- Check admin user
SELECT 
    email,
    role,
    is_verified,
    created_at
FROM public.users 
WHERE email = 'v9ibhav@gmail.com';

-- Final verification message
DO $$
DECLARE
    table_count INTEGER;
    service_count INTEGER;
    policy_count INTEGER;
    index_count INTEGER;
BEGIN
    -- Count tables
    SELECT COUNT(*) INTO table_count
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name IN ('users', 'services', 'bookings', 'service_assignments', 'reviews', 'payment_transactions');
    
    -- Count services
    SELECT COUNT(*) INTO service_count FROM public.services;
    
    -- Count policies
    SELECT COUNT(*) INTO policy_count FROM pg_policies WHERE schemaname = 'public';
    
    -- Count indexes
    SELECT COUNT(*) INTO index_count FROM pg_indexes WHERE schemaname = 'public';
    
    RAISE NOTICE '=== VERIFICATION SUMMARY ===';
    RAISE NOTICE 'Tables created: %/6', table_count;
    RAISE NOTICE 'Services available: %', service_count;
    RAISE NOTICE 'RLS policies: %', policy_count;
    RAISE NOTICE 'Indexes created: %', index_count;
    
    IF table_count = 6 AND service_count > 0 AND policy_count > 0 THEN
        RAISE NOTICE '✓ Database setup is COMPLETE and READY!';
    ELSE
        RAISE NOTICE '✗ Database setup incomplete. Please run the complete setup script.';
    END IF;
END $$;