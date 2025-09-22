'use client'

export const dynamic = 'force-dynamic'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { useUser } from '@clerk/nextjs'
import { mongodb } from '@/lib/mongodb'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import RoleProtected from '@/components/admin/RoleProtected'
import {
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  CurrencyRupeeIcon,
  StarIcon,
  EyeIcon,
  XMarkIcon,
  UserCircleIcon,
  CogIcon,
  HeartIcon,
  ChartBarIcon,
  PlusIcon,
  ChatBubbleLeftRightIcon,
  PencilIcon,
  CheckIcon,
  PhoneIcon,
  EnvelopeIcon,
  HomeIcon,
  ShoppingBagIcon
} from '@heroicons/react/24/outline'

interface Booking {
  id: string
  booking_date: string
  booking_time: string
  total_amount: number
  status: string
  created_at: string
  customer_address: string
  payment_status: string
  services?: {
    name: string
    description: string
    category: string
  }
}

interface UserProfile {
  full_name: string
  email: string
  phone: string
  address: string
  city: string
  avatar_url: string
}

interface ChatMessage {
  id: string
  message: string
  timestamp: string
  sender: 'user' | 'support'
}

interface Service {
  id: number
  name: string
  description: string
  category: string
  subcategory: string
  price: number
  duration_minutes: number
  image_url: string
}

