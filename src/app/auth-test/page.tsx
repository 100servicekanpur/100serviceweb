'use client'

import Link from 'next/link'
import { useUser, useAuth } from '@clerk/nextjs'
import { useAuth as useAppAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { useEffect, useState } from 'react'

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

  const [envCheck, setEnvCheck] = useState({
    supabaseUrl: '',
    supabaseKey: '',
    clerkKey: '',
    hasConnection: false
  })

  const [dbCheck, setDbCheck] = useState<{
    tables: string[]
    usersCount: number
    categoriesCount: number
    error: string
  }>({
    tables: [],
    usersCount: 0,
    categoriesCount: 0,
    error: ''
  })

  useEffect(() => {
    // Check environment variables
    setEnvCheck({
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || 'Missing',
      supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Present' : 'Missing',
      clerkKey: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ? 'Present' : 'Missing',
      hasConnection: !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
    })

    // Test database connection
    testDatabaseConnection()
  }, [])

  const testDatabaseConnection = async () => {
    try {
      // Test basic connection
      const { data: tables, error: tablesError } = await supabase
        .from('categories')
        .select('id')
        .limit(1)

      if (tablesError) {
        setDbCheck(prev => ({ ...prev, error: tablesError.message }))
        return
      }

      // Count users
      const { count: usersCount } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })

      // Count categories  
      const { count: categoriesCount } = await supabase
        .from('categories')
        .select('*', { count: 'exact', head: true })

      setDbCheck({
        tables: ['users', 'categories', 'services'], // We know these exist if query worked
        usersCount: usersCount || 0,
        categoriesCount: categoriesCount || 0,
        error: ''
      })
    } catch (err) {
      setDbCheck(prev => ({ ...prev, error: err instanceof Error ? err.message : 'Unknown error' }))
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">🔍 Production Debug Dashboard</h1>
        
        {/* Environment Variables Check */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-4 text-purple-600">🌐 Environment Variables</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <p><strong>Supabase URL:</strong> 
                <span className={envCheck.supabaseUrl !== 'Missing' ? 'text-green-600 ml-2' : 'text-red-600 ml-2'}>
                  {envCheck.supabaseUrl !== 'Missing' ? '✅ Configured' : '❌ Missing'}
                </span>
              </p>
              <p><strong>Supabase Key:</strong> 
                <span className={envCheck.supabaseKey === 'Present' ? 'text-green-600 ml-2' : 'text-red-600 ml-2'}>
                  {envCheck.supabaseKey === 'Present' ? '✅ Present' : '❌ Missing'}
                </span>
              </p>
              <p><strong>Clerk Key:</strong> 
                <span className={envCheck.clerkKey === 'Present' ? 'text-green-600 ml-2' : 'text-red-600 ml-2'}>
                  {envCheck.clerkKey === 'Present' ? '✅ Present' : '❌ Missing'}
                </span>
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded">
              <p><strong>Database Connection:</strong> 
                <span className={envCheck.hasConnection ? 'text-green-600 ml-2' : 'text-red-600 ml-2'}>
                  {envCheck.hasConnection ? '✅ Ready' : '❌ Not Ready'}
                </span>
              </p>
              {!envCheck.hasConnection && (
                <div className="mt-2 text-sm text-red-600">
                  ⚠️ Add Supabase environment variables to Vercel
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Database Status */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-4 text-blue-600">🗄️ Database Status</h2>
          {dbCheck.error ? (
            <div className="bg-red-50 border border-red-200 rounded p-4 mb-4">
              <p className="text-red-800"><strong>❌ Database Error:</strong></p>
              <p className="text-red-600 text-sm mt-1">{dbCheck.error}</p>
              <div className="mt-3 text-sm text-red-700">
                <p><strong>Common fixes:</strong></p>
                <ul className="list-disc list-inside mt-1">
                  <li>Run the SQL setup script in Supabase</li>
                  <li>Check environment variables in Vercel</li>
                  <li>Verify Supabase project is active</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-green-50 border border-green-200 rounded p-4">
                <p className="text-green-800 font-semibold">✅ Database Connected</p>
                <p className="text-green-600 text-sm">Tables accessible</p>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded p-4">
                <p className="text-blue-800 font-semibold">👥 Users: {dbCheck.usersCount}</p>
                <p className="text-blue-600 text-sm">Total registered users</p>
              </div>
              <div className="bg-purple-50 border border-purple-200 rounded p-4">
                <p className="text-purple-800 font-semibold">📂 Categories: {dbCheck.categoriesCount}</p>
                <p className="text-purple-600 text-sm">Service categories</p>
              </div>
            </div>
          )}
        </div>
        
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