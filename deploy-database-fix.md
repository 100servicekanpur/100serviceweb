# Deploy Database Fix

## Step 1: Run the Database Setup Script

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `clerk-supabase-setup.sql`
4. Execute the script

This will:
- Drop all existing tables (clean slate)
- Create new tables with Clerk-compatible user IDs
- Set up simplified RLS policies that don't depend on auth.uid()
- Create sample data including making v9ibhav@gmail.com an admin
- Set up triggers for auto-admin assignment

## Step 2: Deploy Updated Code

1. Push the AuthContext changes to Git:
```bash
git add .
git commit -m "Fix AuthContext to use Clerk user IDs directly"
git push
```

2. Vercel will automatically redeploy

## Step 3: Test the Fix

1. Go to your deployed app
2. Navigate to `/auth-test` 
3. Log in with your Clerk account
4. You should see:
   - Clerk User: [your user data]
   - Supabase User: [matching user data with Clerk ID]
5. Navigate to `/admin/dashboard` - should work now!

## What Changed

- **AuthContext.tsx**: Now uses Clerk user ID directly instead of letting Supabase generate UUID
- **Database Schema**: Uses VARCHAR for user IDs instead of UUID
- **RLS Policies**: Simplified to work without auth.uid() dependency
- **User Creation**: Matches Clerk ID to database ID for seamless integration

Your admin dashboard should now work properly with Clerk authentication!