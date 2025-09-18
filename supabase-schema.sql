-- =============================================
-- 100Service Database Schema for Supabase
-- =============================================

-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Create custom types
CREATE TYPE user_role AS ENUM ('customer', 'provider', 'admin');
CREATE TYPE service_status AS ENUM ('active', 'inactive', 'pending');
CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled');

-- =============================================
-- Users table (extends Supabase auth.users)
-- =============================================
CREATE TABLE public.users (
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
CREATE TABLE public.categories (
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
CREATE TABLE public.services (
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
CREATE TABLE public.service_packages (
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
CREATE TABLE public.bookings (
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
CREATE TABLE public.reviews (
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
CREATE TABLE public.frontend_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key VARCHAR(100) UNIQUE NOT NULL,
  setting_value JSONB,
  description TEXT,
  updated_by UUID REFERENCES public.users(id),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- Row Level Security (RLS) Policies
-- =============================================

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.frontend_settings ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view their own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Categories policies (public read, admin write)
CREATE POLICY "Anyone can view categories" ON public.categories
  FOR SELECT USING (true);

-- Services policies
CREATE POLICY "Anyone can view active services" ON public.services
  FOR SELECT USING (status = 'active');

CREATE POLICY "Providers can manage their services" ON public.services
  FOR ALL USING (auth.uid() = provider_id);

-- Service packages policies
CREATE POLICY "Anyone can view service packages" ON public.service_packages
  FOR SELECT USING (true);

-- Bookings policies
CREATE POLICY "Users can view their own bookings" ON public.bookings
  FOR SELECT USING (auth.uid() = customer_id OR auth.uid() = provider_id);

CREATE POLICY "Customers can create bookings" ON public.bookings
  FOR INSERT WITH CHECK (auth.uid() = customer_id);

CREATE POLICY "Customers and providers can update bookings" ON public.bookings
  FOR UPDATE USING (auth.uid() = customer_id OR auth.uid() = provider_id);

-- Reviews policies
CREATE POLICY "Anyone can view reviews" ON public.reviews
  FOR SELECT USING (true);

CREATE POLICY "Customers can create reviews for their bookings" ON public.reviews
  FOR INSERT WITH CHECK (auth.uid() = customer_id);

-- Frontend settings policies (admin only)
CREATE POLICY "Anyone can view frontend settings" ON public.frontend_settings
  FOR SELECT USING (true);

-- =============================================
-- Indexes for better performance
-- =============================================
CREATE INDEX idx_users_role ON public.users(role);
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_services_category ON public.services(category_id);
CREATE INDEX idx_services_provider ON public.services(provider_id);
CREATE INDEX idx_services_status ON public.services(status);
CREATE INDEX idx_bookings_customer ON public.bookings(customer_id);
CREATE INDEX idx_bookings_provider ON public.bookings(provider_id);
CREATE INDEX idx_bookings_service ON public.bookings(service_id);
CREATE INDEX idx_bookings_date ON public.bookings(booking_date);
CREATE INDEX idx_reviews_service ON public.reviews(service_id);
CREATE INDEX idx_reviews_provider ON public.reviews(provider_id);

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
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON public.services
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

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
('Appliance Repair', 'Home appliance repair services', 'CogIcon', 'appliance-repair');

-- Insert sample frontend settings
INSERT INTO public.frontend_settings (setting_key, setting_value, description) VALUES
('site_name', '"100Service"', 'Website name'),
('site_tagline', '"Professional Home Services at Your Doorstep"', 'Website tagline'),
('contact_phone', '"+91 1800-100-SERVICE"', 'Primary contact phone'),
('contact_email', '"support@100service.com"', 'Primary contact email'),
('emergency_phone', '"+91 1800-EMERGENCY"', 'Emergency contact phone'),
('service_areas', '["Mumbai", "Delhi", "Bangalore", "Chennai", "Hyderabad", "Pune"]', 'Service coverage areas'),
('business_hours', '{"monday": "9:00-20:00", "tuesday": "9:00-20:00", "wednesday": "9:00-20:00", "thursday": "9:00-20:00", "friday": "9:00-20:00", "saturday": "10:00-18:00", "sunday": "10:00-16:00"}', 'Business operating hours'),
('social_links', '{"facebook": "https://facebook.com/100service", "twitter": "https://twitter.com/100service", "instagram": "https://instagram.com/100service", "linkedin": "https://linkedin.com/company/100service"}', 'Social media links');

-- =============================================
-- Complete! Your database is ready to use.
-- =============================================