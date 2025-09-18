'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
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
  ArrowRightOnRectangleIcon,
  UserPlusIcon
} from '@heroicons/react/24/outline'

export default function Header() {
  const { user, isAuthenticated, logout } = useAuth()
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [isLocationOpen, setIsLocationOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedLocation, setSelectedLocation] = useState('Tilak Nagar, Kanpur')
  const [isScrolled, setIsScrolled] = useState(false)

  const locations = ['Tilak Nagar, Kanpur', 'Civil Lines, Kanpur', 'Kalyanpur, Kanpur', 'Swaroop Nagar, Kanpur', 'Govind Nagar, Kanpur']

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/services?search=${encodeURIComponent(searchQuery)}`)
    }
  }

  return (
    <header className={`sticky top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white shadow-lg border-b border-gray-200/50' 
        : 'bg-white shadow-sm'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          
          {/* Left: Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Image 
                src="https://ipyoocasncbxgczhaftj.supabase.co/storage/v1/object/public/100service/100servicelogo.png"
                alt="100Service Logo"
                width={120}
                height={32}
                priority
                className="h-8 w-auto"
              />
            </Link>
          </div>

          {/* Center: Location & Search (Desktop) */}
          <div className="hidden lg:flex items-center space-x-6 flex-1 max-w-2xl mx-8">
            
            {/* Location Selector */}
            <div className="relative">
              <button
                onClick={() => setIsLocationOpen(!isLocationOpen)}
                className="flex items-center space-x-2 px-4 py-3 bg-gray-100/80 backdrop-blur-xl rounded-xl border border-gray-200 hover:bg-gray-200/80 transition-all duration-300 group"
              >
                <MapPinIcon className="w-5 h-5 text-gray-700 group-hover:text-gray-900" />
                <span className="text-gray-700 font-medium group-hover:text-gray-900">{selectedLocation}</span>
                <ChevronDownIcon className={`w-4 h-4 text-gray-600 transition-transform duration-300 ${isLocationOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Location Dropdown */}
              {isLocationOpen && (
                <div className="absolute top-full mt-2 left-0 w-56 bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200 py-2 z-50">
                  {locations.map((location) => (
                    <button
                      key={location}
                      onClick={() => {
                        setSelectedLocation(location)
                        setIsLocationOpen(false)
                      }}
                      className="w-full text-left px-4 py-3 hover:bg-gray-100/80 transition-colors duration-200 text-gray-700"
                    >
                      {location}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex-1 max-w-lg">
              <div className="relative flex items-center bg-white/90 backdrop-blur-xl border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
                <MagnifyingGlassIcon className="w-5 h-5 text-gray-500 ml-4" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for services near you"
                  className="flex-1 px-4 py-3 bg-transparent border-0 outline-none text-gray-900 placeholder-gray-500"
                />
                <button
                  type="submit"
                  className="bg-gray-600 text-white px-6 py-3 rounded-r-xl font-medium hover:bg-gray-700 transition-colors duration-300"
                >
                  Search
                </button>
              </div>
            </form>
          </div>

          {/* Right: Notification, Cart, User */}
          <div className="flex items-center space-x-4">
            
            {/* Notification Bell */}
            <button className="relative p-3 bg-gray-100/80 backdrop-blur-xl rounded-xl border border-gray-200 hover:bg-gray-200/80 transition-all duration-300 group">
              <BellIcon className="w-5 h-5 text-gray-700 group-hover:text-gray-900" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
            </button>

            {/* Coupon */}
            <button className="relative p-3 bg-gray-100/80 backdrop-blur-xl rounded-xl border border-gray-200 hover:bg-gray-200/80 transition-all duration-300 group">
              <TicketIcon className="w-5 h-5 text-gray-700 group-hover:text-gray-900" />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-gray-600 text-white text-xs rounded-full flex items-center justify-center font-bold">2</span>
            </button>

            {/* User Menu */}
            <div className="relative">
              {isAuthenticated ? (
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 p-3 bg-gray-600/90 backdrop-blur-xl rounded-xl border border-gray-500 hover:bg-gray-700 transition-all duration-300"
                >
                  <UserCircleIcon className="w-5 h-5 text-white" />
                  <span className="hidden md:block text-white font-medium">{user?.full_name?.split(' ')[0] || 'User'}</span>
                  <ChevronDownIcon className="w-4 h-4 text-white" />
                </button>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link
                    href="/login"
                    className="flex items-center space-x-2 px-4 py-3 bg-white/90 backdrop-blur-xl rounded-xl border border-gray-200 hover:bg-gray-100/80 transition-all duration-300 group"
                  >
                    <ArrowRightOnRectangleIcon className="w-5 h-5 text-gray-700 group-hover:text-gray-900" />
                    <span className="hidden md:block text-gray-700 font-medium group-hover:text-gray-900">Login</span>
                  </Link>
                  <Link
                    href="/register"
                    className="flex items-center space-x-2 px-4 py-3 bg-gray-600/90 backdrop-blur-xl rounded-xl border border-gray-500 hover:bg-gray-700 transition-all duration-300"
                  >
                    <UserPlusIcon className="w-5 h-5 text-white" />
                    <span className="hidden md:block text-white font-medium">Sign Up</span>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-3 bg-gray-100/80 backdrop-blur-xl rounded-xl border border-gray-200 hover:bg-gray-200/80 transition-all duration-300"
            >
              {isMenuOpen ? (
                <XMarkIcon className="w-5 h-5 text-gray-700" />
              ) : (
                <Bars3Icon className="w-5 h-5 text-gray-700" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white/95 backdrop-blur-xl border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
            
            {/* Mobile Search */}
            <form onSubmit={handleSearch}>
              <div className="relative flex items-center bg-gray-100/80 backdrop-blur-xl border border-gray-200 rounded-xl">
                <MagnifyingGlassIcon className="w-5 h-5 text-gray-500 ml-4" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for services near you"
                  className="flex-1 px-4 py-3 bg-transparent border-0 outline-none text-gray-900 placeholder-gray-500"
                />
                <button
                  type="submit"
                  className="bg-gray-600 text-white px-6 py-3 rounded-r-xl font-medium hover:bg-gray-700"
                >
                  Search
                </button>
              </div>
            </form>

            {/* Mobile Location */}
            <div>
              <div className="flex items-center space-x-2 mb-3">
                <MapPinIcon className="w-5 h-5 text-gray-700" />
                <span className="text-gray-900 font-medium">Location</span>
              </div>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full px-4 py-3 bg-gray-100/80 backdrop-blur-xl border border-gray-200 rounded-xl text-gray-900 outline-none"
              >
                {locations.map((location) => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
            </div>

            {/* Mobile Auth */}
            {!isAuthenticated && (
              <div className="flex space-x-4">
                <Link
                  href="/login"
                  className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-gray-100/80 backdrop-blur-xl rounded-xl border border-gray-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <ArrowRightOnRectangleIcon className="w-5 h-5 text-gray-700" />
                  <span className="text-gray-900 font-medium">Login</span>
                </Link>
                <Link
                  href="/register"
                  className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-gray-600/90 backdrop-blur-xl rounded-xl border border-gray-500"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <UserPlusIcon className="w-5 h-5 text-white" />
                  <span className="text-white font-medium">Sign Up</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
