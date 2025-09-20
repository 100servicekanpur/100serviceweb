-- ===============================================
-- 100SERVICE ADMIN-COMPATIBLE DATABASE SETUP
-- ===============================================
-- This script creates the database schema that matches your admin interface
-- Run this in Supabase SQL Editor

-- ===============================================
-- 1. DROP EXISTING TABLES (IF NEEDED)
-- ===============================================
DROP TABLE IF EXISTS public.service_images CASCADE;
DROP TABLE IF EXISTS public.reviews CASCADE;
DROP TABLE IF EXISTS public.bookings CASCADE;
DROP TABLE IF EXISTS public.services CASCADE;
DROP TABLE IF EXISTS public.categories CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;

-- ===============================================
-- 2. CREATE TABLES MATCHING ADMIN INTERFACE
-- ===============================================

-- Users table (matching AuthContext interface)
CREATE TABLE public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255),
    phone VARCHAR(20),
    role VARCHAR(20) DEFAULT 'customer' CHECK (role IN ('admin', 'provider', 'customer')),
    avatar_url TEXT,
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    postal_code VARCHAR(20),
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Categories table (matching admin categories page)
CREATE TABLE public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Services table (matching admin services page)
CREATE TABLE public.services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    short_description TEXT,
    base_price DECIMAL(10, 2),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('active', 'inactive', 'pending')),
    rating_average DECIMAL(3, 2) DEFAULT 0.0,
    rating_count INTEGER DEFAULT 0,
    booking_count INTEGER DEFAULT 0,
    provider_id UUID REFERENCES public.users(id),
    category_id UUID REFERENCES public.categories(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bookings table
CREATE TABLE public.bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id),
    service_id UUID REFERENCES public.services(id),
    provider_id UUID REFERENCES public.users(id),
    booking_date DATE NOT NULL,
    booking_time TIME NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled')),
    total_amount DECIMAL(10, 2),
    customer_name VARCHAR(255),
    customer_phone VARCHAR(20),
    customer_email VARCHAR(255),
    customer_address TEXT,
    special_instructions TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reviews table
CREATE TABLE public.reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID REFERENCES public.bookings(id),
    user_id UUID REFERENCES public.users(id),
    service_id UUID REFERENCES public.services(id),
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===============================================
-- 3. INSERT SAMPLE CATEGORIES
-- ===============================================
INSERT INTO public.categories (name, slug, description, is_active, sort_order) VALUES
('Cleaning', 'cleaning', 'Professional cleaning services for your home and office', true, 1),
('Electrical', 'electrical', 'Electrical installation, repair, and maintenance services', true, 2),
('Plumbing', 'plumbing', 'Professional plumbing services and repairs', true, 3),
('Painting', 'painting', 'Interior and exterior painting services', true, 4),
('Carpentry', 'carpentry', 'Custom carpentry and furniture services', true, 5),
('Appliance Repair', 'appliance-repair', 'Repair and maintenance for home appliances', true, 6),
('Beauty & Wellness', 'beauty-wellness', 'Beauty and wellness services at your doorstep', true, 7),
('Vehicle Care', 'vehicle-care', 'Car and bike washing and maintenance services', true, 8);

-- ===============================================
-- 4. INSERT SAMPLE SERVICES
-- ===============================================
INSERT INTO public.services (title, description, short_description, base_price, status, rating_average, rating_count, booking_count, category_id) 
SELECT 
    'Regular House Cleaning',
    'Complete house cleaning including dusting, mopping, and sanitization of all rooms',
    'Professional house cleaning service',
    499.00,
    'active',
    4.8,
    125,
    85,
    c.id
FROM public.categories c WHERE c.slug = 'cleaning'
UNION ALL
SELECT 
    'Deep Cleaning Service',
    'Intensive deep cleaning for your entire home including hard-to-reach areas',
    'Intensive deep cleaning service',
    899.00,
    'active',
    4.9,
    98,
    120,
    c.id
FROM public.categories c WHERE c.slug = 'cleaning'
UNION ALL
SELECT 
    'Professional Plumbing Services',
    'Complete plumbing solutions from leaky faucets to full bathroom renovations',
    'Complete plumbing solutions',
    299.00,
    'active',
    4.7,
    210,
    200,
    c.id
FROM public.categories c WHERE c.slug = 'plumbing'
UNION ALL
SELECT 
    'Electrical Repair & Installation',
    'Professional electrical services including repairs, installations, and emergency support',
    'Professional electrical services',
    399.00,
    'active',
    4.6,
    75,
    65,
    c.id
