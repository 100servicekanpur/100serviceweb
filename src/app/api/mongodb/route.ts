// API route to handle MongoDB operations via MCP
import { NextRequest, NextResponse } from 'next/server'

// In-memory store for development (replace with actual MongoDB connection)
let users: any[] = [
  {
    _id: 'user_1',
    clerkId: 'clerk_admin',
    email: 'admin@100service.in',
    fullName: 'Admin User',
    role: 'admin',
    isVerified: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: 'user_2',
    clerkId: 'clerk_provider_1',
    email: 'provider1@example.com',
    fullName: 'John Provider',
    phone: '+91 9876543210',
    role: 'provider',
    isVerified: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: 'user_3',
    clerkId: 'clerk_customer_1',
    email: 'customer1@example.com',
    fullName: 'Jane Customer',
    phone: '+91 8765432109',
    role: 'customer',
    isVerified: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
]

let bookings: any[] = [
  {
    _id: 'booking_1',
    userId: 'user_3',
    serviceId: 'service_1',
    providerId: 'user_2',
    bookingDate: new Date().toISOString(),
    status: 'completed',
    totalAmount: 1500,
    customerAddress: '123 Main St, City',
    customerPhone: '+91 8765432109',
    createdAt: new Date(Date.now() - 86400000).toISOString() // 1 day ago
  },
  {
    _id: 'booking_2',
    userId: 'user_3',
    serviceId: 'service_2',
    providerId: 'user_2',
    bookingDate: new Date().toISOString(),
    status: 'pending',
    totalAmount: 2500,
    customerAddress: '456 Oak Ave, City',
    customerPhone: '+91 8765432109',
    createdAt: new Date(Date.now() - 3600000).toISOString() // 1 hour ago
  }
]

let services: any[] = [
  {
    _id: 'service_1',
    title: 'Home Cleaning Service',
    description: 'Professional home cleaning service',
    categoryId: 'category_1',
    providerId: 'user_2',
    price: 1500,
    status: 'approved',
    isActive: true,
    createdAt: new Date(Date.now() - 172800000).toISOString() // 2 days ago
  },
  {
    _id: 'service_2',
    title: 'Electrical Repair',
    description: 'Professional electrical repair services',
    categoryId: 'category_2',
    providerId: 'user_2',
    price: 2500,
    status: 'pending',
    isActive: true,
    createdAt: new Date(Date.now() - 86400000).toISOString() // 1 day ago
  }
]

let categories: any[] = [
  {
    _id: 'category_1',
    name: 'Home Services',
    description: 'Professional home cleaning and maintenance services',
    imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100&h=100&fit=crop&crop=center',
    isActive: true,
    createdAt: new Date(Date.now() - 2592000000).toISOString(), // 30 days ago
    updatedAt: new Date(Date.now() - 2592000000).toISOString()
  },
  {
    _id: 'category_2',
    name: 'Repairs & Maintenance',
    description: 'Electrical, plumbing, and general repair services',
    imageUrl: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=100&h=100&fit=crop&crop=center',
    isActive: true,
    createdAt: new Date(Date.now() - 2505600000).toISOString(), // 29 days ago
    updatedAt: new Date(Date.now() - 2505600000).toISOString()
  },
  {
    _id: 'category_3',
    name: 'Beauty & Wellness',
    description: 'Personal care and wellness services',
    imageUrl: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=100&h=100&fit=crop&crop=center',
    isActive: false,
    createdAt: new Date(Date.now() - 2419200000).toISOString(), // 28 days ago
    updatedAt: new Date(Date.now() - 2419200000).toISOString()
  },
  {
    _id: 'category_4',
    name: 'Fitness & Training',
    description: 'Personal training and fitness services',
    imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=100&h=100&fit=crop&crop=center',
    isActive: true,
    createdAt: new Date(Date.now() - 2332800000).toISOString(), // 27 days ago
    updatedAt: new Date(Date.now() - 2332800000).toISOString()
  }
]

let activities: any[] = [
  {
    _id: 'activity_1',
    type: 'user_registered',
    message: 'New service provider registered',
    details: 'John Provider joined as a service provider',
    timestamp: new Date(Date.now() - 120000).toISOString() // 2 minutes ago
  },
  {
    _id: 'activity_2',
    type: 'service_approved',
    message: 'Service approved: Home Cleaning',
    details: 'Home Cleaning Service has been approved',
    timestamp: new Date(Date.now() - 900000).toISOString() // 15 minutes ago
  },
  {
    _id: 'activity_3',
    type: 'booking_completed',
    message: 'Booking completed: Electrical Repair',
    details: 'Customer completed electrical repair booking',
    timestamp: new Date(Date.now() - 3600000).toISOString() // 1 hour ago
  }
]

export async function POST(request: NextRequest) {
  try {
    const { operation, args } = await request.json()
    
    // This will interface with the MCP MongoDB server
    // For now, we'll use an in-memory store for development
    
    switch (operation) {
      case 'find':
        // Simulate MCP find operation
        const [database, collection, filter, options] = args
        
        if (collection === 'users') {
          let results = users
          if (filter && filter.clerkId) {
            results = users.filter(user => user.clerkId === filter.clerkId)
          }
          if (filter && filter.role) {
            results = users.filter(user => user.role === filter.role)
          }
          return NextResponse.json({
            documents: results
          })
        }
        
        if (collection === 'bookings') {
          let results = bookings
          if (filter && filter.status) {
            results = bookings.filter(booking => booking.status === filter.status)
          }
          return NextResponse.json({
            documents: results
          })
        }
        
        if (collection === 'services') {
          let results = services
          if (filter && filter.status) {
            results = services.filter(service => service.status === filter.status)
          }
          return NextResponse.json({
            documents: results
          })
        }

        if (collection === 'categories') {
          let results = categories
          if (filter && filter.isActive !== undefined) {
            results = categories.filter(category => category.isActive === filter.isActive)
          }
          return NextResponse.json({
            documents: results
          })
        }
        
        if (collection === 'activities') {
          return NextResponse.json({
            documents: activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
          })
        }
        
        return NextResponse.json({
          documents: []
        })
        
      case 'count':
        const [countDb, countCollection, countFilter] = args
        
        if (countCollection === 'users') {
          let count = users.length
          if (countFilter && countFilter.role) {
            count = users.filter(user => user.role === countFilter.role).length
          }
          return NextResponse.json(count)
        }
        
        if (countCollection === 'bookings') {
          let count = bookings.length
          if (countFilter && countFilter.status) {
            count = bookings.filter(booking => booking.status === countFilter.status).length
          }
          return NextResponse.json(count)
        }
        
        if (countCollection === 'services') {
          let count = services.length
          if (countFilter && countFilter.status) {
            count = services.filter(service => service.status === countFilter.status).length
          }
          return NextResponse.json(count)
        }

        if (countCollection === 'categories') {
          let count = categories.length
          if (countFilter && countFilter.isActive !== undefined) {
            count = categories.filter(category => category.isActive === countFilter.isActive).length
          }
          return NextResponse.json(count)
        }
        
        return NextResponse.json(0)
        
      case 'insertMany':
        const [insertDb, insertCollection, documents] = args
        
        if (insertCollection === 'users') {
          const newUsers = documents.map((doc: any) => ({
            _id: `user_${Date.now()}_${Math.random()}`,
            ...doc,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }))
          users.push(...newUsers)
          return NextResponse.json({
            insertedIds: newUsers.map((u: any) => u._id)
          })
        }

        if (insertCollection === 'categories') {
          const newCategories = documents.map((doc: any) => ({
            _id: `category_${Date.now()}_${Math.random()}`,
            ...doc,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }))
          categories.push(...newCategories)
          return NextResponse.json({
            insertedIds: newCategories.map((c: any) => c._id)
          })
        }
        
        return NextResponse.json({
          insertedIds: documents.map(() => `generated_id_${Date.now()}_${Math.random()}`)
        })
        
      case 'updateMany':
        const [updateDb, updateCollection, updateFilter, updateData] = args
        
        if (updateCollection === 'categories') {
          const categoryIndex = categories.findIndex(cat => cat._id === updateFilter._id)
          if (categoryIndex !== -1) {
            categories[categoryIndex] = {
              ...categories[categoryIndex],
              ...updateData.$set,
              updatedAt: new Date().toISOString()
            }
          }
          return NextResponse.json({ modifiedCount: 1 })
        }
        
        return NextResponse.json({ modifiedCount: 1 })
        
      case 'deleteMany':
        const [deleteDb, deleteCollection, deleteFilter] = args
        
        if (deleteCollection === 'categories') {
          const initialLength = categories.length
          categories = categories.filter(cat => cat._id !== deleteFilter._id)
          return NextResponse.json({ deletedCount: initialLength - categories.length })
        }
        
        return NextResponse.json({ deletedCount: 1 })
        
      case 'count':
        // Handle count operations
        return NextResponse.json(0)
        
      case 'aggregate':
        // Handle aggregation operations
        return NextResponse.json({
          documents: []
        })
        
      default:
        return NextResponse.json(
          { error: `Unsupported operation: ${operation}` },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('MongoDB API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}