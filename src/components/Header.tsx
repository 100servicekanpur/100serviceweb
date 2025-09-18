'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import {
  MagnifyingGlassIcon,
  MapPinIcon,
  BellIcon,
  ShoppingCartIcon,
  UserCircleIcon,
  ChevronDownIcon,
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline'

export default function Header() {
  const { user, isAuthenticated, logout } = useAuth()
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [isLocationOpen, setIsLocationOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
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
      router.push('/')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/services?search=${encodeURIComponent(searchQuery)}`)
    }
  }

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100' 
        : 'bg-white shadow-sm'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">100</span>
              </div>
              <span className="text-xl font-bold text-gray-900 hidden sm:block">Service</span>
            </Link>
          </div>

          {/* Location Selector - Desktop */}
          <div className="hidden lg:flex items-center relative">
            <button
              onClick={() => setIsLocationOpen(!isLocationOpen)}
              className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition duration-200"
            >
              <MapPinIcon className="w-5 h-5 text-gray-600" />
              <span className="text-gray-700 font-medium">{selectedLocation}</span>
              <ChevronDownIcon className="w-4 h-4 text-gray-500" />
            </button>

            {isLocationOpen && (
              <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-10">
                {locations.map((location) => (
                  <button
                    key={location}
                    onClick={() => {
                      setSelectedLocation(location)
                      setIsLocationOpen(false)
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 text-gray-700"
                  >
                    {location}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-xl mx-8">
            <form onSubmit={handleSearch} className="w-full relative">
              <input
                type="text"
                placeholder="Search for services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
              />
              <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </form>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* Search Icon - Mobile */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="md:hidden p-2 hover:bg-gray-50 rounded-lg"
            >
              <MagnifyingGlassIcon className="w-5 h-5 text-gray-600" />
            </button>

            {/* Navigation Links - Desktop */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/services" className="text-gray-600 hover:text-gray-900 font-medium">
                Services
              </Link>
              <Link href="/about" className="text-gray-600 hover:text-gray-900 font-medium">
                About
              </Link>
              <Link href="/contact" className="text-gray-600 hover:text-gray-900 font-medium">
                Contact
              </Link>
            </nav>

            {isAuthenticated ? (
              <>
                {/* Notifications */}
                <button className="relative p-2 hover:bg-gray-50 rounded-lg">
                  <BellIcon className="w-5 h-5 text-gray-600" />
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    3
                  </span>
                </button>

                {/* Cart */}
                <button className="relative p-2 hover:bg-gray-50 rounded-lg">
                  <ShoppingCartIcon className="w-5 h-5 text-gray-600" />
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    2
                  </span>
                </button>

                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded-lg"
                  >
                    <UserCircleIcon className="w-6 h-6 text-gray-600" />
                    <span className="hidden sm:block text-gray-700 font-medium">
                      {user?.name || 'User'}
                    </span>
                    <ChevronDownIcon className="w-4 h-4 text-gray-500" />
                  </button>

                  {isUserMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-10">
                      <Link
                        href={user?.role === 'admin' ? '/admin/dashboard' : '/dashboard'}
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-50"
                      >
                        Dashboard
                      </Link>
                      <Link href="/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-50">
                        Profile
                      </Link>
                      <Link href="/orders" className="block px-4 py-2 text-gray-700 hover:bg-gray-50">
                        My Orders
                      </Link>
                      <Link href="/settings" className="block px-4 py-2 text-gray-700 hover:bg-gray-50">
                        Settings
                      </Link>
                      <hr className="my-2" />
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-50"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link href="/login" className="text-gray-600 hover:text-gray-900 font-medium">
                  Login
                </Link>
                <Link 
                  href="/register" 
                  className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition duration-200"
                >
                  Register
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 hover:bg-gray-50 rounded-lg"
            >
              {isMenuOpen ? (
                <XMarkIcon className="w-6 h-6 text-gray-600" />
              ) : (
                <Bars3Icon className="w-6 h-6 text-gray-600" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        {isSearchOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search for services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
              />
              <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </form>
          </div>
        )}

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="space-y-2">
              {/* Location Selector - Mobile */}
              <div className="relative">
                <button
                  onClick={() => setIsLocationOpen(!isLocationOpen)}
                  className="w-full flex items-center justify-between px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-2">
                    <MapPinIcon className="w-5 h-5 text-gray-600" />
                    <span>{selectedLocation}</span>
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
                        className="block w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg"
                      >
                        {location}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Navigation Links */}
              <Link href="/services" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg">
                Services
              </Link>
              <Link href="/about" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg">
                About
              </Link>
              <Link href="/contact" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg">
                Contact
              </Link>

              {!isAuthenticated && (
                <>
                  <Link href="/login" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg">
                    Login
                  </Link>
                  <Link href="/register" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg">
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}