FROM public.categories c WHERE c.slug = 'electrical'
UNION ALL
SELECT 
    'Home Painting Services',
    'Professional interior and exterior painting with premium materials and expert craftsmanship',
    'Professional painting services',
    1299.00,
    'pending',
    4.5,
    45,
    35,
    c.id
FROM public.categories c WHERE c.slug = 'painting'
UNION ALL
SELECT 
    'Furniture Assembly & Carpentry',
    'Expert furniture assembly and custom carpentry work for all your home needs',
    'Expert furniture assembly',
    599.00,
    'active',
    4.4,
    65,
    55,
    c.id
FROM public.categories c WHERE c.slug = 'carpentry';

-- ===============================================
-- 5. ENABLE ROW LEVEL SECURITY
-- ===============================================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- ===============================================
-- 6. CREATE RLS POLICIES
-- ===============================================

-- Users policies
CREATE POLICY "Users can insert their own profile" ON public.users
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view profiles" ON public.users
    FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can manage all users" ON public.users
    FOR ALL USING (
        EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
    );

-- Categories policies (public read, admin write)
CREATE POLICY "Anyone can view categories" ON public.categories
    FOR SELECT USING (true);

CREATE POLICY "Admins can manage categories" ON public.categories
    FOR ALL USING (
        EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
    );

-- Services policies (public read, admin write)
CREATE POLICY "Anyone can view services" ON public.services
    FOR SELECT USING (true);

CREATE POLICY "Admins can manage services" ON public.services
    FOR ALL USING (
        EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
    );

-- Bookings policies
CREATE POLICY "Users can view their bookings" ON public.bookings
    FOR SELECT USING (
        user_id = auth.uid() OR 
        provider_id = auth.uid() OR
        EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
    );

CREATE POLICY "Users can create bookings" ON public.bookings
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can manage bookings" ON public.bookings
    FOR ALL USING (
        EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
    );

-- Reviews policies
CREATE POLICY "Anyone can view reviews" ON public.reviews
    FOR SELECT USING (true);

CREATE POLICY "Users can create reviews for their bookings" ON public.reviews
    FOR INSERT WITH CHECK (
        user_id = auth.uid() AND
        EXISTS (SELECT 1 FROM public.bookings WHERE id = booking_id AND user_id = auth.uid())
    );

-- ===============================================
-- 7. CREATE FUNCTION TO AUTO-SET ADMIN ROLE
-- ===============================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    -- Automatically set admin role for v9ibhav@gmail.com
    IF NEW.email = 'v9ibhav@gmail.com' THEN
        NEW.role = 'admin';
        NEW.is_verified = true;
    END IF;
    
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
DROP TRIGGER IF EXISTS on_auth_user_created ON public.users;
CREATE TRIGGER on_auth_user_created
    BEFORE INSERT ON public.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ===============================================
-- 8. UPDATE EXISTING USER TO ADMIN (IF EXISTS)
-- ===============================================
UPDATE public.users 
SET role = 'admin', is_verified = true, updated_at = NOW()
WHERE email = 'v9ibhav@gmail.com';

-- ===============================================
-- 9. CREATE INDEXES FOR PERFORMANCE
-- ===============================================
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON public.categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_active ON public.categories(is_active);
CREATE INDEX IF NOT EXISTS idx_services_category ON public.services(category_id);
CREATE INDEX IF NOT EXISTS idx_services_status ON public.services(status);
CREATE INDEX IF NOT EXISTS idx_services_provider ON public.services(provider_id);
CREATE INDEX IF NOT EXISTS idx_bookings_user ON public.bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_service ON public.bookings(service_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);

-- ===============================================
-- 10. GRANT PERMISSIONS
-- ===============================================
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT SELECT ON public.categories TO anon;
GRANT SELECT ON public.services TO anon;

-- ===============================================
-- COMPLETION MESSAGE
-- ===============================================
DO $$
DECLARE
    user_count INTEGER;
    category_count INTEGER;
    service_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO user_count FROM public.users;
    SELECT COUNT(*) INTO category_count FROM public.categories;
    SELECT COUNT(*) INTO service_count FROM public.services;
    
    RAISE NOTICE '============================================';
    RAISE NOTICE '100SERVICE ADMIN DATABASE SETUP COMPLETED!';
    RAISE NOTICE '============================================';
    RAISE NOTICE 'Users: %', user_count;
    RAISE NOTICE 'Categories: %', category_count;
    RAISE NOTICE 'Services: %', service_count;
    RAISE NOTICE 'Admin user: v9ibhav@gmail.com (auto-assigned)';
    RAISE NOTICE 'Database ready for admin interface!';
    RAISE NOTICE '============================================';
END $$;