-- Quick verification of database setup
SELECT 'DATABASE VERIFICATION' as check_type;

-- Check if tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
    AND table_name IN ('users', 'services', 'bookings', 'service_assignments', 'reviews', 'payment_transactions')
ORDER BY table_name;

-- Check if users table has any data
SELECT COUNT(*) as users_count FROM public.users;

-- Check if services were loaded
SELECT COUNT(*) as services_count FROM public.services;

-- Check specific admin user
SELECT email, role, is_verified FROM public.users WHERE email = 'v9ibhav@gmail.com';