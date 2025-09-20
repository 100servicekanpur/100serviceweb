-- ===============================================
-- CREATE INDEXES CONCURRENTLY (OPTIONAL)
-- ===============================================
-- Run this script SEPARATELY if you want to create indexes concurrently
-- This is useful for large tables where you don't want to lock them during index creation
-- NOTE: Each command must be run individually, not as a batch

-- Drop existing indexes first if they exist
DROP INDEX IF EXISTS idx_users_role;
DROP INDEX IF EXISTS idx_users_email;
DROP INDEX IF EXISTS idx_users_created_at;
DROP INDEX IF EXISTS idx_services_category;
DROP INDEX IF EXISTS idx_services_subcategory;
DROP INDEX IF EXISTS idx_services_active;
DROP INDEX IF EXISTS idx_bookings_user_id;
DROP INDEX IF EXISTS idx_bookings_provider_id;
DROP INDEX IF EXISTS idx_bookings_service_id;
DROP INDEX IF EXISTS idx_bookings_status;
DROP INDEX IF EXISTS idx_bookings_date;
DROP INDEX IF EXISTS idx_bookings_created_at;
DROP INDEX IF EXISTS idx_service_assignments_provider;
DROP INDEX IF EXISTS idx_service_assignments_service;
DROP INDEX IF EXISTS idx_reviews_booking_id;
DROP INDEX IF EXISTS idx_reviews_service_id;
DROP INDEX IF EXISTS idx_reviews_rating;
DROP INDEX IF EXISTS idx_payment_transactions_booking;
DROP INDEX IF EXISTS idx_payment_transactions_status;

-- Create indexes concurrently (run each command separately)
-- Users table indexes
CREATE INDEX CONCURRENTLY idx_users_role ON public.users(role);
CREATE INDEX CONCURRENTLY idx_users_email ON public.users(email);
CREATE INDEX CONCURRENTLY idx_users_created_at ON public.users(created_at);

-- Services table indexes
CREATE INDEX CONCURRENTLY idx_services_category ON public.services(category);
CREATE INDEX CONCURRENTLY idx_services_subcategory ON public.services(subcategory);
CREATE INDEX CONCURRENTLY idx_services_active ON public.services(is_active);

-- Bookings table indexes
CREATE INDEX CONCURRENTLY idx_bookings_user_id ON public.bookings(user_id);
CREATE INDEX CONCURRENTLY idx_bookings_provider_id ON public.bookings(provider_id);
CREATE INDEX CONCURRENTLY idx_bookings_service_id ON public.bookings(service_id);
CREATE INDEX CONCURRENTLY idx_bookings_status ON public.bookings(status);
CREATE INDEX CONCURRENTLY idx_bookings_date ON public.bookings(booking_date);
CREATE INDEX CONCURRENTLY idx_bookings_created_at ON public.bookings(created_at);

-- Service assignments table indexes
CREATE INDEX CONCURRENTLY idx_service_assignments_provider ON public.service_assignments(provider_id);
CREATE INDEX CONCURRENTLY idx_service_assignments_service ON public.service_assignments(service_id);

-- Reviews table indexes
CREATE INDEX CONCURRENTLY idx_reviews_booking_id ON public.reviews(booking_id);
CREATE INDEX CONCURRENTLY idx_reviews_service_id ON public.reviews(service_id);
CREATE INDEX CONCURRENTLY idx_reviews_rating ON public.reviews(rating);

-- Payment transactions table indexes
CREATE INDEX CONCURRENTLY idx_payment_transactions_booking ON public.payment_transactions(booking_id);
CREATE INDEX CONCURRENTLY idx_payment_transactions_status ON public.payment_transactions(status);

-- Note: CONCURRENTLY means the index is built without locking the table,
-- but each command must be run separately, not as part of a larger transaction.