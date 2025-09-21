-- ===============================================
-- COMPLETE SERVICE SYSTEM DATABASE SETUP
-- ===============================================

-- Step 1: First run the admin CRUD fix
SELECT 'Running admin CRUD fixes...' as status;

-- Drop ALL existing policies that might conflict
DROP POLICY IF EXISTS "Allow public read access to categories" ON public.categories;
DROP POLICY IF EXISTS "Allow authenticated users to manage categories" ON public.categories;
DROP POLICY IF EXISTS "categories_select_all" ON public.categories;
DROP POLICY IF EXISTS "categories_insert_authenticated" ON public.categories;
DROP POLICY IF EXISTS "categories_update_authenticated" ON public.categories;
DROP POLICY IF EXISTS "categories_delete_authenticated" ON public.categories;

DROP POLICY IF EXISTS "Allow public read access to services" ON public.services;
DROP POLICY IF EXISTS "Allow authenticated users to manage services" ON public.services;
DROP POLICY IF EXISTS "services_select_all" ON public.services;
DROP POLICY IF EXISTS "services_insert_authenticated" ON public.services;
DROP POLICY IF EXISTS "services_update_authenticated" ON public.services;
DROP POLICY IF EXISTS "services_delete_authenticated" ON public.services;

-- Step 2: Create/Update Tables with proper structure
SELECT 'Creating enhanced table structure...' as status;

-- Categories table
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    icon VARCHAR(255),
    color VARCHAR(7), -- For hex colors like #FF5733
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Subcategories table (NEW)
CREATE TABLE IF NOT EXISTS public.subcategories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    icon VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(category_id, name)
);

