'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import {
  CheckBadgeIcon,
  ArrowRightIcon,
  WrenchScrewdriverIcon,
  BoltIcon,
  ShieldCheckIcon,
  HomeIcon,
  PaintBrushIcon,
  LightBulbIcon,
  SparklesIcon,
  BuildingOfficeIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  FireIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline'
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid'

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')

  // Hero Carousel Data
  const heroSlides = [
    {
      title: "Professional Home Services at Your Doorstep",
      subtitle: "Trusted experts for all your home repair and maintenance needs",
      cta: "Book Now",
      ctaLink: "/services",
      bgColor: "from-gray-900 to-black",
      image: "/api/placeholder/1200/600"
    },
    {
      title: "Emergency Services Available 24/7", 
      subtitle: "Urgent repairs? We're here when you need us most",
      cta: "Emergency Help",
      ctaLink: "/contact",
      bgColor: "from-gray-800 to-gray-900",
      image: "/api/placeholder/1200/600"
    },
    {
      title: "Up to 50% Off on All Services",
      subtitle: "Limited time offer on premium home services",
      cta: "Grab Deals",
      ctaLink: "/services",
      bgColor: "from-gray-700 to-gray-800",
      image: "/api/placeholder/1200/600"
    }
  ]

  // Service Categories
  const serviceCategories = [
    { 
      name: 'Home Cleaning', 
      icon: HomeIcon, 
      count: '120+ Services',
      href: '/services?category=cleaning',
      bgColor: 'bg-blue-50 hover:bg-blue-100',
      iconColor: 'text-blue-600'
    },
    { 
      name: 'Electrical', 
      icon: LightBulbIcon, 
      count: '80+ Services',
      href: '/services?category=electrical',
      bgColor: 'bg-yellow-50 hover:bg-yellow-100',
      iconColor: 'text-yellow-600'
    },
    { 
      name: 'Plumbing', 
      icon: WrenchScrewdriverIcon, 
      count: '65+ Services',
      href: '/services?category=plumbing',
      bgColor: 'bg-cyan-50 hover:bg-cyan-100',
      iconColor: 'text-cyan-600'
    },
    { 
      name: 'Painting', 
      icon: PaintBrushIcon, 
      count: '45+ Services',
      href: '/services?category=painting',
      bgColor: 'bg-purple-50 hover:bg-purple-100',
      iconColor: 'text-purple-600'
    },
    { 
      name: 'Beauty Services', 
      icon: SparklesIcon, 
      count: '95+ Services',
      href: '/services?category=beauty',
      bgColor: 'bg-pink-50 hover:bg-pink-100',
      iconColor: 'text-pink-600'
    },
    { 
      name: 'Office Services', 
      icon: BuildingOfficeIcon, 
      count: '35+ Services',
      href: '/services?category=office',
      bgColor: 'bg-green-50 hover:bg-green-100',
      iconColor: 'text-green-600'
    },
    { 
      name: 'AC Repair', 
      icon: BoltIcon, 
      count: '25+ Services',
      href: '/services?category=ac',
      bgColor: 'bg-indigo-50 hover:bg-indigo-100',
      iconColor: 'text-indigo-600'
    },
    { 
      name: 'Security', 
      icon: ShieldCheckIcon, 
      count: '20+ Services',
      href: '/services?category=security',
      bgColor: 'bg-gray-50 hover:bg-gray-100',
      iconColor: 'text-gray-600'
    }
  ]

  // Popular Services
  const popularServices = [
    {
      id: 1,
      name: "Electrical Repair & Installation",
      image: "/api/placeholder/300/200",
      rating: 4.8,
      reviews: 1250,
      startingPrice: 299,
      responseTime: "Within 2 hours",
      category: "electrical"
    },
    {
      id: 2,
      name: "Professional Plumbing Services",
      image: "/api/placeholder/300/200",
      rating: 4.9,
      reviews: 980,
      startingPrice: 199,
      responseTime: "Within 1 hour",
      category: "plumbing"
    },
    {
      id: 3,
      name: "Deep Cleaning Services",
      image: "/api/placeholder/300/200",
      rating: 4.7,
      reviews: 2100,
      startingPrice: 149,
      responseTime: "Same day",
      category: "cleaning"
    },
    {
      id: 4,
      name: "Home Painting Services",
      image: "/api/placeholder/300/200",
      rating: 4.6,
      reviews: 850,
      startingPrice: 899,
      responseTime: "Next day",
      category: "painting"
    }
  ]

  // Trending Services
  const trendingServices = [
    {
      id: 1,
      name: "Smart Home Installation",
      image: "/api/placeholder/250/180",
      rating: 4.9,
      startingPrice: 599,
      badge: "New",
      trending: true
    },
    {
      id: 2,
      name: "Solar Panel Installation",
      image: "/api/placeholder/250/180",
      rating: 4.8,
      startingPrice: 12999,
      badge: "Trending",
      trending: true
    },
    {
      id: 3,
      name: "EV Charger Setup",
      image: "/api/placeholder/250/180",
      rating: 4.7,
      startingPrice: 2499,
      badge: "Hot",
      trending: true
    }
  ]

  // Hero slider auto-play
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [heroSlides.length])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/services?search=${encodeURIComponent(searchQuery.trim())}`
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section - Full-width Carousel */}
      <section className="relative h-[500px] lg:h-[600px] overflow-hidden mt-16">
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-700 ease-in-out ${
              index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
            }`}
          >
            <div className={`absolute inset-0 bg-gradient-to-r ${slide.bgColor} opacity-90 z-10`} />
            <div 
              className="absolute inset-0 bg-cover bg-center bg-gray-800"
              style={{ backgroundImage: `url(${slide.image})` }}
            />
            
            <div className="relative z-20 flex items-center h-full">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div className="max-w-3xl">
                  <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                    {slide.title}
                  </h1>
                  <p className="text-xl lg:text-2xl text-gray-200 mb-8 leading-relaxed">
                    {slide.subtitle}
                  </p>
                  <Link
                    href={slide.ctaLink}
                    className="inline-flex items-center bg-white text-black px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    {slide.cta}
                    <ArrowRightIcon className="ml-2 w-5 h-5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 z-30 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-3 rounded-full transition-all duration-300"
        >
          <ChevronLeftIcon className="w-6 h-6" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 z-30 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-3 rounded-full transition-all duration-300"
        >
          <ChevronRightIcon className="w-6 h-6" />
        </button>

        {/* Slide Indicators */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-30 flex space-x-2">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide ? 'bg-white scale-125' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </section>

      {/* All Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              All Categories
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore our comprehensive range of home services
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {serviceCategories.map((category) => {
              const IconComponent = category.icon
              return (
                <Link
                  key={category.name}
                  href={category.href}
                  className={`group ${category.bgColor} rounded-2xl p-6 text-center transition-all duration-300 transform hover:scale-105 hover:shadow-lg border border-gray-100`}
                >
                  <div className={`w-16 h-16 ${category.iconColor} mx-auto mb-4 bg-white rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="w-8 h-8" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{category.name}</h3>
                  <p className="text-sm text-gray-600">{category.count}</p>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* Popular Services Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Popular Services
              </h2>
              <p className="text-xl text-gray-600">
                Most booked services by our customers
              </p>
            </div>
            <Link 
              href="/services"
              className="hidden md:flex items-center text-black hover:text-gray-700 font-medium"
            >
              View All
              <ArrowRightIcon className="ml-2 w-5 h-5" />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularServices.map((service) => (
              <div
                key={service.id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-gray-100 overflow-hidden"
              >
                <div className="relative">
                  <img
                    src={service.image}
                    alt={service.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-medium text-gray-900">
                    ₹{service.startingPrice}+
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                    {service.name}
                  </h3>
                  <div className="flex items-center mb-2">
                    <StarSolidIcon className="w-4 h-4 text-yellow-400" />
                    <span className="text-sm font-medium text-gray-900 ml-1">
                      {service.rating}
                    </span>
                    <span className="text-sm text-gray-500 ml-1">
                      ({service.reviews} reviews)
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">{service.responseTime}</p>
                  <Link
                    href={`/services/${service.id}`}
                    className="w-full bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition-colors text-center block font-medium"
                  >
                    Quick Book
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8 md:hidden">
            <Link 
              href="/services"
              className="inline-flex items-center text-black hover:text-gray-700 font-medium"
            >
              View All Services
              <ArrowRightIcon className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Trending Services Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              <FireIcon className="w-8 h-8 text-red-500 inline-block mr-2" />
              Trending Services
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              New and emerging services that are gaining popularity
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {trendingServices.map((service) => (
              <div
                key={service.id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-gray-100 overflow-hidden relative"
              >
                <div className="absolute top-4 left-4 z-10">
                  <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {service.badge}
                  </span>
                </div>
                <div className="relative">
                  <img
                    src={service.image}
                    alt={service.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-medium text-gray-900">
                    ₹{service.startingPrice}+
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-2 text-lg">
                    {service.name}
                  </h3>
                  <div className="flex items-center mb-4">
                    <StarSolidIcon className="w-4 h-4 text-yellow-400" />
                    <span className="text-sm font-medium text-gray-900 ml-1">
                      {service.rating}
                    </span>
                    <span className="text-sm text-gray-500 ml-1">
                      Rating
                    </span>
                  </div>
                  <Link
                    href={`/services/${service.id}`}
                    className="w-full bg-black text-white py-3 px-4 rounded-lg hover:bg-gray-800 transition-colors text-center block font-medium"
                  >
                    Book Now
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* All Services Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              All Services
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Browse our complete directory of home services
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-8">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for services..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-6 py-4 pl-12 pr-6 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-black text-lg"
                />
                <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400" />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors font-medium"
                >
                  Search
                </button>
              </div>
            </form>
          </div>

          <div className="text-center">
            <Link
              href="/services"
              className="inline-flex items-center bg-black text-white px-8 py-4 rounded-lg font-semibold hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Browse All Services
              <ArrowRightIcon className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Become Our Partner Section */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold mb-6">
                Become a 100Service Partner
              </h2>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                Join our network of trusted professionals and grow your business. 
                Connect with customers who need your expertise and build lasting relationships.
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center">
                  <CheckBadgeIcon className="w-6 h-6 text-green-400 mr-3" />
                  <span className="text-lg">Verified customer base</span>
                </li>
                <li className="flex items-center">
                  <CheckBadgeIcon className="w-6 h-6 text-green-400 mr-3" />
                  <span className="text-lg">Secure payment processing</span>
                </li>
                <li className="flex items-center">
                  <CheckBadgeIcon className="w-6 h-6 text-green-400 mr-3" />
                  <span className="text-lg">24/7 support team</span>
                </li>
                <li className="flex items-center">
                  <CheckBadgeIcon className="w-6 h-6 text-green-400 mr-3" />
                  <span className="text-lg">Marketing & growth support</span>
                </li>
              </ul>
              <Link
                href="/register?type=partner"
                className="inline-flex items-center bg-white text-black px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Register Now
                <ArrowRightIcon className="ml-2 w-5 h-5" />
              </Link>
            </div>
            <div className="relative">
              <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700">
                <div className="text-center mb-6">
                  <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckBadgeIcon className="w-12 h-12 text-black" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Partnership Benefits</h3>
                  <p className="text-gray-400">Join thousands of successful partners</p>
                </div>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="bg-gray-700 rounded-lg p-4">
                    <div className="text-2xl font-bold text-white">10K+</div>
                    <div className="text-sm text-gray-400">Active Partners</div>
                  </div>
                  <div className="bg-gray-700 rounded-lg p-4">
                    <div className="text-2xl font-bold text-white">4.8★</div>
                    <div className="text-sm text-gray-400">Partner Rating</div>
                  </div>
                  <div className="bg-gray-700 rounded-lg p-4">
                    <div className="text-2xl font-bold text-white">50K+</div>
                    <div className="text-sm text-gray-400">Jobs Completed</div>
                  </div>
                  <div className="bg-gray-700 rounded-lg p-4">
                    <div className="text-2xl font-bold text-white">₹2.5Cr+</div>
                    <div className="text-sm text-gray-400">Earnings Paid</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}