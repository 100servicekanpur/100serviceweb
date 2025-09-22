// MongoDB Models and Types for 100Service Platform

export interface User {
  _id?: string
  clerkId: string
  email: string
  fullName: string
  phone?: string
  role: 'customer' | 'provider' | 'admin'
  avatarUrl?: string
  address?: string
  city?: string
  state?: string
  postalCode?: string
  isVerified: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Category {
  _id?: string
  name: string
  description?: string
  imageUrl?: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Subcategory {
  _id?: string
  name: string
  description?: string
  categoryId: string
  imageUrl?: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Service {
  _id?: string
  title: string
  description: string
  categoryId: string
  subcategoryId?: string
  providerId: string
  price: number
  imageUrl?: string
  images?: string[]
  duration?: number // in minutes
  status: 'pending' | 'approved' | 'rejected'
  isActive: boolean
  rating?: number
  reviewCount?: number
  createdAt: Date
  updatedAt: Date
}

export interface Booking {
  _id?: string
  customerId: string
  providerId: string
  serviceId: string
  status: 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled'
  scheduledDate: Date
  scheduledTime: string
  customerAddress: string
  customerPhone: string
  customerNotes?: string
  providerNotes?: string
  totalAmount: number
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded'
  paymentMethod?: string
  createdAt: Date
  updatedAt: Date
}

export interface Review {
  _id?: string
  bookingId: string
  customerId: string
  providerId: string
  serviceId: string
  rating: number // 1-5
  comment?: string
  createdAt: Date
}

export interface ProviderProfile {
  _id?: string
  userId: string
  businessName?: string
  description?: string
  expertise: string[]
  serviceAreas: string[]
  availability: {
    [key: string]: { // day of week
      isAvailable: boolean
      startTime: string
      endTime: string
    }
  }
  rating?: number
  reviewCount?: number
  isVerified: boolean
  documents?: string[] // URLs to verification documents
  createdAt: Date
  updatedAt: Date
}

// Database Collections Configuration
export const COLLECTIONS = {
  USERS: 'users',
  CATEGORIES: 'categories',
  SUBCATEGORIES: 'subcategories',
  SERVICES: 'services',
  BOOKINGS: 'bookings',
  REVIEWS: 'reviews',
  PROVIDER_PROFILES: 'provider_profiles'
} as const

// Database name
export const DATABASE_NAME = '100service'