-- Enhanced services table
DROP TABLE IF EXISTS public.services CASCADE;
CREATE TABLE public.services (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
    subcategory_id UUID REFERENCES public.subcategories(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    short_description VARCHAR(500),
    price DECIMAL(10,2),
    duration_minutes INTEGER,
    is_featured BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    images TEXT[], -- Array of image URLs
    tags TEXT[], -- Array of tags for search
    requirements TEXT,
    included_items TEXT[],
    excluded_items TEXT[],
    booking_instructions TEXT,
    cancellation_policy TEXT,
    provider_id VARCHAR(255), -- Clerk user ID of service provider
    rating DECIMAL(3,2) DEFAULT 0.00,
    total_bookings INTEGER DEFAULT 0,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bookings table (enhanced)
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    service_id UUID NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
    user_id VARCHAR(255) NOT NULL, -- Clerk user ID
    provider_id VARCHAR(255), -- Clerk user ID of service provider
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(20),
    booking_date DATE NOT NULL,
    booking_time TIME NOT NULL,
    duration_minutes INTEGER,
    total_amount DECIMAL(10,2),
    special_requests TEXT,
    status VARCHAR(50) DEFAULT 'pending', -- pending, confirmed, completed, cancelled
    payment_status VARCHAR(50) DEFAULT 'pending', -- pending, paid, refunded
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Service reviews table (NEW)
CREATE TABLE IF NOT EXISTS public.service_reviews (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    service_id UUID NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
    booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
    user_id VARCHAR(255) NOT NULL, -- Clerk user ID
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 3: Create indexes for performance
SELECT 'Creating indexes...' as status;

CREATE INDEX IF NOT EXISTS idx_categories_active ON public.categories(is_active, sort_order);
CREATE INDEX IF NOT EXISTS idx_subcategories_category ON public.subcategories(category_id, is_active);
CREATE INDEX IF NOT EXISTS idx_services_category ON public.services(category_id, is_active);
CREATE INDEX IF NOT EXISTS idx_services_subcategory ON public.services(subcategory_id, is_active);
CREATE INDEX IF NOT EXISTS idx_services_featured ON public.services(is_featured, is_active);
CREATE INDEX IF NOT EXISTS idx_services_provider ON public.services(provider_id);
CREATE INDEX IF NOT EXISTS idx_bookings_user ON public.bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_service ON public.bookings(service_id);
CREATE INDEX IF NOT EXISTS idx_bookings_date ON public.bookings(booking_date, booking_time);

-- Step 4: Create simple allow-all policies
SELECT 'Creating RLS policies...' as status;

-- Categories policies
CREATE POLICY "allow_all_categories" ON public.categories
    FOR ALL USING (true) WITH CHECK (true);

-- Subcategories policies  
CREATE POLICY "allow_all_subcategories" ON public.subcategories
    FOR ALL USING (true) WITH CHECK (true);

-- Services policies
CREATE POLICY "allow_all_services" ON public.services
    FOR ALL USING (true) WITH CHECK (true);

-- Bookings policies
CREATE POLICY "allow_all_bookings" ON public.bookings
    FOR ALL USING (true) WITH CHECK (true);

-- Reviews policies
CREATE POLICY "allow_all_reviews" ON public.service_reviews
    FOR ALL USING (true) WITH CHECK (true);

-- Step 5: Grant permissions
SELECT 'Granting permissions...' as status;

GRANT ALL PRIVILEGES ON public.categories TO authenticated, anon;
GRANT ALL PRIVILEGES ON public.subcategories TO authenticated, anon;
GRANT ALL PRIVILEGES ON public.services TO authenticated, anon;
GRANT ALL PRIVILEGES ON public.bookings TO authenticated, anon;
GRANT ALL PRIVILEGES ON public.service_reviews TO authenticated, anon;

-- Step 6: Insert sample data
SELECT 'Inserting sample data...' as status;

-- Sample categories
INSERT INTO public.categories (name, description, icon, color) VALUES
('Home Services', 'Services for your home and household needs', '🏠', '#3B82F6'),
('Beauty & Wellness', 'Beauty treatments and wellness services', '💅', '#EC4899'),
('Technology', 'Tech support and digital services', '💻', '#10B981'),
('Education', 'Learning and educational services', '📚', '#F59E0B'),
('Transportation', 'Travel and transportation services', '🚗', '#8B5CF6')
ON CONFLICT (name) DO NOTHING;

-- Sample subcategories
INSERT INTO public.subcategories (category_id, name, description) 
SELECT 
    c.id,
    sub.name,
    sub.description
FROM public.categories c
CROSS JOIN (
    VALUES 
    ('Home Services', 'Cleaning', 'Professional cleaning services'),
    ('Home Services', 'Plumbing', 'Plumbing repairs and installations'),
    ('Home Services', 'Electrical', 'Electrical work and repairs'),
    ('Beauty & Wellness', 'Hair Styling', 'Professional hair cutting and styling'),
    ('Beauty & Wellness', 'Massage', 'Relaxing massage therapies'),
    ('Beauty & Wellness', 'Skincare', 'Facial treatments and skincare'),
    ('Technology', 'Computer Repair', 'Computer troubleshooting and repair'),
    ('Technology', 'Mobile Repair', 'Smartphone and tablet repairs'),
    ('Technology', 'Web Development', 'Website creation and development'),
    ('Education', 'Tutoring', 'Academic tutoring services'),
    ('Education', 'Music Lessons', 'Learn musical instruments'),
    ('Transportation', 'Taxi Service', 'Local transportation'),
    ('Transportation', 'Delivery', 'Package and food delivery')
) AS sub(category_name, name, description)
WHERE c.name = sub.category_name
ON CONFLICT (category_id, name) DO NOTHING;

-- Sample services
INSERT INTO public.services (category_id, subcategory_id, name, description, short_description, price, duration_minutes, is_featured)
SELECT 
    c.id as category_id,
    sc.id as subcategory_id,
    srv.name,
    srv.description,
    srv.short_description,
    srv.price,
    srv.duration_minutes,
    srv.is_featured
FROM public.categories c
JOIN public.subcategories sc ON c.id = sc.category_id
CROSS JOIN (
    VALUES 
    ('Cleaning', 'Deep House Cleaning', 'Complete deep cleaning of your entire house including all rooms, kitchen, and bathrooms', 'Professional deep cleaning service', 1500.00, 240, true),
    ('Cleaning', 'Regular House Cleaning', 'Weekly or bi-weekly house cleaning service', 'Regular maintenance cleaning', 800.00, 120, false),
    ('Plumbing', 'Emergency Plumbing Repair', '24/7 emergency plumbing services for urgent repairs', 'Emergency plumbing repair', 2000.00, 60, true),
    ('Plumbing', 'Bathroom Installation', 'Complete bathroom renovation and installation', 'New bathroom installation', 15000.00, 480, false),
    ('Hair Styling', 'Hair Cut & Style', 'Professional haircut with styling', 'Haircut and styling service', 500.00, 45, true),
    ('Hair Styling', 'Hair Coloring', 'Professional hair coloring and highlighting', 'Hair coloring service', 1200.00, 120, false),
    ('Massage', 'Full Body Massage', 'Relaxing full body massage therapy', 'Professional massage therapy', 1500.00, 60, true),
    ('Computer Repair', 'Laptop Repair', 'Hardware and software repair for laptops', 'Laptop troubleshooting and repair', 1000.00, 90, false),
    ('Web Development', 'Business Website', 'Professional business website development', 'Custom website development', 25000.00, 1440, true),
    ('Tutoring', 'Math Tutoring', 'One-on-one mathematics tutoring', 'Personalized math lessons', 500.00, 60, false),
    ('Taxi Service', 'City Taxi', 'Local city transportation service', 'Reliable taxi service', 200.00, 30, false)
) AS srv(subcategory_name, name, description, short_description, price, duration_minutes, is_featured)
WHERE sc.name = srv.subcategory_name;

-- Step 7: Update functions for timestamps
SELECT 'Creating update functions...' as status;

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS update_categories_updated_at ON public.categories;
CREATE TRIGGER update_categories_updated_at 
    BEFORE UPDATE ON public.categories 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_subcategories_updated_at ON public.subcategories;
CREATE TRIGGER update_subcategories_updated_at 
    BEFORE UPDATE ON public.subcategories 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_services_updated_at ON public.services;
CREATE TRIGGER update_services_updated_at 
    BEFORE UPDATE ON public.services 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_bookings_updated_at ON public.bookings;
CREATE TRIGGER update_bookings_updated_at 
    BEFORE UPDATE ON public.bookings 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Step 8: Test queries
SELECT 'Testing the setup...' as status;

SELECT 'Categories count:' as test, COUNT(*) as count FROM public.categories;
SELECT 'Subcategories count:' as test, COUNT(*) as count FROM public.subcategories;
SELECT 'Services count:' as test, COUNT(*) as count FROM public.services;

-- Verify relationships
SELECT 'Testing category-subcategory relationships:' as test;
SELECT c.name as category, COUNT(sc.id) as subcategory_count 
FROM public.categories c
LEFT JOIN public.subcategories sc ON c.id = sc.category_id
GROUP BY c.id, c.name
ORDER BY c.name;

SELECT 'Testing service relationships:' as test;
SELECT c.name as category, sc.name as subcategory, COUNT(s.id) as service_count
FROM public.categories c
LEFT JOIN public.subcategories sc ON c.id = sc.category_id  
LEFT JOIN public.services s ON sc.id = s.subcategory_id
GROUP BY c.id, c.name, sc.id, sc.name
ORDER BY c.name, sc.name;

SELECT '🎉 SUCCESS: Complete service system is ready!' as message;
SELECT 'Next steps: Update your frontend to use this new schema' as next_steps;