'use client'

import React, { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  HeartIcon,
  ArrowRightIcon,
  CheckBadgeIcon
} from '@heroicons/react/24/outline'
import { StarIcon as StarSolidIcon, HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'

interface Service {
  id: number
  name: string
  description: string
  image: string
  rating: number
  reviews: number
  startingPrice: number
  category: string
  provider: string
  availability: string
  responseTime: string
  badges: string[]
  features: string[]
}

interface Category {
  id: string
  name: string
  count: number
}

export default function ServicesPage() {
  const [filteredServices, setFilteredServices] = useState<Service[]>([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('popular')
  const [priceRange, setPriceRange] = useState([0, 5000])
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [favorites, setFavorites] = useState(new Set<number>())

  // Mock data - in real app this would come from Supabase
  const mockServices: Service[] = useMemo(() => [
    {
      id: 1,
      name: "Electrical Repair & Installation",
      description: "Professional electrical services including repairs, installations, and emergency support",
      image: "/api/placeholder/400/300",
      rating: 4.8,
      reviews: 1250,
      startingPrice: 299,
      category: "electrical",
      provider: "PowerTech Solutions",
      availability: "24/7",
      responseTime: "Within 2 hours",
      badges: ["Verified", "Most Popular", "Emergency Available"],
      features: ["Free Inspection", "1 Year Warranty", "Licensed Electricians", "Emergency Service"]
    },
    {
      id: 2,
      name: "Professional Plumbing Services",
      description: "Complete plumbing solutions from leaky faucets to full bathroom renovations",
      image: "/api/placeholder/400/300",
      rating: 4.9,
      reviews: 980,
      startingPrice: 199,
      category: "plumbing",
      provider: "AquaFix Pro",
      availability: "6 AM - 10 PM",
      responseTime: "Within 1 hour",
      badges: ["Verified", "Top Rated"],
      features: ["Free Estimate", "Quality Guarantee", "Licensed Plumbers", "Same Day Service"]
    },
    {
      id: 3,
      name: "Deep Cleaning Services",
      description: "Comprehensive home cleaning with eco-friendly products and trained professionals",
      image: "/api/placeholder/400/300",
      rating: 4.7,
      reviews: 2100,
      startingPrice: 149,
      category: "cleaning",
      provider: "CleanMasters",
      availability: "7 AM - 8 PM",
      responseTime: "Within 4 hours",
      badges: ["Verified", "Eco-Friendly"],
      features: ["Eco Products", "Insured Staff", "Flexible Timing", "Satisfaction Guarantee"]
    },
    {
      id: 4,
      name: "Home Painting Services",
      description: "Interior and exterior painting with premium quality paints and expert painters",
      image: "/api/placeholder/400/300",
      rating: 4.6,
      reviews: 850,
      startingPrice: 899,
      category: "painting",
      provider: "ColorCraft Painters",
      availability: "9 AM - 6 PM",
      responseTime: "Next Day",
      badges: ["Verified", "Premium Quality"],
      features: ["Premium Paints", "Color Consultation", "Wall Preparation", "Clean-up Included"]
    },
    {
      id: 5,
      name: "Carpentry & Furniture Repair",
      description: "Custom carpentry work and furniture repair by skilled craftsmen",
      image: "/api/placeholder/400/300",
      rating: 4.8,
      reviews: 650,
      startingPrice: 399,
      category: "carpentry",
      provider: "WoodWorks Pro",
      availability: "8 AM - 7 PM",
      responseTime: "Within 6 hours",
      badges: ["Verified", "Custom Work"],
      features: ["Custom Design", "Quality Wood", "Skilled Craftsmen", "Warranty Included"]
    },
    {
      id: 6,
      name: "Appliance Repair Services",
      description: "Repair and maintenance for all home appliances with genuine parts",
      image: "/api/placeholder/400/300",
      rating: 4.5,
      reviews: 1100,
      startingPrice: 249,
      category: "appliance",
      provider: "FixIt Solutions",
      availability: "24/7",
      responseTime: "Within 3 hours",
      badges: ["Verified", "Genuine Parts"],
      features: ["Genuine Parts", "Expert Technicians", "Warranty", "Emergency Service"]
    }
  ], [])

  const categories: Category[] = [
    { id: 'all', name: 'All Services', count: mockServices.length },
    { id: 'electrical', name: 'Electrical', count: mockServices.filter(s => s.category === 'electrical').length },
    { id: 'plumbing', name: 'Plumbing', count: mockServices.filter(s => s.category === 'plumbing').length },
    { id: 'cleaning', name: 'Cleaning', count: mockServices.filter(s => s.category === 'cleaning').length },
    { id: 'painting', name: 'Painting', count: mockServices.filter(s => s.category === 'painting').length },
    { id: 'carpentry', name: 'Carpentry', count: mockServices.filter(s => s.category === 'carpentry').length },
    { id: 'appliance', name: 'Appliance Repair', count: mockServices.filter(s => s.category === 'appliance').length }
  ]

  useEffect(() => {
    let filtered = mockServices

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(service => service.category === selectedCategory)
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(service =>
        service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Filter by price range
    filtered = filtered.filter(service =>
      service.startingPrice >= priceRange[0] && service.startingPrice <= priceRange[1]
    )

    // Sort services
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.startingPrice - b.startingPrice)
        break
      case 'price-high':
        filtered.sort((a, b) => b.startingPrice - a.startingPrice)
        break
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating)
        break
      case 'reviews':
        filtered.sort((a, b) => b.reviews - a.reviews)
        break
      default: // popular
        filtered.sort((a, b) => b.reviews - a.reviews)
    }

    setFilteredServices(filtered)
  }, [selectedCategory, searchQuery, sortBy, priceRange, mockServices])

  const toggleFavorite = (serviceId: number) => {
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
                      {service.badges.map((badge, index) => (
                        <span
                          key={index}
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
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
                        {service.name}
                      </h3>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {service.description}
                    </p>

                    {/* Provider & Rating */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <CheckBadgeIcon className="w-4 h-4 text-green-500 mr-1" />
                        <span className="text-sm text-gray-600">{service.provider}</span>
                      </div>
                      <div className="flex items-center">
                        <StarSolidIcon className="w-4 h-4 text-yellow-400 mr-1" />
                        <span className="text-sm font-medium text-gray-900">{service.rating}</span>
                        <span className="text-sm text-gray-600 ml-1">({service.reviews})</span>
                      </div>
                    </div>

                    {/* Features */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {service.features.slice(0, 2).map((feature, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                        >
                          {feature}
                        </span>
                      ))}
                      {service.features.length > 2 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                          +{service.features.length - 2} more
                        </span>
                      )}
                    </div>

                    {/* Price & CTA */}
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-lg font-bold text-gray-900">₹{service.startingPrice}</span>
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