# 🔧 Admin Setup Instructions

## Quick Fix for RLS Policy Error

### Step 1: Fix Database Policies
Run this SQL in your Supabase SQL Editor:

```sql
-- Fix RLS policies for user registration
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.users;
DROP POLICY IF EXISTS "Admins have full access to users" ON public.users;

-- Add INSERT policy for new user registration
CREATE POLICY "Users can insert their own profile" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Add admin policy for full access
CREATE POLICY "Admins have full access to users" ON public.users
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

### Step 2: Create Admin User

**Option A: Manual Creation (Recommended)**
1. Go to your Supabase Dashboard → Authentication → Users
2. Click "Add User" 
3. Use these details:
   - Email: `v9ibhav@gmail.com`
   - Password: `Vaibhav@1233`
4. After creating, go to Table Editor → `users` table
5. Insert a new row:
   - id: (copy the auth user ID from step 3)
   - email: `v9ibhav@gmail.com`
   - full_name: `System Administrator`
   - role: `admin`
   - is_verified: `true`

**Option B: Register and Update**
1. Go to `/register` and create account with:
   - Email: `v9ibhav@gmail.com`
   - Password: `Vaibhav@1233`
   - Name: `System Administrator`
2. In Supabase Dashboard → Table Editor → `users` table
3. Find your user record and update:
   - role: change to `admin`
   - is_verified: change to `true`

### Step 3: Login
1. Go to `/admin/login`
2. Use the credentials:
   - Email: `v9ibhav@gmail.com`
   - Password: `Vaibhav@1233`

## Files Created:
- `fix-rls-policies.sql` - Run this in Supabase SQL Editor
- Updated AuthContext with correct field names
- Updated database schema with proper RLS policies

The main issue was missing INSERT policy for the users table which prevented new user registration.