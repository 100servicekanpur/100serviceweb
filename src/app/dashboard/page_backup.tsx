'use client'

export const dynamic = 'force-dynamic'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { useUser } from '@clerk/nextjs'
import { supabase } from '@/lib/supabase'
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
  const { supabaseUser, isLoading: authLoading } = useAuth()
  
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
    if (clerkUser && supabaseUser) {
      fetchUserData()
      fetchServices()
    }
  }, [clerkUser, supabaseUser])

  const fetchUserData = async () => {
    if (!supabaseUser?.id) return

    try {
      setIsLoading(true)

      // Set profile from Clerk and Supabase data
      setProfile({
        full_name: clerkUser?.fullName || supabaseUser.full_name || '',
        email: clerkUser?.emailAddresses[0]?.emailAddress || supabaseUser.email || '',
        phone: clerkUser?.phoneNumbers[0]?.phoneNumber || supabaseUser.phone || '',
        address: '',
        city: '',
        avatar_url: clerkUser?.imageUrl || ''
      })

      // Fetch bookings
      const { data: bookingsData, error: bookingsError } = await supabase
        .from('bookings')
        .select(`
          id,
          booking_date,
          booking_time,
          status,
          total_amount,
          customer_address,
          payment_status,
          created_at,
          services (
            name,
            description,
            category
          )
        `)
        .eq('user_id', supabaseUser.id)
        .order('created_at', { ascending: false })

      if (bookingsError) {
        console.error('Error fetching bookings:', bookingsError)
      } else {
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
      }
    } catch (error) {
      console.error('Error in fetchUserData:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchServices = async () => {
    try {
      const { data: servicesData, error } = await supabase
        .from('services')
        .select('*')
        .eq('is_active', true)
        .order('name')

      if (error) {
        console.error('Error fetching services:', error)
      } else {
        setServices(servicesData || [])
      }
    } catch (error) {
      console.error('Error fetching services:', error)
    }
  }

  const handleBookService = async () => {
    if (!selectedService || !supabaseUser?.id) return

    try {
      const bookingData = {
        user_id: supabaseUser.id,
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

      const { error } = await supabase
        .from('bookings')
        .insert([bookingData])

      if (error) {
        console.error('Error creating booking:', error)
        alert('Error creating booking. Please try again.')
      } else {
        alert('Booking created successfully!')
        setIsBookingModalOpen(false)
        setSelectedService(null)
        setBookingForm({ date: '', time: '', address: '', instructions: '' })
        fetchUserData() // Refresh data
      }
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
    if (!supabaseUser?.id) return

    try {
      // Update in Supabase
      const { error } = await supabase
        .from('users')
        .update({
          full_name: profile.full_name,
          phone: profile.phone
        })
        .eq('id', supabaseUser.id)

      if (error) {
        console.error('Error updating profile:', error)
        alert('Error updating profile. Please try again.')
      } else {
        setEditingProfile(false)
        alert('Profile updated successfully!')
      }
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
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
      </div>
    )
  }

  return (
    <RoleProtected requiredRole="user">
      <div className="min-h-screen bg-black text-white">
        <Header />
        
        <main className="container mx-auto px-4 py-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Welcome back, {profile.full_name || 'User'}!</h1>
            <p className="text-gray-400">Manage your bookings and profile from your dashboard</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-gray-900 border border-gray-700 p-6 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium">Total Bookings</p>
                  <p className="text-2xl font-bold text-white">{stats.totalBookings}</p>
                </div>
                <ChartBarIcon className="h-8 w-8 text-gray-400" />
              </div>
            </div>
            
            <div className="bg-gray-900 border border-gray-700 p-6 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium">Completed</p>
                  <p className="text-2xl font-bold text-white">{stats.completedBookings}</p>
                </div>
                <CheckIcon className="h-8 w-8 text-gray-400" />
              </div>
            </div>
            
            <div className="bg-gray-900 border border-gray-700 p-6 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium">Pending</p>
                  <p className="text-2xl font-bold text-white">{stats.pendingBookings}</p>
                </div>
                <ClockIcon className="h-8 w-8 text-gray-400" />
              </div>
            </div>
            
            <div className="bg-gray-900 border border-gray-700 p-6 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium">Total Spent</p>
                  <p className="text-2xl font-bold text-white">₹{stats.totalSpent.toLocaleString()}</p>
                </div>
                <CurrencyRupeeIcon className="h-8 w-8 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="border-b border-gray-700 mb-8">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'overview', name: 'Overview', icon: HomeIcon },
                { id: 'bookings', name: 'My Bookings', icon: CalendarIcon },
                { id: 'services', name: 'Book Service', icon: ShoppingBagIcon },
                { id: 'profile', name: 'Profile', icon: UserCircleIcon }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-white text-white'
                      : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="h-5 w-5 mr-2" />
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Bookings */}
                <div className="bg-gray-900 border border-gray-700 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <CalendarIcon className="h-5 w-5 mr-2" />
                    Recent Bookings
                  </h3>
                  <div className="space-y-3">
                    {bookings.slice(0, 3).map((booking) => (
                      <div key={booking.id} className="flex items-center justify-between p-3 bg-gray-800 rounded">
                        <div>
                          <p className="text-white font-medium">{booking.services?.name || 'Service'}</p>
                          <p className="text-gray-400 text-sm">{new Date(booking.booking_date).toLocaleDateString()}</p>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(booking.status)}`}>
                          {booking.status}
                        </span>
                      </div>
                    ))}
                    {bookings.length === 0 && (
                      <p className="text-gray-400 text-center py-4">No bookings yet</p>
                    )}
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-gray-900 border border-gray-700 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <button
                      onClick={() => setActiveTab('services')}
                      className="w-full flex items-center p-3 bg-gray-800 hover:bg-gray-700 rounded transition-colors"
                    >
                      <PlusIcon className="h-5 w-5 mr-3" />
                      Book a New Service
                    </button>
                    <button
                      onClick={() => setActiveTab('bookings')}
                      className="w-full flex items-center p-3 bg-gray-800 hover:bg-gray-700 rounded transition-colors"
                    >
                      <CalendarIcon className="h-5 w-5 mr-3" />
                      View All Bookings
                    </button>
                    <button
                      onClick={() => setIsChatOpen(true)}
                      className="w-full flex items-center p-3 bg-gray-800 hover:bg-gray-700 rounded transition-colors"
                    >
                      <ChatBubbleLeftRightIcon className="h-5 w-5 mr-3" />
                      Contact Support
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'bookings' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">My Bookings</h2>
                <button
                  onClick={() => setActiveTab('services')}
                  className="bg-white text-black px-4 py-2 rounded hover:bg-gray-200 transition-colors flex items-center"
                >
                  <PlusIcon className="h-4 w-4 mr-2" />
                  New Booking
                </button>
              </div>

              <div className="grid gap-6">
                {bookings.map((booking) => (
                  <div key={booking.id} className="bg-gray-900 border border-gray-700 p-6 rounded-lg">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-white">{booking.services?.name || 'Service'}</h3>
                        <p className="text-gray-400">{booking.services?.description || 'No description'}</p>
                      </div>
                      <span className={`px-3 py-1 rounded text-sm font-medium ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center text-gray-300">
                        <CalendarIcon className="h-4 w-4 mr-2" />
                        {new Date(booking.booking_date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center text-gray-300">
                        <ClockIcon className="h-4 w-4 mr-2" />
                        {booking.booking_time}
                      </div>
                      <div className="flex items-center text-gray-300">
                        <CurrencyRupeeIcon className="h-4 w-4 mr-2" />
                        ₹{booking.total_amount?.toLocaleString()}
                      </div>
                    </div>
                    
                    {booking.customer_address && (
                      <div className="mt-4 flex items-center text-gray-300 text-sm">
                        <MapPinIcon className="h-4 w-4 mr-2" />
                        {booking.customer_address}
                      </div>
                    )}
                  </div>
                ))}
                
                {bookings.length === 0 && (
                  <div className="text-center py-12">
                    <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-300 mb-2">No bookings yet</h3>
                    <p className="text-gray-400 mb-4">Start by booking your first service</p>
                    <button
                      onClick={() => setActiveTab('services')}
                      className="bg-white text-black px-6 py-3 rounded hover:bg-gray-200 transition-colors"
                    >
                      Browse Services
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'services' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Book a Service</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((service) => (
                  <div key={service.id} className="bg-gray-900 border border-gray-700 rounded-lg overflow-hidden">
                    {service.image_url && (
                      <img 
                        src={service.image_url} 
                        alt={service.name}
                        className="w-full h-48 object-cover"
                      />
                    )}
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-semibold text-white">{service.name}</h3>
                        <span className="text-sm bg-gray-700 text-gray-300 px-2 py-1 rounded">
                          {service.category}
                        </span>
                      </div>
                      
                      <p className="text-gray-400 text-sm mb-4">{service.description}</p>
                      
                      <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center text-gray-300">
                          <CurrencyRupeeIcon className="h-4 w-4 mr-1" />
                          <span className="font-semibold">₹{service.price}</span>
                        </div>
                        <div className="flex items-center text-gray-300">
                          <ClockIcon className="h-4 w-4 mr-1" />
                          <span className="text-sm">{service.duration_minutes} min</span>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => {
                          setSelectedService(service)
                          setIsBookingModalOpen(true)
                        }}
                        className="w-full bg-white text-black py-2 px-4 rounded hover:bg-gray-200 transition-colors"
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              {services.length === 0 && (
                <div className="text-center py-12">
                  <ShoppingBagIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-300 mb-2">No services available</h3>
                  <p className="text-gray-400">Please check back later</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="max-w-2xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">My Profile</h2>
                <button
                  onClick={() => setEditingProfile(!editingProfile)}
                  className="bg-white text-black px-4 py-2 rounded hover:bg-gray-200 transition-colors flex items-center"
                >
                  <PencilIcon className="h-4 w-4 mr-2" />
                  {editingProfile ? 'Cancel' : 'Edit Profile'}
                </button>
              </div>

              <div className="bg-gray-900 border border-gray-700 p-6 rounded-lg">
                <div className="flex items-center mb-6">
                  {profile.avatar_url ? (
                    <img
                      src={profile.avatar_url}
                      alt="Profile"
                      className="h-20 w-20 rounded-full mr-4"
                    />
                  ) : (
                    <div className="h-20 w-20 bg-gray-700 rounded-full flex items-center justify-center mr-4">
                      <UserCircleIcon className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                  <div>
                    <h3 className="text-xl font-semibold text-white">{profile.full_name}</h3>
                    <p className="text-gray-400">{profile.email}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
                    {editingProfile ? (
                      <input
                        type="text"
                        value={profile.full_name}
                        onChange={(e) => setProfile(prev => ({ ...prev, full_name: e.target.value }))}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white focus:outline-none focus:border-gray-400"
                      />
                    ) : (
                      <p className="text-white">{profile.full_name || 'Not provided'}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                    <p className="text-gray-400 text-sm">Email is managed by your account settings</p>
                    <p className="text-white">{profile.email}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Phone</label>
                    {editingProfile ? (
                      <input
                        type="tel"
                        value={profile.phone}
                        onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white focus:outline-none focus:border-gray-400"
                      />
                    ) : (
                      <p className="text-white">{profile.phone || 'Not provided'}</p>
                    )}
                  </div>

                  {editingProfile && (
                    <div className="flex space-x-4 pt-4">
                      <button
                        onClick={updateProfile}
                        className="bg-white text-black px-4 py-2 rounded hover:bg-gray-200 transition-colors flex items-center"
                      >
                        <CheckIcon className="h-4 w-4 mr-2" />
                        Save Changes
                      </button>
                      <button
                        onClick={() => setEditingProfile(false)}
                        className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </main>

        {/* Booking Modal */}
        {isBookingModalOpen && selectedService && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-900 border border-gray-700 rounded-lg max-w-md w-full p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-white">Book {selectedService.name}</h3>
                <button
                  onClick={() => setIsBookingModalOpen(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Date</label>
                  <input
                    type="date"
                    value={bookingForm.date}
                    onChange={(e) => setBookingForm(prev => ({ ...prev, date: e.target.value }))}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white focus:outline-none focus:border-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Time</label>
                  <select
                    value={bookingForm.time}
                    onChange={(e) => setBookingForm(prev => ({ ...prev, time: e.target.value }))}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white focus:outline-none focus:border-gray-400"
                  >
                    <option value="">Select time</option>
                    <option value="09:00">9:00 AM</option>
                    <option value="10:00">10:00 AM</option>
                    <option value="11:00">11:00 AM</option>
                    <option value="12:00">12:00 PM</option>
                    <option value="13:00">1:00 PM</option>
                    <option value="14:00">2:00 PM</option>
                    <option value="15:00">3:00 PM</option>
                    <option value="16:00">4:00 PM</option>
                    <option value="17:00">5:00 PM</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Address</label>
                  <textarea
                    value={bookingForm.address}
                    onChange={(e) => setBookingForm(prev => ({ ...prev, address: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white focus:outline-none focus:border-gray-400"
                    placeholder="Enter your complete address"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Special Instructions</label>
                  <textarea
                    value={bookingForm.instructions}
                    onChange={(e) => setBookingForm(prev => ({ ...prev, instructions: e.target.value }))}
                    rows={2}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white focus:outline-none focus:border-gray-400"
                    placeholder="Any special instructions..."
                  />
                </div>

                <div className="border-t border-gray-700 pt-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-gray-300">Total Amount:</span>
                    <span className="text-xl font-semibold text-white">₹{selectedService.price}</span>
                  </div>

                  <div className="flex space-x-4">
                    <button
                      onClick={handleBookService}
                      disabled={!bookingForm.date || !bookingForm.time || !bookingForm.address}
                      className="flex-1 bg-white text-black py-2 px-4 rounded hover:bg-gray-200 transition-colors disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed"
                    >
                      Confirm Booking
                    </button>
                    <button
                      onClick={() => setIsBookingModalOpen(false)}
                      className="flex-1 bg-gray-700 text-white py-2 px-4 rounded hover:bg-gray-600 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Chat Widget */}
        {isChatOpen && (
          <div className="fixed bottom-4 right-4 w-80 h-96 bg-gray-900 border border-gray-700 rounded-lg shadow-lg z-50">
            <div className="flex justify-between items-center p-4 border-b border-gray-700">
              <h3 className="text-white font-semibold">Support Chat</h3>
              <button
                onClick={() => setIsChatOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            <div className="h-64 overflow-y-auto p-4 space-y-3">
              {chatMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs p-3 rounded-lg text-sm ${
                      message.sender === 'user'
                        ? 'bg-white text-black'
                        : 'bg-gray-800 text-white'
                    }`}
                  >
                    {message.message}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-gray-700">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Type your message..."
                  className="flex-1 px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white text-sm focus:outline-none focus:border-gray-400"
                />
                <button
                  onClick={sendMessage}
                  className="bg-white text-black px-3 py-2 rounded hover:bg-gray-200 transition-colors"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Floating Chat Button */}
        {!isChatOpen && (
          <button
            onClick={() => setIsChatOpen(true)}
            className="fixed bottom-4 right-4 bg-white text-black p-3 rounded-full shadow-lg hover:bg-gray-200 transition-colors z-40"
          >
            <ChatBubbleLeftRightIcon className="h-6 w-6" />
          </button>
        )}

        <Footer />
      </div>
    </RoleProtected>
  )
}