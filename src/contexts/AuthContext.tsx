'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { useUser, useClerk } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { mongodb } from '@/lib/mongodb'
import type { User } from '@/lib/mongodb-types'

interface AuthContextType {
  user: User | null
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
  const [mongoUser, setMongoUser] = useState<User | null>(null)
  const [isLoadingMongo, setIsLoadingMongo] = useState(false)

  useEffect(() => {
    const fetchMongoUser = async (clerkUser: any) => {
      try {
        setIsLoadingMongo(true)
        let user = await mongodb.findUserByClerkId(clerkUser.id)
        
        if (!user) {
          await createMongoUser(clerkUser)
          user = await mongodb.findUserByClerkId(clerkUser.id)
        }
        setMongoUser(user)
      } catch (err) {
        console.error('Error in fetchMongoUser:', err)
        setMongoUser(null)
      } finally {
        setIsLoadingMongo(false)
      }
    }

    const createMongoUser = async (clerkUser: any) => {
      if (!clerkUser) return
      const userData: Omit<User, '_id' | 'createdAt' | 'updatedAt'> = {
        clerkId: clerkUser.id,
        email: clerkUser.emailAddresses?.[0]?.emailAddress || '',
        fullName: clerkUser.fullName || clerkUser.firstName || 'User',
        phone: clerkUser.phoneNumbers?.[0]?.phoneNumber || undefined,
        role: clerkUser.emailAddresses?.[0]?.emailAddress === 'v9ibhav@gmail.com' ? 'admin' : 'customer',
        isVerified: clerkUser.emailAddresses?.[0]?.verification?.status === 'verified'
      }
      await mongodb.createUser(userData)
    }

    if (isLoaded && clerkUser) {
      fetchMongoUser(clerkUser)
    } else if (!clerkUser) {
      setMongoUser(null)
      setIsLoadingMongo(false)
    }
  }, [clerkUser, isLoaded])

  const login = async () => {
    return { success: false, error: 'Please use Clerk sign-in' }
  }

  const register = async () => {
    return { success: false, error: 'Please use Clerk sign-up' }
  }

  const logout = async () => {
    await signOut()
    setMongoUser(null)
    router.push('/')
  }

  return (
    <AuthContext.Provider
      value={{
        user: mongoUser,
        isLoading: !isLoaded || isLoadingMongo,
        login,
        register,
        logout,
        isAuthenticated: !!clerkUser && isLoaded,
        isAdmin: mongoUser?.role === 'admin',
        isProvider: mongoUser?.role === 'provider',
        isUser: mongoUser?.role === 'customer',
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
