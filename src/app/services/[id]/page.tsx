'use client'

import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import {
  StarIcon as StarOutlineIcon,
  HeartIcon,
  ArrowLeftIcon,
  CheckIcon,
  ClockIcon,
  MapPinIcon,
  PhoneIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  UserIcon,
  ChatBubbleLeftRightIcon,
  CheckBadgeIcon,
  FireIcon,
  ShieldCheckIcon,
  TruckIcon
} from '@heroicons/react/24/outline'
import { StarIcon, HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'

interface Service {
  id: number
  name: string
  description: string
  image: string
  rating: number
  reviewCount: number
  startingPrice: number
  category: string
  provider: string
  availability: string
  responseTime: string
  badges: string[]
  features: string[]
  detailedDescription: string
  gallery: string[]
  providerInfo: {
    name: string
    rating: number
    totalJobs: number
    joinedDate: string
    verified: boolean
    responseRate: string
    avatar: string
    description: string
  }
  pricing: {
    basic: { price: number; description: string; features: string[] }
    standard: { price: number; description: string; features: string[] }
    premium: { price: number; description: string; features: string[] }
  }
  faqs: { question: string; answer: string }[]
  reviews: {
    id: number
    user: string
    rating: number
    comment: string
    date: string
    avatar: string
  }[]
}

export default function ServiceDetailPage() {
  const params = useParams()
  const serviceId = params.id as string
  const [service, setService] = useState<Service | null>(null)
  const [selectedPackage, setSelectedPackage] = useState('standard')
  const [isFavorite, setIsFavorite] = useState(false)
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')

  // Mock service data - in real app this would come from Supabase
  useEffect(() => {
    const mockService: Service = {
      id: parseInt(serviceId),
      name: "Professional Electrical Repair & Installation",
      description: "Expert electrical services for homes and businesses with 24/7 emergency support",
      image: "/api/placeholder/600/400",
      rating: 4.8,
      reviewCount: 1250,
      startingPrice: 299,
      category: "electrical",
      provider: "PowerTech Solutions",
      availability: "24/7",
      responseTime: "Within 2 hours",
      badges: ["Verified", "Most Popular", "Emergency Available"],
      features: ["Free Inspection", "1 Year Warranty", "Licensed Electricians", "Emergency Service"],
      detailedDescription: "Our professional electrical services cover everything from simple repairs to complete electrical installations. With over 10 years of experience, our licensed electricians ensure your home's electrical system is safe, efficient, and up to code. We use only high-quality materials and provide comprehensive warranties on all our work.",
      gallery: [
        "/api/placeholder/400/300",
        "/api/placeholder/400/300",
        "/api/placeholder/400/300",
        "/api/placeholder/400/300"
      ],
      providerInfo: {
        name: "PowerTech Solutions",
        rating: 4.9,
        totalJobs: 2500,
        joinedDate: "2019",
        verified: true,
        responseRate: "99%",
        avatar: "/api/placeholder/100/100",
        description: "Leading electrical services provider with certified technicians and 24/7 emergency support."
      },
      pricing: {
        basic: {
          price: 299,
          description: "Basic electrical repair and inspection",
          features: ["Electrical inspection", "Basic repairs", "Safety check", "24-hour support"]
        },
        standard: {
          price: 599,
          description: "Comprehensive electrical services",
          features: ["Everything in Basic", "Advanced diagnostics", "Minor installations", "1-year warranty", "Priority support"]
        },
        premium: {
          price: 999,
          description: "Complete electrical solutions",
          features: ["Everything in Standard", "Major installations", "Electrical panel upgrade", "Emergency on-call", "3-year warranty"]
        }
      },
      faqs: [
        {
          question: "What areas do you cover?",
          answer: "We provide services across the entire metropolitan area with 24/7 emergency coverage."
        },
        {
          question: "Are your electricians licensed?",
          answer: "Yes, all our electricians are fully licensed, insured, and regularly trained on the latest electrical codes."
        },
        {
          question: "Do you provide warranty on your work?",
          answer: "Yes, we provide a comprehensive warranty ranging from 1-3 years depending on the service package."
        }
      ],
      reviews: [
        {
          id: 1,
          user: "Sarah Johnson",
          rating: 5,
          comment: "Excellent service! Fixed my electrical issue quickly and professionally. Highly recommended!",
          date: "2 days ago",
          avatar: "/api/placeholder/50/50"
        },
        {
          id: 2,
          user: "Mike Chen",
          rating: 5,
          comment: "Very knowledgeable and professional. Explained everything clearly and work was done perfectly.",
          date: "1 week ago",
          avatar: "/api/placeholder/50/50"
        },
        {
          id: 3,
          user: "Emily Davis",
          rating: 4,
          comment: "Good service overall. Arrived on time and completed the work as promised.",
          date: "2 weeks ago",
          avatar: "/api/placeholder/50/50"
        }
      ]
    }
    setService(mockService)
  }, [serviceId])

  const handleBookNow = () => {
    // In real app, this would navigate to booking flow
    alert(`Booking ${service?.name} - ${selectedPackage} package for ${selectedDate} at ${selectedTime}`)
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
            <p className="text-gray-600">Loading service details...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center mb-6">
          <Link href="/services" className="flex items-center text-gray-600 hover:text-black">
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Back to Services
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Service Header */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="relative h-80 bg-gray-200">
                <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                  {service.badges.map((badge, index) => (
                    <span
                      key={index}
                      className={`px-3 py-1 text-sm font-medium rounded-full ${
                        badge === 'Most Popular' 
                          ? 'bg-red-100 text-red-800'
                          : badge === 'Top Rated'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {badge}
                    </span>
                  ))}
                </div>
                <button
                  onClick={() => setIsFavorite(!isFavorite)}
                  className="absolute top-4 right-4 p-3 bg-white/90 rounded-full hover:bg-white transition duration-200"
                >
                  {isFavorite ? (
                    <HeartSolidIcon className="w-6 h-6 text-red-500" />
                  ) : (
                    <HeartIcon className="w-6 h-6 text-gray-600" />
                  )}
                </button>
              </div>
              
              <div className="p-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{service.name}</h1>
                
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <StarIcon className="w-5 h-5 text-yellow-400 mr-1" />
                      <span className="font-semibold text-gray-900">{service.rating}</span>
                      <span className="text-gray-600 ml-1">({service.reviewCount} reviews)</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <ClockIcon className="w-5 h-5 mr-1" />
                      <span>{service.responseTime}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">₹{service.startingPrice}</div>
                    <div className="text-sm text-gray-600">Starting price</div>
                  </div>
                </div>

                <p className="text-gray-700 leading-relaxed">{service.detailedDescription}</p>
              </div>
            </div>

            {/* Features */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">What's Included</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {service.features.map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <CheckIcon className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Pricing Packages */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Service Packages</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {Object.entries(service.pricing).map(([packageType, packageInfo]) => (
                  <div
                    key={packageType}
                    className={`border-2 rounded-xl p-6 cursor-pointer transition duration-200 ${
                      selectedPackage === packageType
                        ? 'border-black bg-gray-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedPackage(packageType)}
                  >
                    <div className="text-center mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 capitalize">{packageType}</h3>
                      <div className="text-3xl font-bold text-gray-900 mt-2">₹{packageInfo.price}</div>
                    </div>
                    <p className="text-gray-600 text-sm mb-4">{packageInfo.description}</p>
                    <ul className="space-y-2">
                      {packageInfo.features.map((feature, index) => (
                        <li key={index} className="flex items-center text-sm">
                          <CheckIcon className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Provider Info */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">About the Provider</h2>
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex-shrink-0"></div>
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{service.providerInfo.name}</h3>
                    {service.providerInfo.verified && (
                      <CheckBadgeIcon className="w-5 h-5 text-green-500 ml-2" />
                    )}
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                    <div className="flex items-center">
                      <StarIcon className="w-4 h-4 text-yellow-400 mr-1" />
                      <span>{service.providerInfo.rating} rating</span>
                    </div>
                    <span>•</span>
                    <span>{service.providerInfo.totalJobs} jobs completed</span>
                    <span>•</span>
                    <span>Member since {service.providerInfo.joinedDate}</span>
                  </div>
                  <p className="text-gray-700">{service.providerInfo.description}</p>
                </div>
              </div>
            </div>

            {/* Reviews */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Customer Reviews</h2>
              <div className="space-y-6">
                {service.reviews.map((review) => (
                  <div key={review.id} className="border-b border-gray-200 last:border-0 pb-6 last:pb-0">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gray-200 rounded-full flex-shrink-0"></div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-gray-900">{review.user}</h4>
                          <span className="text-sm text-gray-600">{review.date}</span>
                        </div>
                        <div className="flex items-center mb-2">
                          {[...Array(5)].map((_, i) => (
                            <StarIcon
                              key={i}
                              className={`w-4 h-4 ${
                                i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-gray-700">{review.comment}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Book This Service</h3>
              
              {/* Selected Package */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Selected Package</label>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold capitalize">{selectedPackage}</span>
                    <span className="text-xl font-bold">₹{service.pricing[selectedPackage as keyof typeof service.pricing].price}</span>
                  </div>
                </div>
              </div>

              {/* Date Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Date</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              {/* Time Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Time</label>
                <select
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                >
                  <option value="">Choose time slot</option>
                  <option value="09:00">09:00 AM</option>
                  <option value="11:00">11:00 AM</option>
                  <option value="14:00">02:00 PM</option>
                  <option value="16:00">04:00 PM</option>
                  <option value="18:00">06:00 PM</option>
                </select>
              </div>

              {/* Book Now Button */}
              <button
                onClick={handleBookNow}
                disabled={!selectedDate || !selectedTime}
                className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Book Now
              </button>

              {/* Contact Provider */}
              <div className="mt-4 space-y-2">
                <button className="w-full border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition duration-200 flex items-center justify-center">
                  <ChatBubbleLeftRightIcon className="w-5 h-5 mr-2" />
                  Message Provider
                </button>
                <button className="w-full border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition duration-200 flex items-center justify-center">
                  <PhoneIcon className="w-5 h-5 mr-2" />
                  Call Provider
                </button>
              </div>

              {/* Trust Badges */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <ShieldCheckIcon className="w-5 h-5 text-green-500 mr-2" />
                    <span>100% Secure Booking</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <CheckBadgeIcon className="w-5 h-5 text-green-500 mr-2" />
                    <span>Verified Provider</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <TruckIcon className="w-5 h-5 text-green-500 mr-2" />
                    <span>24/7 Support Available</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}