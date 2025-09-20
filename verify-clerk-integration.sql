-- ===============================================
-- VERIFY CLERK-SUPABASE INTEGRATION
-- ===============================================
-- Run this after the main setup to verify everything works

-- Check if tables exist with correct structure
SELECT table_name, column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name IN ('users', 'categories', 'services', 'bookings')
ORDER BY table_name, ordinal_position;

-- Check RLS policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies 
WHERE schemaname = 'public';

-- Check if admin user exists
SELECT id, email, role, is_verified, created_at
FROM public.users
WHERE role = 'admin';

-- Check sample data
SELECT 'categories' as table_name, count(*) as count FROM public.categories
UNION ALL
SELECT 'services', count(*) FROM public.services
UNION ALL
SELECT 'users', count(*) FROM public.users;

-- Test insert as if from application (should work with any user ID)
INSERT INTO public.users (id, email, full_name, role, is_verified) 
VALUES ('test_clerk_id_123', 'test@example.com', 'Test User', 'customer', true)
ON CONFLICT (id) DO NOTHING;

-- Verify the test insert worked
SELECT * FROM public.users WHERE id = 'test_clerk_id_123';

-- Clean up test data
DELETE FROM public.users WHERE id = 'test_clerk_id_123';