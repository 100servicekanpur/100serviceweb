'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import {
  MagnifyingGlassIcon,
  MapPinIcon,
  BellIcon,
  TicketIcon,
  UserCircleIcon,
  ChevronDownIcon,
  Bars3Icon,
  XMarkIcon,
  HomeIcon,
  WrenchScrewdriverIcon,
  PaintBrushIcon,
  LightBulbIcon,
  SparklesIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline'

export default function Header() {
  const { user, isAuthenticated, logout } = useAuth()
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [isLocationOpen, setIsLocationOpen] = useState(false)
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedLocation, setSelectedLocation] = useState('Delhi NCR')
  const [isScrolled, setIsScrolled] = useState(false)

  const locations = [
    'Delhi NCR',
    'Mumbai',
    'Bangalore',
    'Chennai',
    'Kolkata',
    'Hyderabad',
    'Pune',
    'Ahmedabad'
  ]

  const serviceCategories = [
    { name: 'Home Cleaning', icon: HomeIcon, href: '/services?category=cleaning' },
    { name: 'Electrical', icon: LightBulbIcon, href: '/services?category=electrical' },
    { name: 'Plumbing', icon: WrenchScrewdriverIcon, href: '/services?category=plumbing' },
    { name: 'Painting', icon: PaintBrushIcon, href: '/services?category=painting' },
    { name: 'Beauty Services', icon: SparklesIcon, href: '/services?category=beauty' },
    { name: 'Office Services', icon: BuildingOfficeIcon, href: '/services?category=office' }
  ]

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = async () => {
    try {
      await logout()
      setIsUserMenuOpen(false)
      router.push('/')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/services?search=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setIsUserMenuOpen(false)
      setIsLocationOpen(false)
      setIsCategoriesOpen(false)
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-white'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Left: Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">1</span>
              </div>
              <span className="text-xl font-bold text-black">100Service</span>
            </Link>
          </div>

          {/* Center-Left: Location Selector */}
          <div className="hidden lg:flex items-center">
            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => setIsLocationOpen(!isLocationOpen)}
                className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <MapPinIcon className="w-5 h-5 text-gray-600" />
                <span className="font-medium">{selectedLocation}</span>
                <ChevronDownIcon className="w-4 h-4 text-gray-500" />
              </button>
              
              {isLocationOpen && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10">
                  {locations.map((location) => (
                    <button
                      key={location}
                      onClick={() => {
                        setSelectedLocation(location)
                        setIsLocationOpen(false)
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 text-gray-700 transition-colors"
                    >
                      {location}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Center: Categories + Search Bar */}
          <div className="hidden md:flex items-center space-x-4 flex-1 max-w-2xl mx-8">
            {/* Categories Dropdown */}
            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors whitespace-nowrap"
              >
                <span className="font-medium">Categories</span>
                <ChevronDownIcon className="w-4 h-4 text-gray-500" />
              </button>
              
              {isCategoriesOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10">
                  {serviceCategories.map((category) => {
                    const IconComponent = category.icon
                    return (
                      <Link
                        key={category.name}
                        href={category.href}
                        onClick={() => setIsCategoriesOpen(false)}
                        className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 text-gray-700 transition-colors"
                      >
                        <IconComponent className="w-5 h-5 text-gray-600" />
                        <span>{category.name}</span>
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex-1 relative">
              <input
                type="text"
                placeholder="Find services near you"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2.5 pl-12 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition-all"
              />
              <MagnifyingGlassIcon className="absolute left-4 top-3 h-5 w-5 text-gray-400" />
            </form>
          </div>

          {/* Right: Icons and User */}
          <div className="flex items-center space-x-2">
            {/* Mobile Search */}
            <button className="md:hidden p-2 hover:bg-gray-50 rounded-lg transition-colors">
              <MagnifyingGlassIcon className="w-5 h-5 text-gray-600" />
            </button>

            {isAuthenticated ? (
              <>
                {/* Notifications */}
                <button className="relative p-2 hover:bg-gray-50 rounded-lg transition-colors">
                  <BellIcon className="w-5 h-5 text-gray-600" />
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    3
                  </span>
                </button>

                {/* Coupons */}
                <button className="relative p-2 hover:bg-gray-50 rounded-lg transition-colors">
                  <TicketIcon className="w-5 h-5 text-gray-600" />
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 text-white text-xs rounded-full flex items-center justify-center">
                    2
                  </span>
                </button>

                {/* User Menu */}
                <div className="relative" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <UserCircleIcon className="w-6 h-6 text-gray-600" />
                    <span className="hidden sm:block text-gray-700 font-medium">
                      {user?.full_name || 'User'}
                    </span>
                    <ChevronDownIcon className="w-4 h-4 text-gray-500" />
                  </button>

                  {isUserMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10">
                      <Link
                        href={user?.role === 'admin' ? '/admin/dashboard' : '/dashboard'}
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        Dashboard
                      </Link>
                      <Link 
                        href="/profile" 
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        Profile
                      </Link>
                      <Link 
                        href="/orders" 
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        My Orders
                      </Link>
                      <Link 
                        href="/settings" 
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        Settings
                      </Link>
                      <hr className="my-2" />
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-50 transition-colors"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link 
                  href="/login" 
                  className="text-gray-700 hover:text-black font-medium transition-colors"
                >
                  Login
                </Link>
                <Link 
                  href="/register" 
                  className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-all duration-200 font-medium"
                >
                  Signup
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 hover:bg-gray-50 rounded-lg transition-colors"
            >
              {isMenuOpen ? (
                <XMarkIcon className="w-6 h-6 text-gray-600" />
              ) : (
                <Bars3Icon className="w-6 h-6 text-gray-600" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="space-y-3">
              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  placeholder="Find services near you"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2.5 pl-12 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                />
                <MagnifyingGlassIcon className="absolute left-4 top-3 h-5 w-5 text-gray-400" />
              </form>

              {/* Location Selector - Mobile */}
              <div className="relative">
                <button
                  onClick={() => setIsLocationOpen(!isLocationOpen)}
                  className="w-full flex items-center justify-between px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <div className="flex items-center space-x-2">
                    <MapPinIcon className="w-5 h-5 text-gray-600" />
                    <span className="font-medium">{selectedLocation}</span>
                  </div>
                  <ChevronDownIcon className="w-4 h-4 text-gray-500" />
                </button>
                
                {isLocationOpen && (
                  <div className="mt-2 space-y-1 pl-4">
                    {locations.map((location) => (
                      <button
                        key={location}
                        onClick={() => {
                          setSelectedLocation(location)
                          setIsLocationOpen(false)
                        }}
                        className="block w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        {location}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Categories - Mobile */}
              <div className="space-y-1">
                <div className="px-4 py-2 text-sm font-semibold text-gray-900">Categories</div>
                {serviceCategories.map((category) => {
                  const IconComponent = category.icon
                  return (
                    <Link
                      key={category.name}
                      href={category.href}
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <IconComponent className="w-5 h-5 text-gray-600" />
                      <span>{category.name}</span>
                    </Link>
                  )
                })}
              </div>

              {!isAuthenticated && (
                <div className="pt-4 border-t border-gray-200 space-y-2">
                  <Link 
                    href="/login" 
                    className="block px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link 
                    href="/register" 
                    className="block px-4 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-center font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Signup
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}