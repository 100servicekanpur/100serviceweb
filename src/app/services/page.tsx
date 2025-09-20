'use client'

import React, { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { supabase } from '@/lib/supabase'
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  HeartIcon,
  ArrowRightIcon,
  CheckBadgeIcon
} from '@heroicons/react/24/outline'
import { StarIcon as StarSolidIcon, HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'

interface Service {
  id: string
  title: string
  description: string
  short_description?: string
  base_price: number
  rating_average: number
  rating_count: number
  booking_count: number
  categories?: {
    name: string
  }
  users?: {
    full_name: string
  }
}

interface Category {
  id: string
  name: string
  slug: string
  is_active: boolean
  sort_order: number
}

export default function ServicesPage() {
  const [filteredServices, setFilteredServices] = useState<Service[]>([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('popular')
  const [priceRange, setPriceRange] = useState([0, 5000])
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [favorites, setFavorites] = useState(new Set<string>())

  // Mock data - in real app this would come from Supabase
  const mockServices: Service[] = useMemo(() => [
    {
      id: "1",
      title: "Electrical Repair & Installation",
      description: "Professional electrical services including repairs, installations, and emergency support",
      short_description: "Professional electrical services",
      base_price: 299,
      rating_average: 4.8,
      rating_count: 1250,
      booking_count: 85,
      categories: { name: "Electrical" },
      users: { full_name: "PowerTech Solutions" }
    },
    {
      id: "2",
      title: "Professional Plumbing Services",
      description: "Complete plumbing solutions from leaky faucets to full bathroom renovations",
      short_description: "Complete plumbing solutions",
      base_price: 199,
      rating_average: 4.9,
      rating_count: 980,
      booking_count: 120,
      categories: { name: "Plumbing" },
      users: { full_name: "AquaFix Pro" }
    },
    {
      id: "3",
      title: "Deep Cleaning Services",
      description: "Comprehensive home cleaning with eco-friendly products and trained professionals",
      short_description: "Comprehensive home cleaning",
      base_price: 149,
      rating_average: 4.7,
      rating_count: 2100,
      booking_count: 200,
      categories: { name: "Cleaning" },
      users: { full_name: "CleanMasters" }
    },
    {
      id: "4",
      title: "Home Painting Services",
      description: "Professional interior and exterior painting with premium materials and expert craftsmanship",
      short_description: "Professional painting services",
      base_price: 899,
      rating_average: 4.6,
      rating_count: 750,
      booking_count: 65,
      categories: { name: "Painting" },
      users: { full_name: "ColorCraft Painters" }
    },
    {
      id: "5",
      title: "Furniture Assembly & Carpentry",
      description: "Expert furniture assembly and custom carpentry work for all your home needs",
      short_description: "Expert furniture assembly",
      base_price: 89,
      rating_average: 4.5,
      rating_count: 450,
      booking_count: 95,
      categories: { name: "Carpentry" },
      users: { full_name: "WoodWork Experts" }
    },
    {
      id: "6",
      title: "Appliance Repair Services",
      description: "Fast and reliable repair services for all major home appliances",
      short_description: "Appliance repair services",
      base_price: 129,
      rating_average: 4.4,
      rating_count: 650,
      booking_count: 110,
      categories: { name: "Appliance Repair" },
      users: { full_name: "FixIt Appliance Pros" }
    }
  ], [])

  const categories = [
    { id: 'all', name: 'All Services', count: mockServices.length },
    { id: 'electrical', name: 'Electrical', count: mockServices.filter(s => s.categories?.name === 'Electrical').length },
    { id: 'plumbing', name: 'Plumbing', count: mockServices.filter(s => s.categories?.name === 'Plumbing').length },
    { id: 'cleaning', name: 'Cleaning', count: mockServices.filter(s => s.categories?.name === 'Cleaning').length },
    { id: 'painting', name: 'Painting', count: mockServices.filter(s => s.categories?.name === 'Painting').length },
    { id: 'carpentry', name: 'Carpentry', count: mockServices.filter(s => s.categories?.name === 'Carpentry').length },
    { id: 'appliance', name: 'Appliance Repair', count: mockServices.filter(s => s.categories?.name === 'Appliance Repair').length }
  ]

  useEffect(() => {
    let filtered = mockServices

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(service => service.categories?.name.toLowerCase() === selectedCategory.toLowerCase())
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(service =>
        service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Filter by price range
    filtered = filtered.filter(service =>
      service.base_price >= priceRange[0] && service.base_price <= priceRange[1]
    )

    // Sort services
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.base_price - b.base_price)
        break
      case 'price-high':
        filtered.sort((a, b) => b.base_price - a.base_price)
        break
      case 'rating':
        filtered.sort((a, b) => b.rating_average - a.rating_average)
        break
      case 'reviews':
        filtered.sort((a, b) => b.rating_count - a.rating_count)
        break
      default: // popular
        filtered.sort((a, b) => b.booking_count - a.booking_count)
    }

    setFilteredServices(filtered)
  }, [selectedCategory, searchQuery, sortBy, priceRange, mockServices])

  const toggleFavorite = (serviceId: string) => {
    const newFavorites = new Set(favorites)
    if (newFavorites.has(serviceId)) {
      newFavorites.delete(serviceId)
    } else {
      newFavorites.add(serviceId)
    }
    setFavorites(newFavorites)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Professional Services for Your Home
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Browse our wide range of trusted home services. From repairs to renovations, we&apos;ve got you covered.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for services..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-6 py-4 pr-12 text-lg border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                />
                <MagnifyingGlassIcon className="absolute right-4 top-4 h-6 w-6 text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
                <button
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className="lg:hidden p-2 hover:bg-gray-50 rounded-lg"
                >
                  <FunnelIcon className="w-5 h-5" />
                </button>
              </div>

              <div className={`space-y-6 ${isFilterOpen ? 'block' : 'hidden lg:block'}`}>
                {/* Categories */}
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Categories</h4>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`w-full text-left px-3 py-2 rounded-lg transition duration-200 ${
                          selectedCategory === category.id
                            ? 'bg-black text-white'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <span>{category.name}</span>
                          <span className={`text-sm ${
                            selectedCategory === category.id ? 'text-gray-300' : 'text-gray-500'
                          }`}>
                            {category.count}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Price Range</h4>
                  <div className="px-2">
                    <input
                      type="range"
                      min="0"
                      max="5000"
                      step="100"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-600 mt-2">
                      <span>₹0</span>
                      <span>₹{priceRange[1]}</span>
                    </div>
                  </div>
                </div>

                {/* Sort By */}
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Sort By</h4>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  >
                    <option value="popular">Most Popular</option>
                    <option value="rating">Highest Rated</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="reviews">Most Reviewed</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Services Grid */}
          <div className="lg:w-3/4">
            {/* Results Header */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedCategory === 'all' ? 'All Services' : categories.find(c => c.id === selectedCategory)?.name}
                </h2>
                <p className="text-gray-600 mt-1">
                  {filteredServices.length} services available
                </p>
              </div>
            </div>

            {/* Services Grid */}
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredServices.map((service) => (
                <div key={service.id} className="bg-white rounded-xl shadow-sm hover:shadow-lg transition duration-200 overflow-hidden">
                  {/* Service Image */}
                  <div className="relative h-48 bg-gray-200">
                    <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                        Verified
                      </span>
                      {service.rating_average >= 4.5 && (
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                          Top Rated
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => toggleFavorite(service.id)}
                      className="absolute top-4 right-4 p-2 bg-white/90 rounded-full hover:bg-white transition duration-200"
                    >
                      {favorites.has(service.id) ? (
                        <HeartSolidIcon className="w-5 h-5 text-red-500" />
                      ) : (
                        <HeartIcon className="w-5 h-5 text-gray-600" />
                      )}
                    </button>
                  </div>

                  {/* Service Content */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                        {service.title}
                      </h3>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {service.description}
                    </p>

                    {/* Provider & Rating */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <CheckBadgeIcon className="w-4 h-4 text-green-500 mr-1" />
                        <span className="text-sm text-gray-600">{service.users?.full_name}</span>
                      </div>
                      <div className="flex items-center">
                        <StarSolidIcon className="w-4 h-4 text-yellow-400 mr-1" />
                        <span className="text-sm font-medium text-gray-900">{service.rating_average}</span>
                        <span className="text-sm text-gray-600 ml-1">({service.rating_count})</span>
                      </div>
                    </div>

                    {/* Features */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                        Professional Service
                      </span>
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                        {service.booking_count}+ bookings
                      </span>
                    </div>

                    {/* Price & CTA */}
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-lg font-bold text-gray-900">₹{service.base_price}</span>
                        <span className="text-sm text-gray-600 ml-1">onwards</span>
                      </div>
                      <Link
                        href={`/book/${service.id}`}
                        className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition duration-200 flex items-center"
                      >
                        Book Now
                        <ArrowRightIcon className="w-4 h-4 ml-2" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* No Results */}
            {filteredServices.length === 0 && (
              <div className="text-center py-12">
                <MagnifyingGlassIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No services found</h3>
                <p className="text-gray-600">
                  Try adjusting your filters or search terms to find what you&apos;re looking for.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}