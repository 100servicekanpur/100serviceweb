'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

interface AdminProtectedProps {
  children: React.ReactNode
  fallbackPath?: string
}

export default function AdminProtected({ children, fallbackPath = '/admin/login' }: AdminProtectedProps) {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push(fallbackPath)
        return
      }

      if (user && user.role !== 'admin') {
        router.push('/')
        return
      }
    }
  }, [isAuthenticated, user, isLoading, router, fallbackPath])

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Don't render children if not authenticated or not admin
  if (!isAuthenticated || !user || user.role !== 'admin') {
    return null
  }

  return <>{children}</>
}