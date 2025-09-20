'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

interface RoleProtectedProps {
  children: React.ReactNode
  requiredRole: 'admin' | 'provider' | 'user'
  fallbackPath?: string
}

export default function RoleProtected({ 
  children, 
  requiredRole, 
  fallbackPath = '/' 
}: RoleProtectedProps) {
  const { isAuthenticated, isAdmin, isProvider, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/admin/login')
      return
    }

    if (!isLoading && isAuthenticated) {
      let hasAccess = false
      
      switch (requiredRole) {
        case 'admin':
          hasAccess = isAdmin
          break
        case 'provider':
          hasAccess = isProvider || isAdmin // Admin can access provider areas
          break
        case 'user':
          hasAccess = true // All authenticated users can access user areas
          break
      }

      if (!hasAccess) {
        router.push(fallbackPath)
      }
    }
  }, [isAuthenticated, isAdmin, isProvider, isLoading, requiredRole, router, fallbackPath])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    )
  }

  // Check access again
  let hasAccess = false
  switch (requiredRole) {
    case 'admin':
      hasAccess = isAdmin
      break
    case 'provider':
      hasAccess = isProvider || isAdmin
      break
    case 'user':
      hasAccess = true
      break
  }

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-6">
            You don&apos;t have permission to access this area.
          </p>
          <button
            onClick={() => router.push(fallbackPath)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  return <>{children}</>
}