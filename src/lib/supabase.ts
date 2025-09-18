import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for our database
export interface User {
  id: string
  email: string
  full_name: string
  phone?: string
  role: 'customer' | 'provider' | 'admin'
  avatar_url?: string
  address?: string
  city?: string
  state?: string
  postal_code?: string
  is_verified: boolean
  created_at: string
  updated_at: string
}

export interface Service {
  id: string
  title: string
  description: string
  category_id: string
  price: number
  user_id: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Category {
  id: string
  name: string
  description?: string
  is_active: boolean
  created_at: string
  updated_at: string
}