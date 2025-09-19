'use client'

import React, { createContext, useContext } from 'react'
import { useUser, useClerk } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'

interface User {
  id: string
  email: string
  name: string
  full_name: string
  phone: string
  role?: string
}

interface AuthContextType {
  user: User | null
  supabaseUser: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  register: (email: string, password: string, name: string, phone?: string) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user: clerkUser, isLoaded } = useUser()
  const { signOut } = useClerk()
  const router = useRouter()

  const compatUser = clerkUser ? {
    id: clerkUser.id,
    email: clerkUser.emailAddresses[0]?.emailAddress || '',
    name: clerkUser.fullName || '',
    full_name: clerkUser.fullName || '',
    phone: clerkUser.phoneNumbers[0]?.phoneNumber || '',
    role: 'admin' // For demo purposes - in production, get from Clerk metadata
  } : null

  const login = async (_email: string, _password: string) => {
    router.push('/sign-in')
    return { success: false, error: 'Please use the sign-in page' }
  }

  const register = async (_email: string, _password: string, _name: string, _phone?: string) => {
    router.push('/sign-up')
    return { success: false, error: 'Please use the sign-up page' }
  }

  const logout = async () => {
    await signOut()
    router.push('/')
  }

  const value: AuthContextType = {
    user: compatUser,
    supabaseUser: null,
    isLoading: !isLoaded,
    login,
    register,
    logout,
    isAuthenticated: !!clerkUser
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
