'use client'

export const dynamic = 'force-dynamic'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import {
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  PhoneIcon,
  CreditCardIcon,
  CheckIcon,
  StarIcon,
  TagIcon,
  XMarkIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'

interface Service {
  id: string
  title: string
  description: string
  short_description: string
  base_price: number
  price_unit: string
  duration_minutes: number
  images: string[]
  features: string[]
  requirements: string[]
  rating_average: number
  rating_count: number
  category: {
    name: string
  }
}

interface ServicePackage {
  id: string
  name: string
  description: string
  price: number
  features: string[]
  is_popular: boolean
}

interface BookingForm {
  selectedPackage: string
  bookingDate: string
  bookingTime: string
  customerAddress: string
  customerPhone: string
  specialInstructions: string
}

export default function BookService() {
  const params = useParams()
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const serviceId = params.serviceId as string

  const [service, setService] = useState<Service | null>(null)
  const [packages, setPackages] = useState<ServicePackage[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState<Partial<BookingForm & {general: string}>>({})
  const [formData, setFormData] = useState<BookingForm>({
    selectedPackage: '',
    bookingDate: '',
    bookingTime: '',
    customerAddress: '',
    customerPhone: '',
    specialInstructions: ''
  })

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated && !loading) {
      router.push('/login')
    }
  }, [isAuthenticated, loading, router])

  // Fetch service details
  useEffect(() => {
    if (serviceId) {
      fetchServiceDetails()
    }
  }, [serviceId])

  const fetchServiceDetails = async () => {
    try {
      setLoading(true)

      // Fetch service with category
      const { data: serviceData, error: serviceError } = await supabase
        .from('services')
        .select(`
          *,
          category:categories(name)
        `)
        .eq('id', serviceId)
        .eq('status', 'active')
        .single()

      if (serviceError) throw serviceError

      // Fetch service packages
      const { data: packagesData, error: packagesError } = await supabase
        .from('service_packages')
        .select('*')
        .eq('service_id', serviceId)
        .order('sort_order', { ascending: true })

      if (packagesError) throw packagesError

      setService(serviceData)
      setPackages(packagesData || [])

      // Auto-select first package if available
      if (packagesData && packagesData.length > 0) {
        setFormData(prev => ({
          ...prev,
          selectedPackage: packagesData[0].id
        }))
      }
    } catch (error) {
      console.error('Error fetching service:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: keyof BookingForm, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }))
    }
  }

  // Comprehensive validation functions
  const validateForm = (): boolean => {
    const newErrors: Partial<BookingForm & {general: string}> = {}

    // Package validation
    if (!formData.selectedPackage) {
      newErrors.selectedPackage = 'Please select a service package'
    }

    // Date validation
    if (!formData.bookingDate) {
      newErrors.bookingDate = 'Please select a booking date'
    } else {
      const selectedDate = new Date(formData.bookingDate)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      
      if (selectedDate < today) {
        newErrors.bookingDate = 'Booking date cannot be in the past'
      }
      
      // Check if date is too far in future (optional business rule)
      const maxDate = new Date()
      maxDate.setDate(maxDate.getDate() + 90) // 90 days from now
      if (selectedDate > maxDate) {
        newErrors.bookingDate = 'Booking date cannot be more than 90 days in advance'
      }
    }

    // Time validation
    if (!formData.bookingTime) {
      newErrors.bookingTime = 'Please select a booking time'
    } else {
      const [hours, minutes] = formData.bookingTime.split(':').map(Number)
      if (hours < 9 || hours >= 18) {
        newErrors.bookingTime = 'Please select a time between 9:00 AM and 6:00 PM'
      }
    }

    // Phone validation
    if (!formData.customerPhone) {
      newErrors.customerPhone = 'Phone number is required'
    } else {
      const phoneRegex = /^[6-9]\d{9}$/
      if (!phoneRegex.test(formData.customerPhone.replace(/\D/g, ''))) {
        newErrors.customerPhone = 'Please enter a valid 10-digit Indian phone number'
      }
    }

    // Address validation
    if (!formData.customerAddress) {
      newErrors.customerAddress = 'Service address is required'
    } else if (formData.customerAddress.length < 10) {
      newErrors.customerAddress = 'Please provide a complete address (minimum 10 characters)'
    }

    // Special instructions validation (optional but with length check)
    if (formData.specialInstructions && formData.specialInstructions.length > 500) {
      newErrors.specialInstructions = 'Special instructions must be less than 500 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateDateTimeAvailability = async (date: string, time: string): Promise<boolean> => {
    try {
      // Check if the selected time slot is already booked
      const { data: existingBookings, error } = await supabase
        .from('bookings')
        .select('id')
        .eq('service_id', serviceId)
        .eq('booking_date', date)
        .eq('booking_time', time)
        .neq('status', 'cancelled')

      if (error) throw error

      if (existingBookings && existingBookings.length > 0) {
        setErrors(prev => ({
          ...prev,
          bookingTime: 'This time slot is already booked. Please select a different time.'
        }))
        return false
      }

      return true
    } catch (error) {
      console.error('Error checking availability:', error)
      setErrors(prev => ({
        ...prev,
        general: 'Unable to check time slot availability. Please try again.'
      }))
      return false
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Clear previous errors
    setErrors({})
    
    if (!user || !isAuthenticated) {
      router.push('/login')
      return
    }

    if (!service) {
      setErrors({ general: 'Service information not available. Please refresh the page.' })
      return
    }

    // Validate form
    if (!validateForm()) {
      return
    }

    // Check availability for the selected time slot
    const isAvailable = await validateDateTimeAvailability(formData.bookingDate, formData.bookingTime)
    if (!isAvailable) {
      return
    }

    try {
      setSubmitting(true)

      const selectedPackage = packages.find(p => p.id === formData.selectedPackage)
      if (!selectedPackage) {
        setErrors({ general: 'Selected package is no longer available. Please choose another package.' })
        return
      }

      // Create booking with updated field names to match database schema
      const { data: booking, error } = await supabase
        .from('bookings')
        .insert({
          user_id: user.id, // Updated to match schema
          service_id: serviceId,
          package_id: formData.selectedPackage,
          booking_date: formData.bookingDate,
          booking_time: formData.bookingTime,
          total_amount: selectedPackage.price,
          customer_address: formData.customerAddress,
          customer_phone: formData.customerPhone,
          special_instructions: formData.specialInstructions || null,
          estimated_duration: service.duration_minutes,
          status: 'pending',
          payment_status: 'pending'
        })
        .select()
        .single()

      if (error) {
        console.error('Booking creation error:', error)
        
        // Handle specific database errors
        if (error.code === '23505') { // Unique constraint violation
          setErrors({ general: 'This time slot was just booked by another customer. Please select a different time.' })
        } else if (error.code === '23503') { // Foreign key constraint
          setErrors({ general: 'Invalid service or package selection. Please refresh and try again.' })
        } else {
          setErrors({ general: 'Failed to create booking. Please check your information and try again.' })
        }
        return
      }

      // Success - redirect to confirmation page
      router.push(`/booking/confirmation/${booking.id}`)

    } catch (error) {
      console.error('Error creating booking:', error)
      setErrors({ 
        general: 'An unexpected error occurred. Please try again or contact support if the problem persists.' 
      })
    } finally {
      setSubmitting(false)
    }
  }

  // Generate time slots
  const generateTimeSlots = () => {
    const slots = []
    for (let hour = 9; hour <= 18; hour++) {
      for (let min = 0; min < 60; min += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`
        slots.push(time)
      }
    }
    return slots
  }

  const timeSlots = generateTimeSlots()

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading service details...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="text-center py-20">
          <h1 className="text-2xl font-bold text-gray-900">Service not found</h1>
          <p className="text-gray-600 mt-2">The service you&apos;re looking for doesn&apos;t exist or is no longer available.</p>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Book Service</h1>
            <p className="text-gray-600">Complete your booking for {service.title}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Service Details */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-4">
                {service.images && service.images.length > 0 && (
                  <img
                    src={service.images[0]}
                    alt={service.title}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                )}
                
                <h3 className="font-semibold text-lg text-gray-900 mb-2">{service.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{service.short_description}</p>
                
                <div className="flex items-center mb-4">
                  <StarIcon className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="ml-1 text-sm font-medium">{service.rating_average}</span>
                  <span className="ml-1 text-sm text-gray-500">({service.rating_count} reviews)</span>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center">
                    <ClockIcon className="w-4 h-4 text-gray-400 mr-2" />
                    <span>Duration: {service.duration_minutes} minutes</span>
                  </div>
                  <div className="flex items-center">
                    <TagIcon className="w-4 h-4 text-gray-400 mr-2" />
                    <span>Category: {service.category?.name}</span>
                  </div>
                </div>

                {service.features && service.features.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-medium text-gray-900 mb-2">Included:</h4>
                    <ul className="space-y-1">
                      {service.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <CheckIcon className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-600">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Booking Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* General Error Display */}
                {errors.general && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <XMarkIcon className="h-5 w-5 text-red-400" />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800">
                          Booking Error
                        </h3>
                        <div className="mt-2 text-sm text-red-700">
                          {errors.general}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Package Selection */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold mb-4">Select Package</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {packages.map((pkg) => (
                      <div
                        key={pkg.id}
                        className={`relative border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                          formData.selectedPackage === pkg.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => handleInputChange('selectedPackage', pkg.id)}
                      >
                        {pkg.is_popular && (
                          <span className="absolute -top-2 left-4 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                            Popular
                          </span>
                        )}
                        
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900 capitalize">{pkg.name}</h4>
                          <input
                            type="radio"
                            name="package"
                            value={pkg.id}
                            checked={formData.selectedPackage === pkg.id}
                            onChange={(e) => handleInputChange('selectedPackage', e.target.value)}
                            className="text-blue-600"
                          />
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-3">{pkg.description}</p>
                        <p className="font-bold text-lg text-blue-600">₹{pkg.price}</p>
                        
                        {pkg.features && pkg.features.length > 0 && (
                          <ul className="mt-3 space-y-1">
                            {pkg.features.map((feature, index) => (
                              <li key={index} className="flex items-start">
                                <CheckIcon className="w-3 h-3 text-green-500 mr-1 mt-1 flex-shrink-0" />
                                <span className="text-xs text-gray-600">{feature}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  {/* Package Selection Error */}
                  {errors.selectedPackage && (
                    <div className="mt-3 flex items-center text-red-600">
                      <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                      <span className="text-sm">{errors.selectedPackage}</span>
                    </div>
                  )}
                </div>

                {/* Date & Time Selection */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold mb-4">Select Date & Time</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <CalendarIcon className="w-4 h-4 inline mr-1" />
                        Date
                      </label>
                      <input
                        type="date"
                        required
                        min={new Date().toISOString().split('T')[0]}
                        value={formData.bookingDate}
                        onChange={(e) => handleInputChange('bookingDate', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.bookingDate ? 'border-red-500' : 'border-gray-200'
                        }`}
                      />
                      {errors.bookingDate && (
                        <div className="mt-1 flex items-center text-red-600">
                          <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                          <span className="text-sm">{errors.bookingDate}</span>
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <ClockIcon className="w-4 h-4 inline mr-1" />
                        Time
                      </label>
                      <select
                        required
                        value={formData.bookingTime}
                        onChange={(e) => handleInputChange('bookingTime', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.bookingTime ? 'border-red-500' : 'border-gray-200'
                        }`}
                      >
                        <option value="">Select time</option>
                        {timeSlots.map((time) => (
                          <option key={time} value={time}>{time}</option>
                        ))}
                      </select>
                      {errors.bookingTime && (
                        <div className="mt-1 flex items-center text-red-600">
                          <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                          <span className="text-sm">{errors.bookingTime}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <MapPinIcon className="w-4 h-4 inline mr-1" />
                        Service Address
                      </label>
                      <textarea
                        required
                        rows={3}
                        value={formData.customerAddress}
                        onChange={(e) => handleInputChange('customerAddress', e.target.value)}
                        placeholder="Enter complete address where service is needed"
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.customerAddress ? 'border-red-500' : 'border-gray-200'
                        }`}
                      />
                      {errors.customerAddress && (
                        <div className="mt-1 flex items-center text-red-600">
                          <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                          <span className="text-sm">{errors.customerAddress}</span>
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <PhoneIcon className="w-4 h-4 inline mr-1" />
                        Contact Phone
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.customerPhone}
                        onChange={(e) => handleInputChange('customerPhone', e.target.value)}
                        placeholder="Your contact number (10 digits)"
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.customerPhone ? 'border-red-500' : 'border-gray-200'
                        }`}
                      />
                      {errors.customerPhone && (
                        <div className="mt-1 flex items-center text-red-600">
                          <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                          <span className="text-sm">{errors.customerPhone}</span>
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Special Instructions (Optional)
                      </label>
                      <textarea
                        rows={3}
                        value={formData.specialInstructions}
                        onChange={(e) => handleInputChange('specialInstructions', e.target.value)}
                        placeholder="Any specific requirements or instructions (max 500 characters)"
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.specialInstructions ? 'border-red-500' : 'border-gray-200'
                        }`}
                      />
                      {errors.specialInstructions && (
                        <div className="mt-1 flex items-center text-red-600">
                          <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                          <span className="text-sm">{errors.specialInstructions}</span>
                        </div>
                      )}
                      <div className="mt-1 text-right text-xs text-gray-500">
                        {formData.specialInstructions.length}/500 characters
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-lg font-semibold">Total Amount:</span>
                    <span className="text-2xl font-bold text-blue-600">
                      ₹{packages.find(p => p.id === formData.selectedPackage)?.price || 0}
                    </span>
                  </div>
                  
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {submitting ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Creating Booking...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <CreditCardIcon className="w-5 h-5 mr-2" />
                        Book Now & Pay
                      </div>
                    )}
                  </button>
                  
                  <p className="text-xs text-gray-500 text-center mt-2">
                    Payment will be processed securely
                  </p>
                </div>

              </form>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}