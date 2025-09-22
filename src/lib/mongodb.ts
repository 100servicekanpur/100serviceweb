// MongoDB Database Utility Functions
// This replaces the Supabase client with MongoDB operations via MCP

import { COLLECTIONS, DATABASE_NAME } from './mongodb-types'
import type { 
  User, 
  Category, 
  Subcategory, 
  Service, 
  Booking, 
  Review, 
  ProviderProfile 
} from './mongodb-types'

declare global {
  interface Window {
    mcpMongoDb: {
      find: (database: string, collection: string, filter?: any, options?: any) => Promise<any>
      insertMany: (database: string, collection: string, documents: any[]) => Promise<any>
      updateMany: (database: string, collection: string, filter: any, update: any) => Promise<any>
      deleteMany: (database: string, collection: string, filter: any) => Promise<any>
      count: (database: string, collection: string, filter?: any) => Promise<number>
      aggregate: (database: string, collection: string, pipeline: any[]) => Promise<any>
    }
  }
}

interface InsertResult {
  insertedIds: string[]
}

interface FindResult<T> {
  documents: T[]
}

class MongoDBService {
  private async executeQuery<T>(operation: string, ...args: any[]): Promise<T> {
    // For now, we'll implement this as API calls to our backend
    // Later this can be optimized to use direct MCP if available
    const response = await fetch('/api/mongodb', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        operation,
        args
      })
    })
    
    if (!response.ok) {
      throw new Error(`MongoDB operation failed: ${response.statusText}`)
    }
    
    return response.json()
  }

  // User operations
  async findUserByClerkId(clerkId: string): Promise<User | null> {
    const result = await this.executeQuery<FindResult<User>>('find', 
      DATABASE_NAME, 
      COLLECTIONS.USERS, 
      { clerkId },
      { limit: 1 }
    )
    return result.documents[0] || null
  }

  async createUser(userData: Omit<User, '_id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    const user: Omit<User, '_id'> = {
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    const result = await this.executeQuery<InsertResult>('insertMany', 
      DATABASE_NAME, 
      COLLECTIONS.USERS, 
      [user]
    )
    return { ...user, _id: result.insertedIds[0] }
  }

  async updateUser(clerkId: string, updates: Partial<User>): Promise<User | null> {
    await this.executeQuery('updateMany',
      DATABASE_NAME,
      COLLECTIONS.USERS,
      { clerkId },
      { $set: { ...updates, updatedAt: new Date() } }
    )
    return this.findUserByClerkId(clerkId)
  }

  async getAllUsers(filter: any = {}): Promise<User[]> {
    const result = await this.executeQuery<FindResult<User>>('find',
      DATABASE_NAME,
      COLLECTIONS.USERS,
      filter
    )
    return result.documents
  }

  // Category operations
  async getAllCategories(): Promise<Category[]> {
    const result = await this.executeQuery<FindResult<Category>>('find',
      DATABASE_NAME,
      COLLECTIONS.CATEGORIES,
      { isActive: true }
    )
    return result.documents
  }

  async createCategory(categoryData: Omit<Category, '_id' | 'createdAt' | 'updatedAt'>): Promise<Category> {
    const category: Omit<Category, '_id'> = {
      ...categoryData,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    const result = await this.executeQuery<InsertResult>('insertMany',
      DATABASE_NAME,
      COLLECTIONS.CATEGORIES,
      [category]
    )
    return { ...category, _id: result.insertedIds[0] }
  }

  async updateCategory(id: string, updates: Partial<Category>): Promise<void> {
    await this.executeQuery('updateMany',
      DATABASE_NAME,
      COLLECTIONS.CATEGORIES,
      { _id: id },
      { $set: { ...updates, updatedAt: new Date() } }
    )
  }

  async deleteCategory(id: string): Promise<void> {
    await this.executeQuery('updateMany',
      DATABASE_NAME,
      COLLECTIONS.CATEGORIES,
      { _id: id },
      { $set: { isActive: false, updatedAt: new Date() } }
    )
  }

  // Subcategory operations
  async getSubcategoriesByCategory(categoryId: string): Promise<Subcategory[]> {
    const result = await this.executeQuery<FindResult<Subcategory>>('find',
      DATABASE_NAME,
      COLLECTIONS.SUBCATEGORIES,
      { categoryId, isActive: true }
    )
    return result.documents
  }

  async createSubcategory(subcategoryData: Omit<Subcategory, '_id' | 'createdAt' | 'updatedAt'>): Promise<Subcategory> {
    const subcategory: Omit<Subcategory, '_id'> = {
      ...subcategoryData,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    const result = await this.executeQuery<InsertResult>('insertMany',
      DATABASE_NAME,
      COLLECTIONS.SUBCATEGORIES,
      [subcategory]
    )
    return { ...subcategory, _id: result.insertedIds[0] }
  }

  // Service operations
  async getAllServices(filter: any = {}): Promise<Service[]> {
    const result = await this.executeQuery<FindResult<Service>>('find',
      DATABASE_NAME,
      COLLECTIONS.SERVICES,
      { isActive: true, ...filter }
    )
    return result.documents
  }

  async getServicesByProvider(providerId: string): Promise<Service[]> {
    return this.getAllServices({ providerId })
  }

  async getServicesByCategory(categoryId: string): Promise<Service[]> {
    return this.getAllServices({ categoryId })
  }

  async createService(serviceData: Omit<Service, '_id' | 'createdAt' | 'updatedAt'>): Promise<Service> {
    const service: Omit<Service, '_id'> = {
      ...serviceData,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    const result = await this.executeQuery<InsertResult>('insertMany',
      DATABASE_NAME,
      COLLECTIONS.SERVICES,
      [service]
    )
    return { ...service, _id: result.insertedIds[0] }
  }

  async updateService(id: string, updates: Partial<Service>): Promise<void> {
    await this.executeQuery('updateMany',
      DATABASE_NAME,
      COLLECTIONS.SERVICES,
      { _id: id },
      { $set: { ...updates, updatedAt: new Date() } }
    )
  }

  // Booking operations
  async getAllBookings(filter: any = {}): Promise<Booking[]> {
    const result = await this.executeQuery<FindResult<Booking>>('find',
      DATABASE_NAME,
      COLLECTIONS.BOOKINGS,
      filter
    )
    return result.documents
  }

  async getBookingsByCustomer(customerId: string): Promise<Booking[]> {
    return this.getAllBookings({ customerId })
  }

  async getBookingsByProvider(providerId: string): Promise<Booking[]> {
    return this.getAllBookings({ providerId })
  }

  async createBooking(bookingData: Omit<Booking, '_id' | 'createdAt' | 'updatedAt'>): Promise<Booking> {
    const booking: Omit<Booking, '_id'> = {
      ...bookingData,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    const result = await this.executeQuery<InsertResult>('insertMany',
      DATABASE_NAME,
      COLLECTIONS.BOOKINGS,
      [booking]
    )
    return { ...booking, _id: result.insertedIds[0] }
  }

  async updateBooking(id: string, updates: Partial<Booking>): Promise<void> {
    await this.executeQuery('updateMany',
      DATABASE_NAME,
      COLLECTIONS.BOOKINGS,
      { _id: id },
      { $set: { ...updates, updatedAt: new Date() } }
    )
  }

  // Analytics operations
  async getDashboardStats() {
    const [userCount, serviceCount, bookingCount, categoryCount] = await Promise.all([
      this.executeQuery<number>('count', DATABASE_NAME, COLLECTIONS.USERS),
      this.executeQuery<number>('count', DATABASE_NAME, COLLECTIONS.SERVICES, { isActive: true }),
      this.executeQuery<number>('count', DATABASE_NAME, COLLECTIONS.BOOKINGS),
      this.executeQuery<number>('count', DATABASE_NAME, COLLECTIONS.CATEGORIES, { isActive: true })
    ])

    return {
      totalUsers: userCount,
      totalServices: serviceCount,
      totalBookings: bookingCount,
      totalCategories: categoryCount
    }
  }

  // Admin specific operations
  async getAdminDashboardStats() {
    const [
      totalUsers,
      totalProviders,
      totalCustomers,
      totalServices,
      approvedServices,
      pendingServices,
      totalBookings,
      completedBookings,
      pendingBookings
    ] = await Promise.all([
      this.executeQuery<number>('count', DATABASE_NAME, COLLECTIONS.USERS),
      this.executeQuery<number>('count', DATABASE_NAME, COLLECTIONS.USERS, { role: 'provider' }),
      this.executeQuery<number>('count', DATABASE_NAME, COLLECTIONS.USERS, { role: 'customer' }),
      this.executeQuery<number>('count', DATABASE_NAME, COLLECTIONS.SERVICES),
      this.executeQuery<number>('count', DATABASE_NAME, COLLECTIONS.SERVICES, { status: 'approved' }),
      this.executeQuery<number>('count', DATABASE_NAME, COLLECTIONS.SERVICES, { status: 'pending' }),
      this.executeQuery<number>('count', DATABASE_NAME, COLLECTIONS.BOOKINGS),
      this.executeQuery<number>('count', DATABASE_NAME, COLLECTIONS.BOOKINGS, { status: 'completed' }),
      this.executeQuery<number>('count', DATABASE_NAME, COLLECTIONS.BOOKINGS, { status: 'pending' })
    ])

    // Calculate revenue from completed bookings
    const completedBookingsList = await this.executeQuery<FindResult<Booking>>('find',
      DATABASE_NAME,
      COLLECTIONS.BOOKINGS,
      { status: 'completed' }
    )
    
    const totalRevenue = completedBookingsList.documents.reduce((sum, booking) => sum + (booking.totalAmount || 0), 0)

    return {
      totalUsers,
      totalProviders,
      totalCustomers,
      totalServices,
      approvedServices,
      pendingServices,
      totalBookings,
      completedBookings,
      pendingBookings,
      totalRevenue,
      activeProviders: totalProviders // For now, assuming all providers are active
    }
  }

  async getRecentActivities(limit: number = 10) {
    const result = await this.executeQuery<FindResult<any>>('find',
      DATABASE_NAME,
      'activities',
      {},
      { limit, sort: { timestamp: -1 } }
    )
    return result.documents
  }

  async getAllUsersWithDetails(filter: any = {}) {
    const result = await this.executeQuery<FindResult<User>>('find',
      DATABASE_NAME,
      COLLECTIONS.USERS,
      filter
    )
    return result.documents
  }

  async getAllServicesWithDetails(filter: any = {}) {
    const result = await this.executeQuery<FindResult<Service>>('find',
      DATABASE_NAME,
      COLLECTIONS.SERVICES,
      filter
    )
    return result.documents
  }

  async getAllBookingsWithDetails(filter: any = {}) {
    const result = await this.executeQuery<FindResult<Booking>>('find',
      DATABASE_NAME,
      COLLECTIONS.BOOKINGS,
      filter
    )
    return result.documents
  }

  async updateServiceStatus(serviceId: string, status: 'approved' | 'pending' | 'rejected') {
    await this.executeQuery('updateMany',
      DATABASE_NAME,
      COLLECTIONS.SERVICES,
      { _id: serviceId },
      { $set: { status, updatedAt: new Date() } }
    )
  }

  async updateUserRole(userId: string, role: 'admin' | 'provider' | 'customer') {
    await this.executeQuery('updateMany',
      DATABASE_NAME,
      COLLECTIONS.USERS,
      { _id: userId },
      { $set: { role, updatedAt: new Date() } }
    )
  }

  async deleteUser(userId: string) {
    await this.executeQuery('deleteMany',
      DATABASE_NAME,
      COLLECTIONS.USERS,
      { _id: userId }
    )
  }

  async deleteService(serviceId: string) {
    await this.executeQuery('updateMany',
      DATABASE_NAME,
      COLLECTIONS.SERVICES,
      { _id: serviceId },
      { $set: { isActive: false, updatedAt: new Date() } }
    )
  }

  // Provider profile operations
  async getProviderProfile(userId: string): Promise<ProviderProfile | null> {
    const result = await this.executeQuery<FindResult<ProviderProfile>>('find',
      DATABASE_NAME,
      COLLECTIONS.PROVIDER_PROFILES,
      { userId },
      { limit: 1 }
    )
    return result.documents[0] || null
  }

  async createProviderProfile(profileData: Omit<ProviderProfile, '_id' | 'createdAt' | 'updatedAt'>): Promise<ProviderProfile> {
    const profile: Omit<ProviderProfile, '_id'> = {
      ...profileData,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    const result = await this.executeQuery<InsertResult>('insertMany',
      DATABASE_NAME,
      COLLECTIONS.PROVIDER_PROFILES,
      [profile]
    )
    return { ...profile, _id: result.insertedIds[0] }
  }
}

// Export singleton instance
export const mongodb = new MongoDBService()
export default mongodb