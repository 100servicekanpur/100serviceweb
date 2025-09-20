'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { useUser, useClerk } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

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
  isAdmin: boolean
  isProvider: boolean
  isUser: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user: clerkUser, isLoaded } = useUser()
  const { signOut } = useClerk()
  const router = useRouter()
  const [supabaseUser, setSupabaseUser] = useState<User | null>(null)
  const [isLoadingSupabase, setIsLoadingSupabase] = useState(false)

  // Check if Clerk is properly configured
  if (typeof window !== 'undefined' && !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
    console.warn('Clerk publishable key is missing. Please check your environment variables.')
  }

  // Fetch user data from Supabase when Clerk user changes
  useEffect(() => {
  const fetchSupabaseUser = async (clerkUser: any) => {
    try {
      console.log('Fetching Supabase user for Clerk ID:', clerkUser.id)
      
      // Look up by Clerk ID first
      let { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', clerkUser.id)
        .single()

      if (error && error.code === 'PGRST116') {
        // User doesn't exist, create them
        console.log('User not found, creating new user')
        await createSupabaseUser()
        
        // Try to fetch again
        const { data: newUser, error: fetchError } = await supabase
          .from('users')
          .select('*')
          .eq('id', clerkUser.id)
          .single()

        if (fetchError) {
          console.error('Error fetching newly created user:', fetchError)
          return null
        }
        
        user = newUser
      } else if (error) {
        console.error('Error fetching user:', error)
        return null
      }

      console.log('Supabase user found:', user)
      return user
    } catch (error) {
      console.error('Error in fetchSupabaseUser:', error)
      return null
    }
  }

  const createSupabaseUser = async () => {
      if (!clerkUser) return

      try {
        // Use Clerk user ID directly since our database now supports it
        const userData = {
          id: clerkUser.id, // Use Clerk ID directly
          email: clerkUser.emailAddresses[0]?.emailAddress || '',
          full_name: clerkUser.fullName || '',
          phone: clerkUser.phoneNumbers[0]?.phoneNumber || '',
          role: clerkUser.emailAddresses[0]?.emailAddress === 'v9ibhav@gmail.com' ? 'admin' : 'customer',
          is_verified: true
        }

        console.log('Creating Supabase user with Clerk ID:', userData)

        const { data: newUser, error } = await supabase
          .from('users')
          .insert([userData])
          .select()
          .single()

        if (error) {
          console.error('Error creating user in Supabase:', error)
          console.error('Error details:', {
            code: error.code,
            message: error.message,
            details: error.details,
            hint: error.hint
          })
          if (error.code === '42P01') {
            console.error('🚨 DATABASE NOT SET UP: users table does not exist!')
            console.error('Please run the supabase-complete-setup.sql script in your Supabase dashboard')
          }
        } else {
          console.log('User created successfully:', newUser)
          setSupabaseUser({
            id: newUser.id,
            email: newUser.email,
            name: newUser.full_name || newUser.name || '',
            full_name: newUser.full_name || newUser.name || '',
            phone: newUser.phone || '',
            role: newUser.role
          })
        }
      } catch (error) {
        console.error('Error in createSupabaseUser:', error)
      }
    }

    if (clerkUser && isLoaded) {
      fetchSupabaseUser(clerkUser)
    } else if (!clerkUser) {
      setSupabaseUser(null)
    }
  }, [clerkUser, isLoaded])

  // Create compatible user object for legacy code
  const compatUser = clerkUser ? {
    id: clerkUser.id,
    email: clerkUser.emailAddresses[0]?.emailAddress || '',
    name: clerkUser.fullName || '',
    full_name: clerkUser.fullName || '',
    phone: clerkUser.phoneNumbers[0]?.phoneNumber || '',
    role: supabaseUser?.role || 'user'
  } : null

  // Role check helpers
  const userRole = supabaseUser?.role || compatUser?.role || 'user'
  const isAdmin = userRole === 'admin'
  const isProvider = userRole === 'provider'
  const isUser = userRole === 'user'

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const login = async (email: string, password: string) => {
    router.push('/sign-in')
    return { success: false, error: 'Please use the sign-in page' }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const register = async (email: string, password: string, name: string, phone?: string) => {
    router.push('/sign-up')
    return { success: false, error: 'Please use the sign-up page' }
  }

  const logout = async () => {
    await signOut()
    router.push('/')
  }

  const value: AuthContextType = {
    user: compatUser,
    supabaseUser,
    isLoading: !isLoaded || isLoadingSupabase,
    login,
    register,
    logout,
    isAuthenticated: !!clerkUser,
    isAdmin,
    isProvider,
    isUser
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
