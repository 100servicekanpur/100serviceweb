'use client'

import Link from 'next/link'
import { useUser, useAuth } from '@clerk/nextjs'
import { useAuth as useAppAuth } from '@/contexts/AuthContext'

export default function AuthTestPage() {
  const { user: clerkUser, isLoaded: clerkLoaded } = useUser()
  const { isSignedIn } = useAuth()
  const { 
    user: appUser, 
    supabaseUser, 
    isAuthenticated, 
    isAdmin, 
    isProvider, 
    isUser, 
    isLoading 
  } = useAppAuth()

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Authentication Debug Page</h1>
        
        {/* Clerk Status */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-4 text-blue-600">Clerk Authentication</h2>
          <div className="space-y-2">
            <p><strong>Clerk Loaded:</strong> {clerkLoaded ? '✅ Yes' : '❌ No'}</p>
            <p><strong>Signed In:</strong> {isSignedIn ? '✅ Yes' : '❌ No'}</p>
            <p><strong>User Email:</strong> {clerkUser?.emailAddresses[0]?.emailAddress || 'Not available'}</p>
            <p><strong>User ID:</strong> {clerkUser?.id || 'Not available'}</p>
            <p><strong>User Name:</strong> {clerkUser?.fullName || 'Not available'}</p>
          </div>
        </div>

        {/* App Context Status */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-4 text-green-600">App Authentication Context</h2>
          <div className="space-y-2">
            <p><strong>Loading:</strong> {isLoading ? '⏳ Yes' : '✅ No'}</p>
            <p><strong>Authenticated:</strong> {isAuthenticated ? '✅ Yes' : '❌ No'}</p>
            <p><strong>Is Admin:</strong> {isAdmin ? '✅ Yes' : '❌ No'}</p>
            <p><strong>Is Provider:</strong> {isProvider ? '✅ Yes' : '❌ No'}</p>
            <p><strong>Is User:</strong> {isUser ? '✅ Yes' : '❌ No'}</p>
          </div>
        </div>

        {/* App User Data */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-4 text-purple-600">App User Data</h2>
          <div className="space-y-2">
            <p><strong>App User:</strong></p>
            <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto">
              {JSON.stringify(appUser, null, 2)}
            </pre>
          </div>
        </div>

        {/* Supabase User Data */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-4 text-orange-600">Supabase User Data</h2>
          <div className="space-y-2">
            <p><strong>Supabase User:</strong></p>
            <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto">
              {JSON.stringify(supabaseUser, null, 2)}
            </pre>
            {supabaseUser === null && (
              <div className="bg-red-50 border border-red-200 p-4 rounded mt-4">
                <p className="text-red-600 font-semibold">⚠️ Supabase User is NULL</p>
                <p className="text-red-600 text-sm mt-2">
                  This means either:
                  <br />• Database tables don&apos;t exist (run the SQL setup script)
                  <br />• User creation failed (check browser console for errors)
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Environment Variables */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-4 text-red-600">Environment Variables</h2>
          <div className="space-y-2">
            <p><strong>Clerk Publishable Key:</strong> {process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ? '✅ Set' : '❌ Missing'}</p>
            <p><strong>Supabase URL:</strong> {process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Missing'}</p>
            <p><strong>Supabase Anon Key:</strong> {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing'}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="space-y-4">
            <div className="bg-red-50 border border-red-200 p-4 rounded">
              <h3 className="font-semibold text-red-600 mb-2">🚨 REQUIRED: Set Up Database First</h3>
              <p className="text-red-600 text-sm mb-3">
                Your Supabase user is null because the database isn&apos;t set up yet.
              </p>
              <ol className="text-sm text-red-600 space-y-1 mb-3">
                <li>1. Go to your Supabase Dashboard</li>
                <li>2. Click &quot;SQL Editor&quot;</li>
                <li>3. Copy content from `supabase-complete-setup.sql`</li>
                <li>4. Paste and click &quot;Run&quot;</li>
                <li>5. Refresh this page</li>
              </ol>
            </div>
            <div className="space-x-4">
              <a 
                href="/admin/login" 
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
              >
                Go to Admin Login
              </a>
              <a 
                href="/admin/dashboard" 
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
              >
                Go to Admin Dashboard
              </a>
              <Link 
                href="/" 
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
              >
                Go to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}