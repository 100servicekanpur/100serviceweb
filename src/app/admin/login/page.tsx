'use client'

export const dynamic = 'force-dynamic'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { SignInButton, SignedIn, SignedOut } from '@clerk/nextjs'
import { 
  EyeIcon, 
  EyeSlashIcon,
  ShieldCheckIcon,
  LockClosedIcon
} from '@heroicons/react/24/outline'

export default function AdminLoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const { isAdmin, isAuthenticated, user } = useAuth()
  const router = useRouter()

  // Redirect if already authenticated as admin
  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      router.push('/admin/dashboard')
    }
  }, [isAuthenticated, isAdmin, router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // This will be handled by Clerk's SignInButton
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-gradient-to-br from-white/20 to-white/10 rounded-2xl backdrop-blur-sm flex items-center justify-center">
            <ShieldCheckIcon className="h-8 w-8 text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-white">
            Admin Portal
          </h2>
          <p className="mt-2 text-gray-300">
            Sign in to access the admin dashboard
          </p>
        </div>

        {/* Login Form */}
        <SignedOut>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
              <div className="space-y-6">
                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                    Admin Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="mt-1 appearance-none relative block w-full px-4 py-3 border border-gray-600 bg-gray-800/50 placeholder-gray-400 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/30 focus:z-10"
                    placeholder="admin@100service.in"
                  />
                </div>

                {/* Password Field */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                    Password
                  </label>
                  <div className="mt-1 relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className="appearance-none relative block w-full px-4 py-3 pr-12 border border-gray-600 bg-gray-800/50 placeholder-gray-400 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/30 focus:z-10"
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                      ) : (
                        <EyeIcon className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Submit Button - Use Clerk SignInButton */}
                <SignInButton 
                  mode="modal"
                  fallbackRedirectUrl="/admin/dashboard"
                  signUpFallbackRedirectUrl="/admin/dashboard"
                >
                  <button
                    type="button"
                    className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-black bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white/20 transition-all duration-200"
                  >
                    <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                      <LockClosedIcon className="h-5 w-5 text-gray-600 group-hover:text-gray-800" />
                    </span>
                    Sign in to Admin Panel
                  </button>
                </SignInButton>
              </div>
            </div>
          </form>
        </SignedOut>

        {/* Already signed in */}
        <SignedIn>
          <div className="mt-8 bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 text-center">
            <div className="text-white mb-4">
              Welcome back, {user?.email}!
            </div>
            {isAdmin ? (
              <Link
                href="/admin/dashboard"
                className="inline-flex items-center justify-center py-3 px-6 border border-transparent text-sm font-medium rounded-xl text-black bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white/20 transition-all duration-200"
              >
                Go to Admin Dashboard
              </Link>
            ) : (
              <div className="text-red-300">
                You don&apos;t have admin privileges. Contact system administrator.
              </div>
            )}
          </div>
        </SignedIn>

        {/* Demo Credentials */}
        <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
          <p className="text-sm text-blue-300 text-center">
            <strong>Admin Login:</strong> v9ibhav@gmail.com / Vaibhav@1233
          </p>
        </div>

        {/* Back to Home */}
        <div className="text-center">
          <Link
            href="/"
            className="text-gray-400 hover:text-white transition-colors duration-200"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}