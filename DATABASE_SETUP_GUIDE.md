# 🗄️ Complete Database Setup Guide

## 📋 Overview
This guide provides the complete SQL setup for your 100Service application database with all tables, policies, and data.

## 🚀 Quick Setup

### 1. Run the Complete Setup Script
**File:** `supabase-complete-setup.sql`
- Contains complete database schema with all 6 core tables
- Includes 23 sample services pre-loaded
- Has comprehensive Row Level Security policies
- Contains all necessary indexes for performance
- **FIXED**: All foreign key constraint errors resolved
- **FIXED**: All CREATE INDEX errors resolved
- **READY**: Script can be run directly in Supabase SQL Editor

### 2. How to Execute in Supabase
1. Go to your Supabase dashboard
2. Navigate to SQL Editor
3. Copy and paste the entire content of `supabase-complete-setup.sql`
4. Click "Run" to execute the script
5. Verify with `verify-database-setup.sql`

### 3. Admin Access Setup
The system automatically assigns admin role to:
- **Email:** `v9ibhav@gmail.com`
- When this user logs in through Clerk, they automatically get admin access
- Admin can access `/admin/dashboard` and all admin features

## 📊 Database Schema

### Core Tables Created

**1. `users` - User Management**
- `id` (UUID, Primary Key)
- `email` (Unique, Required)
- `full_name`, `name`, `phone`, `address`
- `role` ('admin', 'provider', 'user')
- `is_verified` (Boolean)
- Timestamps: `created_at`, `updated_at`

**2. `services` - Service Catalog**
- `id` (Serial, Primary Key)
- `name`, `description`
- `category`, `subcategory`
- `price`, `duration_minutes`
- `image_url`, `is_active`
- Timestamps: `created_at`, `updated_at`

**3. `bookings` - Booking Management**
- `id` (Serial, Primary Key)
- Foreign Keys: `user_id`, `service_id`, `provider_id`
- `booking_date`, `booking_time`
- `status` ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled')
- `total_amount`
- Customer details: `customer_name`, `customer_phone`, `customer_email`, `customer_address`
- `special_instructions`
- `payment_status` ('pending', 'paid', 'failed', 'refunded')
- Timestamps: `created_at`, `updated_at`

**4. `service_assignments` - Provider-Service Mapping**
- `id` (Serial, Primary Key)
- Foreign Keys: `provider_id`, `service_id`
- `assigned_at`, `is_active`
- Unique constraint on (provider_id, service_id)

**5. `reviews` - Customer Reviews**
- `id` (Serial, Primary Key)
- Foreign Keys: `booking_id`, `user_id`, `provider_id`, `service_id`
- `rating` (1-5), `comment`
- `created_at`

**6. `payment_transactions` - Payment Tracking**
- `id` (Serial, Primary Key)
- Foreign Key: `booking_id`
- `amount`, `currency`, `payment_method`
- `transaction_id`, `gateway_response`
- `status` ('pending', 'completed', 'failed', 'refunded')
- `created_at`

## 🎯 Sample Data Included

### 23 Pre-configured Services
- **Home Cleaning**: House cleaning, deep cleaning, sofa cleaning, carpet cleaning, kitchen cleaning
- **Appliance Services**: AC service, washing machine, refrigerator, microwave repair
- **Home Maintenance**: Plumbing, electrical, painting, pest control, water tank cleaning
- **Beauty & Wellness**: Salon for women/men, spa at home
- **Vehicle Care**: Car wash, bike service
- **Tech Services**: Laptop repair, mobile repair
- **Others**: Gardening, packers & movers

### Service Categories
- `cleaning` - Home cleaning services
- `appliance` - Appliance repair services
- `maintenance` - Home maintenance
- `beauty` - Beauty and wellness
- `vehicle` - Vehicle care
- `tech` - Technology services
- `others` - Miscellaneous services

## 🔒 Security Features

### Row Level Security (RLS) Policies

**Users Table:**
- Users can insert their own profile
- Users can view their own profile
- Admins can view/manage all users
- Users can update their own profile

**Services Table:**
- Anyone can view services (public access)
- Only admins can manage services

**Bookings Table:**
- Users can view their own bookings
- Providers can view assigned bookings
- Admins can view all bookings
- Users/providers can update relevant bookings

**Service Assignments:**
- Providers can view their assignments
- Admins can manage all assignments

**Reviews:**
- Anyone can view reviews
- Users can create reviews for their bookings
- Admins can manage all reviews

**Payment Transactions:**
- Users can view their own transactions
- Admins can view all transactions

### Performance Optimizations

**Indexes Created:**
- Users: role, email, created_at
- Services: category, subcategory, is_active
- Bookings: user_id, provider_id, service_id, status, date, created_at
- Service Assignments: provider_id, service_id
- Reviews: booking_id, service_id, rating
- Payment Transactions: booking_id, status

## 🤖 Automated Features

### Triggers & Functions

**1. Admin Role Assignment**
- Automatically sets `v9ibhav@gmail.com` as admin
- Triggers on user insert

**2. Timestamp Management**
- Auto-updates `updated_at` on record changes
- Applies to users, services, and bookings tables

### Role Management
- **Admin**: `v9ibhav@gmail.com` (auto-assigned)
- **Provider**: Manually assigned via admin panel
- **User**: Default role for new registrations

## ✅ Verification Checklist

After running the setup script, verify:

1. **Tables Created**: 6 core tables
2. **Services Available**: 23 sample services
3. **RLS Policies**: Applied to all tables
4. **Indexes**: Created for performance
5. **Triggers**: Active for automation
6. **Admin User**: Ready for assignment

## 🔧 Post-Setup Tasks

### 1. Connect Your Application
Update your Supabase client with the new schema:
```typescript
// Your connection is already configured in src/lib/supabase.ts
```

### 2. Test Admin Access
1. Sign in with `v9ibhav@gmail.com`
2. Verify admin role assignment
3. Test admin dashboard access

### 3. Create Provider Users
1. Register provider users through the app
2. Use admin panel to assign provider role
3. Assign services to providers

### 4. Test Booking Flow
1. Create test bookings as a user
2. Test provider acceptance/rejection
3. Verify status workflow

## 🚨 Troubleshooting

### Common Issues

**RLS Permission Denied:**
```sql
-- Check if policies are applied
SELECT * FROM pg_policies WHERE schemaname = 'public';
```

**Missing Admin Role:**
```sql
-- Manually set admin role
UPDATE public.users SET role = 'admin' WHERE email = 'v9ibhav@gmail.com';
```

**Service Assignment Issues:**
```sql
-- Check provider assignments
SELECT * FROM public.service_assignments WHERE provider_id = 'your-user-id';
```

## 📈 Monitoring & Maintenance

### Regular Checks
- Monitor booking statuses
- Review payment transaction logs
- Check user role assignments
- Verify service availability

### Database Maintenance
- Regular VACUUM for performance
- Monitor index usage
- Update service pricing as needed
- Archive old completed bookings

## 🎉 Ready for Production!

Your database is now fully configured with:
- ✅ Complete schema
- ✅ Sample data
- ✅ Security policies
- ✅ Performance optimization
- ✅ Automated triggers
- ✅ Admin user setup

The 100Service application is ready to handle bookings, user management, and provider operations! 🚀