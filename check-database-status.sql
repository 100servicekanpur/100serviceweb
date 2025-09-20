-- Quick check to see if database tables exist and admin user setup
SELECT 'Tables Check:' as status;

-- Check if tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('users', 'services', 'bookings', 'service_assignments', 'reviews', 'payment_transactions');

SELECT 'Users Check:' as status;

-- Check if users table has data
SELECT COUNT(*) as total_users FROM public.users;

-- Check admin user specifically
SELECT id, email, role, is_verified, created_at 
FROM public.users 
WHERE email = 'v9ibhav@gmail.com';

SELECT 'Services Check:' as status;

-- Check if services exist
SELECT COUNT(*) as total_services FROM public.services;

SELECT 'RLS Check:' as status;

-- Check if RLS is enabled
SELECT 
    schemaname,
    tablename,
    rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('users', 'services', 'bookings');