export default function UserDashboard() {
  const router = useRouter()
  const { user: clerkUser } = useUser()
  const { user, isLoading: authLoading } = useAuth()
  
  // State management
  const [activeTab, setActiveTab] = useState('overview')
  const [bookings, setBookings] = useState<Booking[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { id: '1', message: 'Hello! How can I help you today?', timestamp: new Date().toISOString(), sender: 'support' }
  ])
  const [newMessage, setNewMessage] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [editingProfile, setEditingProfile] = useState(false)
  
  // Profile state
  const [profile, setProfile] = useState<UserProfile>({
    full_name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    avatar_url: ''
  })

  // Booking form state
  const [bookingForm, setBookingForm] = useState({
    date: '',
    time: '',
    address: '',
    instructions: ''
  })

  // Stats
  const [stats, setStats] = useState({
    totalBookings: 0,
    completedBookings: 0,
    pendingBookings: 0,
    totalSpent: 0
  })

  useEffect(() => {
    if (clerkUser && user) {
      fetchUserData()
      fetchServices()
    }
  }, [clerkUser, user])

  const fetchUserData = async () => {
    if (!user?.email) return

    try {
      setIsLoading(true)

      // Set profile from Clerk and MongoDB user data
      setProfile({
        full_name: clerkUser?.fullName || user.fullName || '',
        email: clerkUser?.emailAddresses[0]?.emailAddress || user.email || '',
        phone: clerkUser?.phoneNumbers[0]?.phoneNumber || user.phone || '',
        address: user.address || '',
        city: user.city || '',
        avatar_url: clerkUser?.imageUrl || user.avatarUrl || ''
      })

      // TODO: Implement MongoDB bookings fetch
      // Fetch bookings
      const bookingsData = [
        {
          id: '1',
          booking_date: '2024-01-15',
          booking_time: '10:00',
          status: 'completed',
          total_amount: 1500,
          customer_address: '123 Main Street',
          payment_status: 'completed',
          created_at: '2024-01-15T10:00:00Z',
          services: [{
            name: 'Home Cleaning',
            description: 'Professional cleaning service',
            category: 'Cleaning'
          }]
        }
      ]

      // Transform the data to match our interface
      const transformedBookings = bookingsData?.map(booking => ({
        ...booking,
        services: booking.services?.[0] || { name: 'Unknown Service', description: '', category: '' }
      })) || []
        
      setBookings(transformedBookings)
        
      // Calculate stats
      const totalBookings = transformedBookings.length
      const completedBookings = transformedBookings.filter(b => b.status === 'completed').length
      const pendingBookings = transformedBookings.filter(b => b.status === 'pending').length
      const totalSpent = transformedBookings.filter(b => b.payment_status === 'paid')
        .reduce((sum, b) => sum + parseFloat(b.total_amount?.toString() || '0'), 0)

      setStats({ totalBookings, completedBookings, pendingBookings, totalSpent })
    } catch (error) {
      console.error('Error in fetchUserData:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchServices = async () => {
    try {
      // TODO: Implement MongoDB services fetch
      const servicesData = [
        {
          id: 1,
          name: 'Home Cleaning',
          description: 'Professional cleaning service',
          category: 'Cleaning',
          subcategory: 'Deep Cleaning',
          price: 999,
          duration_minutes: 120,
          image_url: '/placeholder-service.jpg'
        }
      ]
      setServices(servicesData)
    } catch (error) {
      console.error('Error fetching services:', error)
    }
  }

  const handleBookService = async () => {
    if (!selectedService || !user?.email) return

    try {
      const bookingData = {
        user_id: user.email,
        service_id: selectedService.id,
        booking_date: bookingForm.date,
        booking_time: bookingForm.time,
        customer_address: bookingForm.address,
        special_instructions: bookingForm.instructions,
        total_amount: selectedService.price,
        customer_name: profile.full_name,
        customer_email: profile.email,
        customer_phone: profile.phone,
        status: 'pending',
        payment_status: 'pending'
      }

      // TODO: Implement MongoDB booking creation
      console.log('Creating booking:', bookingData)
      alert('Booking created successfully!')
      setIsBookingModalOpen(false)
      setSelectedService(null)
      setBookingForm({ date: '', time: '', address: '', instructions: '' })
      fetchUserData() // Refresh data
    } catch (error) {
      console.error('Error in handleBookService:', error)
      alert('Error creating booking. Please try again.')
    }
  }

  const sendMessage = () => {
    if (!newMessage.trim()) return

    const message: ChatMessage = {
      id: Date.now().toString(),
      message: newMessage,
      timestamp: new Date().toISOString(),
      sender: 'user'
    }

    setChatMessages(prev => [...prev, message])
    setNewMessage('')

    // Simulate support response
    setTimeout(() => {
      const supportResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        message: 'Thank you for your message. Our support team will get back to you shortly.',
        timestamp: new Date().toISOString(),
        sender: 'support'
      }
      setChatMessages(prev => [...prev, supportResponse])
    }, 1000)
  }

  const updateProfile = async () => {
    if (!user?.email) return

    try {
      // TODO: Implement MongoDB profile update
      console.log('Updating profile:', profile)
      setEditingProfile(false)
      alert('Profile updated successfully!')
    } catch (error) {
      console.error('Error in updateProfile:', error)
      alert('Error updating profile. Please try again.')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-gray-900 text-white'
      case 'confirmed': return 'bg-gray-700 text-white'
      case 'in_progress': return 'bg-gray-600 text-white'
      case 'pending': return 'bg-gray-400 text-black'
      case 'cancelled': return 'bg-gray-300 text-black'
      default: return 'bg-gray-200 text-black'
    }
  }

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <RoleProtected requiredRole="user">
      <div className="min-h-screen bg-gray-50">
        <Header />
        
        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header Section */}
          <div className="bg-white border border-gray-200 shadow-sm rounded-lg p-8 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                  {profile.avatar_url ? (
                    <img src={profile.avatar_url} alt="Profile" className="w-16 h-16 rounded-full" />
                  ) : (
                    <UserCircleIcon className="w-12 h-12 text-black" />
                  )}
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Welcome back, {profile.full_name || 'User'}!</h1>
                  <p className="text-gray-600">Manage your bookings and explore our services</p>
                </div>
              </div>
              <button
                onClick={() => setIsChatOpen(true)}
                className="bg-gray-900 text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors flex items-center space-x-2"
              >
                <ChatBubbleLeftRightIcon className="w-5 h-5" />
                <span>Support Chat</span>
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white border border-gray-200 shadow-sm p-6 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Bookings</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalBookings}</p>
                </div>
                <CalendarIcon className="w-8 h-8 text-gray-400" />
              </div>
            </div>
            <div className="bg-white border border-gray-200 shadow-sm p-6 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Completed</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.completedBookings}</p>
                </div>
                <CheckIcon className="w-8 h-8 text-gray-400" />
              </div>
            </div>
            <div className="bg-white border border-gray-200 shadow-sm p-6 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Pending</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.pendingBookings}</p>
                </div>
                <ClockIcon className="w-8 h-8 text-gray-400" />
              </div>
            </div>
            <div className="bg-white border border-gray-200 shadow-sm p-6 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Spent</p>
                  <p className="text-3xl font-bold text-gray-900">₹{stats.totalSpent.toFixed(2)}</p>
                </div>
                <CurrencyRupeeIcon className="w-8 h-8 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="border-b border-gray-200 mb-8">
            <nav className="flex space-x-8">
              {[
                { id: 'overview', label: 'Overview', icon: ChartBarIcon },
                { id: 'bookings', label: 'My Bookings', icon: CalendarIcon },
                { id: 'services', label: 'Book Service', icon: ShoppingBagIcon },
                { id: 'profile', label: 'Profile', icon: UserCircleIcon }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-black text-black'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Recent Bookings */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Bookings</h2>
                {bookings.length === 0 ? (
                  <div className="text-center py-8">
                    <CalendarIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">No bookings yet</p>
                    <button
                      onClick={() => setActiveTab('services')}
                      className="bg-gray-900 text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                    >
                      Book Your First Service
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {bookings.slice(0, 3).map((booking) => (
                      <div key={booking.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold text-black">{booking.services?.name || 'Unknown Service'}</h3>
                            <p className="text-gray-600 text-sm">{new Date(booking.booking_date).toLocaleDateString()} at {booking.booking_time}</p>
                          </div>
                          <div className="text-right">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                              {booking.status.replace('_', ' ')}
                            </span>
                            <p className="text-black font-semibold mt-1">₹{booking.total_amount}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button
                    onClick={() => setActiveTab('services')}
                    className="bg-gray-900 text-white p-4 rounded-lg hover:bg-gray-800 transition-colors flex items-center space-x-3"
                  >
                    <PlusIcon className="w-6 h-6" />
                    <span>Book New Service</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('bookings')}
                    className="bg-gray-100 text-gray-900 p-4 rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-3"
                  >
                    <EyeIcon className="w-6 h-6" />
                    <span>View All Bookings</span>
                  </button>
                  <button
                    onClick={() => setIsChatOpen(true)}
                    className="bg-gray-100 text-gray-900 p-4 rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-3"
                  >
                    <ChatBubbleLeftRightIcon className="w-6 h-6" />
                    <span>Contact Support</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'bookings' && (
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">All Bookings</h2>
              {bookings.length === 0 ? (
                <div className="text-center py-8">
                  <CalendarIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">No bookings found</p>
                  <button
                    onClick={() => setActiveTab('services')}
                    className="bg-gray-900 text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    Book a Service
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {bookings.map((booking) => (
                        <tr key={booking.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{booking.services?.name || 'Unknown Service'}</div>
                            <div className="text-sm text-gray-500">ID: {booking.id}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{new Date(booking.booking_date).toLocaleDateString()}</div>
                            <div className="text-sm text-gray-500">{booking.booking_time}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(booking.status)}`}>
                              {booking.status.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ₹{booking.total_amount}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              booking.payment_status === 'paid' ? 'bg-gray-900 text-white' : 'bg-gray-400 text-black'
                            }`}>
                              {booking.payment_status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === 'services' && (
            <div className="space-y-6">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-black mb-4">Available Services</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {services.map((service) => (
                    <div key={service.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                      <div className="w-full h-32 bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                        <ShoppingBagIcon className="w-12 h-12 text-gray-400" />
                      </div>
                      <h3 className="font-semibold text-black mb-2">{service.name}</h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{service.description}</p>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-2xl font-bold text-gray-900">₹{service.price}</p>
                          <p className="text-gray-500 text-sm">{service.duration_minutes} minutes</p>
                        </div>
                        <button
                          onClick={() => {
                            setSelectedService(service)
                            setIsBookingModalOpen(true)
                          }}
                          className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                        >
                          Book Now
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
                <button
                  onClick={() => setEditingProfile(!editingProfile)}
                  className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors flex items-center space-x-2"
                >
                  <PencilIcon className="w-4 h-4" />
                  <span>{editingProfile ? 'Cancel' : 'Edit Profile'}</span>
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={profile.full_name}
                    onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                    disabled={!editingProfile}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black disabled:bg-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={profile.email}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    disabled={!editingProfile}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black disabled:bg-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                  <input
                    type="text"
                    value={profile.address}
                    onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                    disabled={!editingProfile}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:bg-gray-100"
                  />
                </div>
              </div>
              
              {editingProfile && (
                <div className="mt-6 flex space-x-4">
                  <button
                    onClick={updateProfile}
                    className="bg-gray-900 text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors flex items-center space-x-2"
                  >
                    <CheckIcon className="w-4 h-4" />
                    <span>Save Changes</span>
                  </button>
                  <button
                    onClick={() => setEditingProfile(false)}
                    className="bg-gray-300 text-gray-900 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Booking Modal */}
        {isBookingModalOpen && selectedService && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-90vh overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-gray-900">Book {selectedService.name}</h2>
                  <button
                    onClick={() => setIsBookingModalOpen(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XMarkIcon className="w-6 h-6" />
                  </button>
                </div>
                
                <div className="mb-6">
                  <p className="text-gray-600 mb-2">{selectedService.description}</p>
                  <p className="text-2xl font-bold text-black">₹{selectedService.price}</p>
                  <p className="text-gray-500">Duration: {selectedService.duration_minutes} minutes</p>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                    <input
                      type="date"
                      value={bookingForm.date}
                      onChange={(e) => setBookingForm({ ...bookingForm, date: e.target.value })}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                    <input
                      type="time"
                      value={bookingForm.time}
                      onChange={(e) => setBookingForm({ ...bookingForm, time: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                    <textarea
                      value={bookingForm.address}
                      onChange={(e) => setBookingForm({ ...bookingForm, address: e.target.value })}
                      placeholder="Enter your complete address"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                      rows={3}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Special Instructions (Optional)</label>
                    <textarea
                      value={bookingForm.instructions}
                      onChange={(e) => setBookingForm({ ...bookingForm, instructions: e.target.value })}
                      placeholder="Any special instructions for the service provider"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                      rows={2}
                    />
                  </div>
                </div>
                
                <div className="mt-6 flex space-x-4">
                  <button
                    onClick={handleBookService}
                    disabled={!bookingForm.date || !bookingForm.time || !bookingForm.address}
                    className="flex-1 bg-gray-900 text-white py-3 rounded-lg hover:bg-gray-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    Confirm Booking - ₹{selectedService.price}
                  </button>
                  <button
                    onClick={() => setIsBookingModalOpen(false)}
                    className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Chat Modal */}
        {isChatOpen && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-lg w-full h-96 flex flex-col">
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Support Chat</h3>
                <button
                  onClick={() => setIsChatOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>
              
              <div className="flex-1 p-4 overflow-y-auto space-y-4">
                {chatMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs px-3 py-2 rounded-lg ${
                        message.sender === 'user'
                          ? 'bg-gray-900 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <p className="text-sm">{message.message}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="p-4 border-t border-gray-200">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Type your message..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                  />
                  <button
                    onClick={sendMessage}
                    className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    Send
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <Footer />
      </div>
    </RoleProtected>
  )
}