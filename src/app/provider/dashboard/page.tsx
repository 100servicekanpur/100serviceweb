'use client'

export const dynamic = 'force-dynamic'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import {
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  CurrencyRupeeIcon,
  StarIcon,
  CheckIcon,
  XMarkIcon,
  EyeIcon,
  PhoneIcon,
  UserIcon,
  ChartBarIcon,
  BanknotesIcon,
  ClipboardDocumentListIcon
} from '@heroicons/react/24/outline'

interface ProviderBooking {
  id: string
  user_id: string
  booking_date: string
  booking_time: string
  total_amount: number
  status: string
  customer_address: string
  customer_phone: string
  special_instructions: string
  created_at: string
  actual_start_time: string | null
  actual_end_time: string | null
  service: {
    title: string
    short_description: string
  }
  package: {
    name: string
  }
  customer: {
    full_name: string
    email: string
    phone: string
  }
}

interface ProviderStats {
  totalEarnings: number
  completedJobs: number
  averageRating: number
  activeBookings: number
  monthlyEarnings: number
  totalCustomers: number
}

export default function ProviderDashboard() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()

  const [activeTab, setActiveTab] = useState('dashboard')
  const [bookings, setBookings] = useState<ProviderBooking[]>([])
  const [stats, setStats] = useState<ProviderStats>({
    totalEarnings: 0,
    completedJobs: 0,
    averageRating: 0,
    activeBookings: 0,
    monthlyEarnings: 0,
    totalCustomers: 0
  })
  const [loading, setLoading] = useState(true)
  const [selectedStatus, setSelectedStatus] = useState('all')

  // Redirect if not authenticated or not a provider
  useEffect(() => {
    if (!isAuthenticated && !loading) {
      router.push('/login')
    } else if (user && user.role !== 'provider' && user.role !== 'admin') {
      router.push('/dashboard') // Redirect to user dashboard
    }
  }, [isAuthenticated, loading, user, router])

  // Fetch provider data
  useEffect(() => {
    if (user && isAuthenticated && (user.role === 'provider' || user.role === 'admin')) {
      fetchProviderData()
    }
  }, [user, isAuthenticated])

  const fetchProviderData = async () => {
    try {
      setLoading(true)

      // Fetch bookings assigned to this provider
      // Fetch provider's bookings through services
      const { data: bookingsData, error: bookingsError } = await supabase
        .from('bookings')
        .select(`
          *,
          service:services!inner(title, short_description, provider_id),
          package:service_packages(name),
          customer:users!user_id(full_name, email, phone)
        `)
        .eq('service.provider_id', user?.id)
        .order('created_at', { ascending: false })

      if (bookingsError) throw bookingsError

      // Calculate stats
      const totalEarnings = bookingsData
        ?.filter(b => b.status === 'completed')
        .reduce((sum, b) => sum + (b.total_amount || 0), 0) || 0
      
      const completedJobs = bookingsData?.filter(b => b.status === 'completed').length || 0
      const activeBookings = bookingsData?.filter(b => 
        ['pending', 'confirmed', 'in_progress'].includes(b.status)
      ).length || 0

      // Calculate monthly earnings (current month)
      const currentMonth = new Date().getMonth()
      const currentYear = new Date().getFullYear()
      const monthlyEarnings = bookingsData
        ?.filter(b => {
          const bookingDate = new Date(b.created_at)
          return b.status === 'completed' && 
                 bookingDate.getMonth() === currentMonth && 
                 bookingDate.getFullYear() === currentYear
        })
        .reduce((sum, b) => sum + (b.total_amount || 0), 0) || 0

      const uniqueCustomers = new Set(bookingsData?.map(b => b.customer_id)).size

      setBookings(bookingsData || [])
      setStats({
        totalEarnings,
        completedJobs,
        averageRating: 4.8, // Placeholder - would calculate from reviews
        activeBookings,
        monthlyEarnings,
        totalCustomers: uniqueCustomers
      })
    } catch (error) {
      console.error('Error fetching provider data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'confirmed':
        return 'bg-blue-100 text-blue-800'
      case 'in_progress':
        return 'bg-purple-100 text-purple-800'
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const updateBookingStatus = async (bookingId: string, newStatus: string) => {
    try {
      const updateData: Record<string, string> = { status: newStatus }
      
      // Add timestamp tracking for different status changes
      switch (newStatus) {
        case 'confirmed':
          updateData.confirmed_at = new Date().toISOString()
          break
        case 'in_progress':
          updateData.actual_start_time = new Date().toISOString()
          break
        case 'completed':
          updateData.actual_end_time = new Date().toISOString()
          updateData.payment_status = 'completed' // Auto-complete payment
          break
        case 'cancelled':
          updateData.cancelled_at = new Date().toISOString()
          updateData.payment_status = 'refunded'
          break
      }

      const { error } = await supabase
        .from('bookings')
        .update(updateData)
        .eq('id', bookingId)

      if (error) throw error

      // Create status change notification for customer
      await createStatusNotification(bookingId, newStatus)

      // Refresh data
      fetchProviderData()
      
      // Show success message
      showStatusUpdateSuccess(newStatus)
    } catch (error) {
      console.error('Error updating booking status:', error)
      alert('Failed to update booking status. Please try again.')
    }
  }

  const createStatusNotification = async (bookingId: string, newStatus: string) => {
    try {
      const booking = bookings.find(b => b.id === bookingId)
      if (!booking) return

      const notificationMessages: Record<string, string> = {
        'confirmed': 'Your booking has been confirmed by the provider',
        'in_progress': 'Your service is now in progress',
        'completed': 'Your service has been completed',
        'cancelled': 'Your booking has been cancelled'
      }

      // Create notification record (you would implement notifications table)
      const notificationData = {
        user_id: booking.user_id,
        booking_id: bookingId,
        title: `Booking Status Updated`,
        message: notificationMessages[newStatus] || `Booking status changed to ${newStatus}`,
        type: 'booking_status',
        is_read: false,
        created_at: new Date().toISOString()
      }

      // For now, we'll just log this - you can implement actual notifications table later
      console.log('Notification created:', notificationData)
    } catch (error) {
      console.error('Error creating notification:', error)
    }
  }

  const showStatusUpdateSuccess = (status: string) => {
    const statusMessages: Record<string, string> = {
      'confirmed': 'Booking confirmed successfully!',
      'in_progress': 'Service marked as in progress',
      'completed': 'Service completed successfully!',
      'cancelled': 'Booking cancelled'
    }
    
    // For now using alert, but could be replaced with toast notifications
    alert(statusMessages[status] || 'Status updated successfully')
  }

  const getAvailableStatusTransitions = (currentStatus: string): string[] => {
    const transitions: Record<string, string[]> = {
      'pending': ['confirmed', 'cancelled'],
      'confirmed': ['in_progress', 'cancelled'],
      'in_progress': ['completed', 'cancelled'],
      'completed': [],
      'cancelled': []
    }
    
    return transitions[currentStatus] || []
  }

  const filteredBookings = selectedStatus === 'all' 
    ? bookings 
    : bookings.filter(booking => booking.status === selectedStatus)

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatTime = (timeStr: string) => {
    if (!timeStr) return ''
    const [hours, minutes] = timeStr.split(':')
    const date = new Date()
    date.setHours(parseInt(hours), parseInt(minutes))
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading provider dashboard...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Provider Dashboard</h1>
            <p className="text-gray-600">Manage your bookings and track your performance</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <BanknotesIcon className="w-8 h-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Total Earnings</p>
                  <p className="text-2xl font-bold text-gray-900">₹{stats.totalEarnings.toLocaleString()}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <CheckIcon className="w-8 h-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Completed Jobs</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.completedJobs}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <StarIcon className="w-8 h-8 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Avg Rating</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.averageRating}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <ClipboardDocumentListIcon className="w-8 h-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Active Bookings</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.activeBookings}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <ChartBarIcon className="w-8 h-8 text-indigo-600" />
                <div className="ml-4">
                  <p className="text-sm text-gray-600">This Month</p>
                  <p className="text-2xl font-bold text-gray-900">₹{stats.monthlyEarnings.toLocaleString()}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <UserIcon className="w-8 h-8 text-pink-600" />
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Total Customers</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalCustomers}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="border-b border-gray-200 mb-8">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'dashboard'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                All Bookings
              </button>
              <button
                onClick={() => setActiveTab('schedule')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'schedule'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Today&apos;s Schedule
              </button>
              <button
                onClick={() => setActiveTab('earnings')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'earnings'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Earnings
              </button>
            </nav>
          </div>

          {/* Content */}
          {activeTab === 'dashboard' && (
            <div>
              {/* Filter */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">All Bookings</h2>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              {filteredBookings.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
                  <ClipboardDocumentListIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
                  <p className="text-gray-600">
                    {selectedStatus === 'all' 
                      ? 'You don\'t have any bookings yet.' 
                      : `No bookings with status "${selectedStatus}".`}
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {filteredBookings.map((booking) => (
                    <div key={booking.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold text-lg text-gray-900">{booking.service.title}</h3>
                            <span className={`inline-block px-3 py-1 text-sm font-medium rounded-full capitalize ${getStatusColor(booking.status)}`}>
                              {booking.status.replace('_', ' ')}
                            </span>
                          </div>
                          
                          <p className="text-sm text-gray-600 mb-3">{booking.service.short_description}</p>
                          <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
                            {booking.package.name} Package
                          </span>
                        </div>
                      </div>
                      
                      {/* Booking Details */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4 text-sm">
                        <div className="flex items-center">
                          <CalendarIcon className="w-4 h-4 text-gray-400 mr-2" />
                          <span>{formatDate(booking.booking_date)}</span>
                        </div>
                        <div className="flex items-center">
                          <ClockIcon className="w-4 h-4 text-gray-400 mr-2" />
                          <span>{formatTime(booking.booking_time)}</span>
                        </div>
                        <div className="flex items-center">
                          <CurrencyRupeeIcon className="w-4 h-4 text-gray-400 mr-2" />
                          <span className="font-medium">₹{booking.total_amount}</span>
                        </div>
                        <div className="flex items-center">
                          <UserIcon className="w-4 h-4 text-gray-400 mr-2" />
                          <span>{booking.customer.full_name}</span>
                        </div>
                      </div>
                      
                      {/* Customer Info */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-sm">
                        <div className="flex items-start">
                          <MapPinIcon className="w-4 h-4 text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-600">{booking.customer_address}</span>
                        </div>
                        <div className="flex items-center">
                          <PhoneIcon className="w-4 h-4 text-gray-400 mr-2" />
                          <span className="text-gray-600">{booking.customer_phone}</span>
                        </div>
                      </div>
                      
                      {/* Special Instructions */}
                      {booking.special_instructions && (
                        <div className="mb-4">
                          <p className="text-sm font-medium text-gray-700 mb-1">Special Instructions:</p>
                          <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                            {booking.special_instructions}
                          </p>
                        </div>
                      )}
                      
                      {/* Action Buttons */}
                      <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                        <div className="flex flex-col">
                          <p className="text-xs text-gray-500">
                            Booked on {formatDate(booking.created_at)}
                          </p>
                          {booking.actual_start_time && (
                            <p className="text-xs text-green-600">
                              Started: {formatDate(booking.actual_start_time)}
                            </p>
                          )}
                          {booking.actual_end_time && (
                            <p className="text-xs text-blue-600">
                              Completed: {formatDate(booking.actual_end_time)}
                            </p>
                          )}
                        </div>
                        
                        <div className="flex space-x-2">
                          <button
                            onClick={() => router.push(`/booking/confirmation/${booking.id}`)}
                            className="flex items-center text-sm text-blue-600 hover:text-blue-700 px-3 py-1 border border-blue-200 rounded-lg hover:bg-blue-50"
                          >
                            <EyeIcon className="w-4 h-4 mr-1" />
                            View
                          </button>
                          
                          {/* Dynamic Status Transition Buttons */}
                          {getAvailableStatusTransitions(booking.status).map((nextStatus) => {
                            const statusConfig: Record<string, { icon: React.ComponentType<{className?: string}>, color: string, label: string }> = {
                              'confirmed': { 
                                icon: CheckIcon, 
                                color: 'green', 
                                label: 'Confirm' 
                              },
                              'in_progress': { 
                                icon: ClockIcon, 
                                color: 'purple', 
                                label: 'Start' 
                              },
                              'completed': { 
                                icon: CheckIcon, 
                                color: 'green', 
                                label: 'Complete' 
                              },
                              'cancelled': { 
                                icon: XMarkIcon, 
                                color: 'red', 
                                label: 'Cancel' 
                              }
                            }
                            
                            const config = statusConfig[nextStatus]
                            if (!config) return null
                            
                            const IconComponent = config.icon
                            return (
                              <button
                                key={nextStatus}
                                onClick={() => {
                                  if (nextStatus === 'cancelled') {
                                    if (confirm('Are you sure you want to cancel this booking?')) {
                                      updateBookingStatus(booking.id, nextStatus)
                                    }
                                  } else {
                                    updateBookingStatus(booking.id, nextStatus)
                                  }
                                }}
                                className={`flex items-center text-sm text-${config.color}-600 hover:text-${config.color}-700 px-3 py-1 border border-${config.color}-200 rounded-lg hover:bg-${config.color}-50 transition-colors`}
                              >
                                <IconComponent className="w-4 h-4 mr-1" />
                                {config.label}
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'schedule' && (
            <div>
              <h2 className="text-xl font-semibold mb-6">Today&apos;s Schedule</h2>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <p className="text-gray-600">Today&apos;s schedule feature coming soon...</p>
              </div>
            </div>
          )}

          {activeTab === 'earnings' && (
            <div>
              <h2 className="text-xl font-semibold mb-6">Earnings Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="font-semibold mb-4">Monthly Earnings</h3>
                  <p className="text-3xl font-bold text-green-600">₹{stats.monthlyEarnings.toLocaleString()}</p>
                  <p className="text-sm text-gray-600 mt-1">Current month</p>
                </div>
                
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="font-semibold mb-4">Total Lifetime Earnings</h3>
                  <p className="text-3xl font-bold text-blue-600">₹{stats.totalEarnings.toLocaleString()}</p>
                  <p className="text-sm text-gray-600 mt-1">All time</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
}