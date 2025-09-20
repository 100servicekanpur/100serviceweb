-- ===============================================
-- CLEANUP SCRIPT - DROP ALL TABLES AND POLICIES
-- ===============================================
-- Run this script if you need to completely reset your database
-- WARNING: This will delete ALL data!

-- Drop tables in correct order (respecting foreign key dependencies)
DROP TABLE IF EXISTS public.payment_transactions CASCADE;
DROP TABLE IF EXISTS public.reviews CASCADE;
DROP TABLE IF EXISTS public.service_assignments CASCADE;
DROP TABLE IF EXISTS public.bookings CASCADE;
DROP TABLE IF EXISTS public.services CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;

-- Drop functions and triggers
DROP FUNCTION IF EXISTS set_admin_role() CASCADE;
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- Note: Policies are automatically dropped when tables are dropped

-- Completion message
DO $$
BEGIN
    RAISE NOTICE '============================================';
    RAISE NOTICE 'DATABASE CLEANUP COMPLETED!';
    RAISE NOTICE '============================================';
    RAISE NOTICE 'All tables, functions, and policies have been removed.';
    RAISE NOTICE 'You can now run the complete setup script safely.';
    RAISE NOTICE '============================================';
END $$;