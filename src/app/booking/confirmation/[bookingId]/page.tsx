'use client'

export const dynamic = 'force-dynamic'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { mongodb } from '@/lib/mongodb'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import {
  CheckCircleIcon,
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  PhoneIcon,
  UserIcon,
  CurrencyRupeeIcon,
  PrinterIcon,
  ShareIcon
} from '@heroicons/react/24/outline'

interface BookingDetails {
  id: string
  booking_date: string
  booking_time: string
  total_amount: number
  customer_address: string
  customer_phone: string
  special_instructions: string
  status: string
  created_at: string
  service: {
    title: string
    short_description: string
    images: string[]
  }
  package: {
    name: string
    description: string
    features: string[]
  }
  customer: {
    full_name: string
    email: string
  }
}

export default function BookingConfirmation() {
  const params = useParams()
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const bookingId = params.bookingId as string

  const [booking, setBooking] = useState<BookingDetails | null>(null)
  const [loading, setLoading] = useState(true)

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated && !loading) {
      router.push('/login')
    }
  }, [isAuthenticated, loading, router])

  // Fetch booking details
  useEffect(() => {
    if (bookingId && user) {
      fetchBookingDetails()
    }
  }, [bookingId, user])

  const fetchBookingDetails = async () => {
    try {
      setLoading(true)

      // TODO: Implement MongoDB booking fetch
      const bookingData = {
        id: bookingId,
        service: {
          title: 'Sample Service',
          short_description: 'Service description',
          images: ['/placeholder-service.jpg']
        },
        package: {
          name: 'Basic Package',
          description: 'Package description',
          features: ['Feature 1', 'Feature 2']
        },
        customer: {
          full_name: user?.fullName || 'Customer Name',
          email: user?.email || 'customer@example.com'
        },
        booking_date: '2024-01-15',
        booking_time: '10:00',
        total_amount: 999,
        status: 'pending',
        customer_address: '123 Main Street',
        customer_phone: '+91-1234567890',
        special_instructions: 'Sample instructions',
        created_at: new Date().toISOString()
      }

      setBooking(bookingData)
    } catch (error) {
      console.error('Error fetching booking:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatTime = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(':')
    const date = new Date()
    date.setHours(parseInt(hours), parseInt(minutes))
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  const handlePrint = () => {
    window.print()
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Booking Confirmation - 100Service',
          text: `My booking for ${booking?.service.title} is confirmed!`,
          url: window.location.href,
        })
      } catch (error) {
        console.log('Error sharing:', error)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      alert('Booking link copied to clipboard!')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading booking details...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="text-center py-20">
          <h1 className="text-2xl font-bold text-gray-900">Booking not found</h1>
          <p className="text-gray-600 mt-2">The booking you&apos;re looking for doesn&apos;t exist or you don&apos;t have access to it.</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Go to Dashboard
          </button>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          
          {/* Success Message */}
          <div className="text-center mb-8">
            <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Confirmed!</h1>
            <p className="text-gray-600">Your service has been successfully booked. Here are your booking details:</p>
          </div>

          {/* Booking Details Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            
            {/* Header */}
            <div className="bg-green-50 border-b border-green-100 px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Booking #{booking.id.slice(-8).toUpperCase()}</h2>
                  <p className="text-sm text-gray-600">
                    Booked on {new Date(booking.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={handlePrint}
                    className="p-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50"
                    title="Print"
                  >
                    <PrinterIcon className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleShare}
                    className="p-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50"
                    title="Share"
                  >
                    <ShareIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Service Details */}
            <div className="px-6 py-4 border-b border-gray-100">
              <div className="flex items-start space-x-4">
                {booking.service.images && booking.service.images.length > 0 && (
                  <img
                    src={booking.service.images[0]}
                    alt={booking.service.title}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                )}
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{booking.service.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{booking.service.short_description}</p>
                  <div className="mt-2">
                    <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                      {booking.package.name} Package
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Booking Information */}
            <div className="px-6 py-4 space-y-4">
              
              {/* Date & Time */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <CalendarIcon className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Date</p>
                    <p className="font-medium">{formatDate(booking.booking_date)}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <ClockIcon className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Time</p>
                    <p className="font-medium">{formatTime(booking.booking_time)}</p>
                  </div>
                </div>
              </div>

              {/* Address */}
              <div className="flex items-start">
                <MapPinIcon className="w-5 h-5 text-gray-400 mr-3 mt-1" />
                <div>
                  <p className="text-sm text-gray-500">Service Address</p>
                  <p className="font-medium">{booking.customer_address}</p>
                </div>
              </div>

              {/* Contact */}
              <div className="flex items-center">
                <PhoneIcon className="w-5 h-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Contact Phone</p>
                  <p className="font-medium">{booking.customer_phone}</p>
                </div>
              </div>

              {/* Customer */}
              <div className="flex items-center">
                <UserIcon className="w-5 h-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Customer</p>
                  <p className="font-medium">{booking.customer.full_name}</p>
                  <p className="text-sm text-gray-500">{booking.customer.email}</p>
                </div>
              </div>

              {/* Special Instructions */}
              {booking.special_instructions && (
                <div>
                  <p className="text-sm text-gray-500 mb-1">Special Instructions</p>
                  <p className="font-medium text-sm bg-gray-50 p-3 rounded-lg">
                    {booking.special_instructions}
                  </p>
                </div>
              )}

              {/* Package Features */}
              {booking.package.features && booking.package.features.length > 0 && (
                <div>
                  <p className="text-sm text-gray-500 mb-2">Package Includes</p>
                  <ul className="space-y-1">
                    {booking.package.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircleIcon className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Total Amount */}
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <CurrencyRupeeIcon className="w-5 h-5 text-gray-400 mr-2" />
                  <span className="text-lg font-medium text-gray-900">Total Amount</span>
                </div>
                <span className="text-2xl font-bold text-green-600">₹{booking.total_amount}</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Payment will be collected after service completion</p>
            </div>
          </div>

          {/* Status */}
          <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Booking Status</h3>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                  <ClockIcon className="w-5 h-5 text-yellow-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="font-medium text-gray-900 capitalize">{booking.status}</p>
                <p className="text-sm text-gray-600">
                  Your booking is being processed. You&apos;ll receive a confirmation call within 30 minutes.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => router.push('/dashboard')}
              className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            >
              View All Bookings
            </button>
            <button
              onClick={() => router.push('/services')}
              className="flex-1 border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
            >
              Book Another Service
            </button>
          </div>

          {/* Contact Info */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Need help? Contact us at{' '}
              <a href="tel:+911800100SERVICE" className="text-blue-600 hover:underline">
                1800-100-SERVICE
              </a>
              {' '}or{' '}
              <a href="mailto:support@100service.com" className="text-blue-600 hover:underline">
                support@100service.com
              </a>
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}