-- =============================================
-- 100Service Database Schema for Supabase
-- =============================================

-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'muJVL6I84DqfVUOYR08C0g5Vep73gx+B1U1wCCKXWdcBKL0SCJM593FHnWJHeb/dblkjMHPdFKfHhVtHuOF/sg==';

-- Create custom types
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('customer', 'provider', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE service_status AS ENUM ('active', 'inactive', 'pending');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- =============================================
-- Users table (extends Supabase auth.users)
-- =============================================
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  role user_role DEFAULT 'customer',
  avatar_url TEXT,
  address TEXT,
  city VARCHAR(100),
  state VARCHAR(100),
  postal_code VARCHAR(20),
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- Categories table
-- =============================================
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  icon VARCHAR(100),
  slug VARCHAR(255) UNIQUE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- Services table
-- =============================================
CREATE TABLE IF NOT EXISTS public.services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  short_description VARCHAR(500),
  category_id UUID REFERENCES public.categories(id),
  provider_id UUID REFERENCES public.users(id),
  base_price DECIMAL(10,2) NOT NULL,
  price_unit VARCHAR(50) DEFAULT 'fixed', -- 'fixed', 'hourly', 'per_sqft'
  duration_minutes INTEGER, -- estimated duration
  images TEXT[], -- array of image URLs
  features TEXT[], -- array of service features
  requirements TEXT[], -- what customer needs to provide
  status service_status DEFAULT 'pending',
  rating_average DECIMAL(3,2) DEFAULT 0,
  rating_count INTEGER DEFAULT 0,
  booking_count INTEGER DEFAULT 0,
  is_emergency BOOLEAN DEFAULT false,
  availability_hours JSONB, -- flexible schedule format
  service_area TEXT[], -- areas where service is available
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- Service packages (for different pricing tiers)
-- =============================================
CREATE TABLE IF NOT EXISTS public.service_packages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  service_id UUID REFERENCES public.services(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL, -- 'basic', 'standard', 'premium'
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  features TEXT[],
  is_popular BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- Bookings table
-- =============================================
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID REFERENCES public.users(id),
  service_id UUID REFERENCES public.services(id),
  package_id UUID REFERENCES public.service_packages(id),
  provider_id UUID REFERENCES public.users(id),
  booking_date DATE NOT NULL,
  booking_time TIME NOT NULL,
  status booking_status DEFAULT 'pending',
  total_amount DECIMAL(10,2) NOT NULL,
  payment_status VARCHAR(50) DEFAULT 'pending',
  payment_method VARCHAR(50),
  payment_id VARCHAR(255),
  customer_address TEXT NOT NULL,
  customer_phone VARCHAR(20) NOT NULL,
  special_instructions TEXT,
  estimated_duration INTEGER, -- in minutes
  actual_start_time TIMESTAMP WITH TIME ZONE,
  actual_end_time TIMESTAMP WITH TIME ZONE,
  cancellation_reason TEXT,
  cancelled_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- Reviews table
-- =============================================
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID REFERENCES public.bookings(id),
  customer_id UUID REFERENCES public.users(id),
  service_id UUID REFERENCES public.services(id),
  provider_id UUID REFERENCES public.users(id),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  images TEXT[], -- review images
  is_verified BOOLEAN DEFAULT false,
  helpful_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- Frontend Settings table (for admin configuration)
-- =============================================
CREATE TABLE IF NOT EXISTS public.frontend_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key VARCHAR(100) UNIQUE NOT NULL,
  setting_value JSONB,
  description TEXT,
  updated_by UUID REFERENCES public.users(id),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- Row Level Security (RLS) Policies - DISABLED FOR DEVELOPMENT
-- =============================================

-- Disable RLS on all tables for easier development
DO $$ BEGIN
    ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
EXCEPTION
    WHEN others THEN null;
END $$;

DO $$ BEGIN
    ALTER TABLE public.categories DISABLE ROW LEVEL SECURITY;
EXCEPTION
    WHEN others THEN null;
END $$;

DO $$ BEGIN
    ALTER TABLE public.services DISABLE ROW LEVEL SECURITY;
EXCEPTION
    WHEN others THEN null;
END $$;

DO $$ BEGIN
    ALTER TABLE public.service_packages DISABLE ROW LEVEL SECURITY;
EXCEPTION
    WHEN others THEN null;
END $$;

DO $$ BEGIN
    ALTER TABLE public.bookings DISABLE ROW LEVEL SECURITY;
EXCEPTION
    WHEN others THEN null;
END $$;

DO $$ BEGIN
    ALTER TABLE public.reviews DISABLE ROW LEVEL SECURITY;
EXCEPTION
    WHEN others THEN null;
END $$;

DO $$ BEGIN
    ALTER TABLE public.frontend_settings DISABLE ROW LEVEL SECURITY;
EXCEPTION
    WHEN others THEN null;
END $$;

DO $$ BEGIN
    ALTER TABLE public.site_settings DISABLE ROW LEVEL SECURITY;
EXCEPTION
    WHEN others THEN null;
END $$;

-- =============================================
-- RLS Policies (COMMENTED OUT - RLS DISABLED)
-- =============================================

-- Note: All policies are commented out since RLS is disabled
-- Uncomment and enable RLS when moving to production

/*
-- Users policies
DROP POLICY IF EXISTS "Users can view their own profile" ON public.users;
CREATE POLICY "Users can view their own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;
CREATE POLICY "Users can update their own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.users;
CREATE POLICY "Users can insert their own profile" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Admins have full access to users" ON public.users;
CREATE POLICY "Admins have full access to users" ON public.users
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Categories policies (public read, admin write)
DROP POLICY IF EXISTS "Anyone can view categories" ON public.categories;
CREATE POLICY "Anyone can view categories" ON public.categories
  FOR SELECT USING (true);

-- Services policies
DROP POLICY IF EXISTS "Anyone can view active services" ON public.services;
CREATE POLICY "Anyone can view active services" ON public.services
  FOR SELECT USING (status = 'active');

DROP POLICY IF EXISTS "Providers can manage their services" ON public.services;
CREATE POLICY "Providers can manage their services" ON public.services
  FOR ALL USING (auth.uid() = provider_id);

-- Service packages policies
DROP POLICY IF EXISTS "Anyone can view service packages" ON public.service_packages;
CREATE POLICY "Anyone can view service packages" ON public.service_packages
  FOR SELECT USING (true);

-- Bookings policies
DROP POLICY IF EXISTS "Users can view their own bookings" ON public.bookings;
CREATE POLICY "Users can view their own bookings" ON public.bookings
  FOR SELECT USING (auth.uid() = customer_id OR auth.uid() = provider_id);

DROP POLICY IF EXISTS "Customers can create bookings" ON public.bookings;
CREATE POLICY "Customers can create bookings" ON public.bookings
  FOR INSERT WITH CHECK (auth.uid() = customer_id);

DROP POLICY IF EXISTS "Customers and providers can update bookings" ON public.bookings;
CREATE POLICY "Customers and providers can update bookings" ON public.bookings
  FOR UPDATE USING (auth.uid() = customer_id OR auth.uid() = provider_id);

-- Reviews policies
DROP POLICY IF EXISTS "Anyone can view reviews" ON public.reviews;
CREATE POLICY "Anyone can view reviews" ON public.reviews
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Customers can create reviews for their bookings" ON public.reviews;
CREATE POLICY "Customers can create reviews for their bookings" ON public.reviews
  FOR INSERT WITH CHECK (auth.uid() = customer_id);

-- Frontend settings policies (admin only)
DROP POLICY IF EXISTS "Anyone can view frontend settings" ON public.frontend_settings;
CREATE POLICY "Anyone can view frontend settings" ON public.frontend_settings
  FOR SELECT USING (true);
*/

-- =============================================
-- Indexes for better performance
-- =============================================
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_services_category ON public.services(category_id);
CREATE INDEX IF NOT EXISTS idx_services_provider ON public.services(provider_id);
CREATE INDEX IF NOT EXISTS idx_services_status ON public.services(status);
CREATE INDEX IF NOT EXISTS idx_bookings_customer ON public.bookings(customer_id);
CREATE INDEX IF NOT EXISTS idx_bookings_provider ON public.bookings(provider_id);
CREATE INDEX IF NOT EXISTS idx_bookings_service ON public.bookings(service_id);
CREATE INDEX IF NOT EXISTS idx_bookings_date ON public.bookings(booking_date);
CREATE INDEX IF NOT EXISTS idx_reviews_service ON public.reviews(service_id);
CREATE INDEX IF NOT EXISTS idx_reviews_provider ON public.reviews(provider_id);

-- =============================================
-- Functions and Triggers
-- =============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_services_updated_at ON public.services;
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON public.services
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_bookings_updated_at ON public.bookings;
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON public.bookings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update service rating when review is added
CREATE OR REPLACE FUNCTION update_service_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.services 
    SET 
        rating_average = (
            SELECT AVG(rating)::DECIMAL(3,2) 
            FROM public.reviews 
            WHERE service_id = NEW.service_id
        ),
        rating_count = (
            SELECT COUNT(*) 
            FROM public.reviews 
            WHERE service_id = NEW.service_id
        )
    WHERE id = NEW.service_id;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_service_rating_trigger ON public.reviews;
CREATE TRIGGER update_service_rating_trigger
    AFTER INSERT ON public.reviews
    FOR EACH ROW EXECUTE FUNCTION update_service_rating();

-- =============================================
-- Sample Data
-- =============================================

-- Insert sample categories
INSERT INTO public.categories (name, description, icon, slug) VALUES
('Electrical', 'Electrical repairs and installations', 'BoltIcon', 'electrical'),
('Plumbing', 'Plumbing services and repairs', 'WrenchScrewdriverIcon', 'plumbing'),
('Cleaning', 'Home and office cleaning services', 'HomeIcon', 'cleaning'),
('Painting', 'Interior and exterior painting', 'PaintBrushIcon', 'painting'),
('Carpentry', 'Furniture and woodwork services', 'HammerIcon', 'carpentry'),
('Appliance Repair', 'Home appliance repair services', 'CogIcon', 'appliance-repair')
ON CONFLICT (slug) DO NOTHING;

-- Insert sample frontend settings
INSERT INTO public.frontend_settings (setting_key, setting_value, description) VALUES
('site_name', '"100Service"', 'Website name'),
('site_tagline', '"Professional Home Services at Your Doorstep"', 'Website tagline'),
('contact_phone', '"+91 1800-100-SERVICE"', 'Primary contact phone'),
('contact_email', '"support@100service.com"', 'Primary contact email'),
('emergency_phone', '"+91 1800-EMERGENCY"', 'Emergency contact phone'),
('service_areas', '["Mumbai", "Delhi", "Bangalore", "Chennai", "Hyderabad", "Pune"]', 'Service coverage areas'),
('business_hours', '{"monday": "9:00-20:00", "tuesday": "9:00-20:00", "wednesday": "9:00-20:00", "thursday": "9:00-20:00", "friday": "9:00-20:00", "saturday": "10:00-18:00", "sunday": "10:00-16:00"}', 'Business operating hours'),
('social_links', '{"facebook": "https://facebook.com/100service", "twitter": "https://twitter.com/100service", "instagram": "https://instagram.com/100service", "linkedin": "https://linkedin.com/company/100service"}', 'Social media links')
ON CONFLICT (setting_key) DO NOTHING;

-- =============================================
-- Site Settings table
-- =============================================
CREATE TABLE IF NOT EXISTS public.site_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  site_name VARCHAR(255) DEFAULT '100Service',
  site_description TEXT,
  site_logo TEXT,
  site_favicon TEXT,
  contact_email VARCHAR(255),
  contact_phone VARCHAR(20),
  contact_address TEXT,
  currency VARCHAR(10) DEFAULT 'INR',
  tax_rate DECIMAL(5,2) DEFAULT 18.00,
  commission_rate DECIMAL(5,2) DEFAULT 15.00,
  min_booking_amount DECIMAL(10,2) DEFAULT 100.00,
  max_booking_amount DECIMAL(10,2) DEFAULT 50000.00,
  allow_cancellation BOOLEAN DEFAULT true,
  cancellation_hours INTEGER DEFAULT 24,
  email_notifications BOOLEAN DEFAULT true,
  sms_notifications BOOLEAN DEFAULT true,
  maintenance_mode BOOLEAN DEFAULT false,
  registration_enabled BOOLEAN DEFAULT true,
  provider_approval_required BOOLEAN DEFAULT true,
  service_approval_required BOOLEAN DEFAULT true,
  meta_title VARCHAR(255),
  meta_description TEXT,
  meta_keywords TEXT,
  google_analytics_id VARCHAR(50),
  facebook_pixel_id VARCHAR(50),
  terms_of_service TEXT,
  privacy_policy TEXT,
  refund_policy TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default settings
INSERT INTO public.site_settings (
  site_name,
  site_description,
  contact_email,
  contact_phone,
  contact_address,
  meta_title,
  meta_description,
  meta_keywords
) VALUES (
  '100Service',
  'Professional home services at your doorstep',
  'support@100service.com',
  '+91-9999999999',
  'Tilak Nagar, Kanpur, UP, India',
  '100Service - Home Services at Your Doorstep',
  'Book trusted professionals for home services in Kanpur. From cleaning to repairs, we have got you covered.',
  'home services, cleaning, repairs, maintenance, Kanpur'
)
ON CONFLICT (id) DO NOTHING;

-- =============================================
-- Complete! Your database is ready to use.
-- =============================================