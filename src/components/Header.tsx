'use client'

import React, { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { SignInButton, SignUpButton, UserButton, SignedIn, SignedOut } from '@clerk/nextjs'
import {
  MagnifyingGlassIcon,
  XMarkIcon,
  MapPinIcon,
  ShoppingCartIcon
} from '@heroicons/react/24/outline'

export default function Header() {
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isScrolled, setIsScrolled] = useState(false)
  const [location, setLocation] = useState<string>('Getting location...')
  const [isLoadingLocation, setIsLoadingLocation] = useState(true)
  const [placeholderText, setPlaceholderText] = useState('')
  const [currentServiceIndex, setCurrentServiceIndex] = useState(0)
  const [isTyping, setIsTyping] = useState(true)
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false)
  const [manualLocation, setManualLocation] = useState('')

  // Service types for animated placeholder
  const serviceTypes = useMemo(() => [
    'Sofa Cleaning',
    'Home Cleaning',
    'Plumbing',
    'Electrical Work',
    'AC Repair',
    'Painting',
    'Pest Control',
    'Gardening'
  ], [])

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Get user location automatically
  useEffect(() => {
    const getLocation = async () => {
      try {
        if (!navigator.geolocation) {
          setLocation('Location not supported')
          setIsLoadingLocation(false)
          return
        }

        // Get user's current position
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords
            
            try {
              // Use reverse geocoding to get readable address
              const response = await fetch(
                `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
              )
              
              if (response.ok) {
                const data = await response.json()
                const cityName = data.city || data.locality || data.principalSubdivision || 'Unknown Location'
                setLocation(cityName)
              } else {
                setLocation('Location unavailable')
              }
            } catch (geocodingError) {
              console.error('Error getting location name:', geocodingError)
              setLocation('Location unavailable')
            } finally {
              setIsLoadingLocation(false)
            }
          },
          (error) => {
            console.error('Geolocation error:', error)
            switch (error.code) {
              case error.PERMISSION_DENIED:
                setLocation('Location access denied')
                break
              case error.POSITION_UNAVAILABLE:
                setLocation('Location unavailable')
                break
              case error.TIMEOUT:
                setLocation('Location timeout')
                break
              default:
                setLocation('Location error')
                break
            }
            setIsLoadingLocation(false)
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 300000 // Cache for 5 minutes
          }
        )
      } catch (setupError) {
        console.error('Location setup error:', setupError)
        setLocation('Location unavailable')
        setIsLoadingLocation(false)
      }
    }

    getLocation()
  }, [])

  // Animated placeholder text effect
  useEffect(() => {
    const currentService = serviceTypes[currentServiceIndex]
    const baseText = 'Search for '
    let currentText = baseText
    let charIndex = 0
    
    const typeText = () => {
      if (isTyping) {
        // Typing phase
        if (charIndex < currentService.length) {
          currentText = baseText + currentService.substring(0, charIndex + 1)
          setPlaceholderText(currentText)
          charIndex++
          setTimeout(typeText, 100) // Typing speed
        } else {
          // Pause before erasing
          setTimeout(() => setIsTyping(false), 2000)
        }
      } else {
        // Erasing phase
        if (charIndex > 0) {
          currentText = baseText + currentService.substring(0, charIndex - 1)
          setPlaceholderText(currentText)
          charIndex--
          setTimeout(typeText, 50) // Erasing speed (faster)
        } else {
          // Move to next service
          setCurrentServiceIndex((prev) => (prev + 1) % serviceTypes.length)
          setIsTyping(true)
          charIndex = 0
        }
      }
    }

    typeText()
  }, [currentServiceIndex, isTyping, serviceTypes])

  const refreshLocation = () => {
    setIsLoadingLocation(true)
    setLocation('Getting location...')
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords
        
        try {
          const response = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
          )
          
          if (response.ok) {
            const data = await response.json()
            const cityName = data.city || data.locality || data.principalSubdivision || 'Unknown Location'
            setLocation(cityName)
          } else {
            setLocation('Location unavailable')
          }
        } catch (refreshError) {
          console.error('Error refreshing location:', refreshError)
          setLocation('Location unavailable')
        } finally {
          setIsLoadingLocation(false)
        }
      },
      () => {
        setLocation('Location access denied')
        setIsLoadingLocation(false)
      },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }

  const setManualLocationHandler = () => {
    if (manualLocation.trim()) {
      setLocation(manualLocation.trim())
      setManualLocation('')
      setIsLocationModalOpen(false)
    }
  }

  const handleLocationClick = () => {
    setIsLocationModalOpen(true)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/services?search=${encodeURIComponent(searchQuery)}`)
    }
  }

  return (
    <header className={`sticky top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white shadow-xl border-b border-gray-200 backdrop-blur-sm' 
        : 'bg-white shadow-lg backdrop-blur-sm'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          
          {/* Left: Logo */}
          <div className="flex items-center space-x-3">
            <Link href="/" className="flex items-center">
              <Image 
                src="https://ipyoocasncbxgczhaftj.supabase.co/storage/v1/object/public/100service/100servicelogo.png"
                alt="100Service Logo"
                width={140}
                height={36}
                priority
                className="h-10 w-auto"
              />
            </Link>
            
            {/* Location Text (Clickable for Options) */}
            <div className="hidden sm:flex items-center space-x-1">
              <button 
                onClick={handleLocationClick}
                className="flex items-center space-x-1 hover:text-gray-800 transition-colors cursor-pointer"
                title="Click to set location"
              >
                <MapPinIcon className={`w-4 h-4 ${isLoadingLocation ? 'text-gray-400 animate-pulse' : 'text-gray-600'}`} />
                <span className="text-sm text-gray-600 font-medium">
                  {isLoadingLocation ? 'Loading...' : location}
                </span>
              </button>
            </div>
          </div>

          {/* Center: Search Bar (Desktop) */}
          <div className="hidden md:flex items-center flex-1 max-w-2xl mx-6 lg:mx-12">
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative flex items-center bg-gradient-to-r from-gray-50 to-gray-100 border-2 border-gray-200 rounded-full hover:border-gray-400 focus-within:border-gray-600 focus-within:shadow-lg transition-all duration-300 shadow-sm">
                <MagnifyingGlassIcon className="w-5 h-5 text-gray-500 ml-5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={placeholderText}
                  className="flex-1 px-4 py-3.5 bg-transparent border-0 outline-none text-gray-900 placeholder-gray-400 font-medium text-base"
                />
                <button
                  type="submit"
                  className="bg-gradient-to-r from-gray-900 to-black text-white px-5 py-3.5 rounded-full font-semibold hover:from-black hover:to-gray-800 transition-all duration-300 shadow-md hover:shadow-lg mr-1.5"
                >
                  <MagnifyingGlassIcon className="w-5 h-5" />
                </button>
              </div>
            </form>
          </div>

          {/* Right: iOS-style Icons */}
          <div className="flex items-center space-x-2">

            {/* Search Icon (Mobile) */}
            <button 
              className="md:hidden p-2.5 rounded-full hover:bg-gray-100 hover:shadow-sm transition-all duration-200"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <XMarkIcon className="w-6 h-6 text-gray-700" />
              ) : (
                <MagnifyingGlassIcon className="w-6 h-6 text-gray-700" />
              )}
            </button>

            {/* Cart Icon */}
            <button className="p-2.5 rounded-full hover:bg-gray-100 hover:shadow-sm transition-all duration-200 relative">
              <ShoppingCartIcon className="w-6 h-6 text-gray-700" />
              {/* Cart badge */}
              <span className="absolute -top-0.5 -right-0.5 bg-gray-900 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center border-2 border-white shadow-sm font-medium">
                0
              </span>
            </button>

            {/* Authentication */}
            <SignedOut>
              <SignInButton mode="modal">
                <button className="p-2.5 rounded-full hover:bg-gray-100 hover:shadow-sm transition-all duration-200 text-sm font-medium text-gray-700">
                  Sign In
                </button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <UserButton 
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: "w-8 h-8",
                  },
                }}
              />
            </SignedIn>

          </div>
        </div>
      </div>

      {/* Mobile Search Overlay */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-lg">
          <div className="px-4 py-5">
            <form onSubmit={handleSearch}>
              <div className="relative flex items-center bg-gradient-to-r from-gray-50 to-gray-100 border-2 border-gray-200 rounded-full hover:border-gray-400 focus-within:border-gray-600 focus-within:shadow-lg transition-all duration-300 shadow-sm">
                <MagnifyingGlassIcon className="w-5 h-5 text-gray-500 ml-5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={placeholderText}
                  className="flex-1 px-4 py-3.5 bg-transparent border-0 outline-none text-gray-900 placeholder-gray-400 font-medium text-base"
                />
                <button
                  type="submit"
                  className="bg-gradient-to-r from-gray-900 to-black text-white px-5 py-3.5 rounded-full font-semibold hover:from-black hover:to-gray-800 transition-all duration-300 shadow-md hover:shadow-lg mr-1.5"
                >
                  <MagnifyingGlassIcon className="w-5 h-5" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Location Modal */}
      {isLocationModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[80vh] my-auto overflow-y-auto">
            <div className="p-6">
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Set Your Location</h3>
                <button 
                  onClick={() => setIsLocationModalOpen(false)}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <XMarkIcon className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Current Location */}
              <div className="mb-6">
                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                  <MapPinIcon className={`w-5 h-5 ${isLoadingLocation ? 'text-gray-400 animate-pulse' : 'text-gray-800'}`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {isLoadingLocation ? 'Detecting location...' : location}
                    </p>
                    <p className="text-xs text-gray-500">Current location</p>
                  </div>
                </div>
              </div>

              {/* Auto Detect Button */}
              <div className="mb-4">
                <button
                  onClick={() => {
                    refreshLocation()
                    setIsLocationModalOpen(false)
                  }}
                  className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-gray-900 text-white rounded-lg hover:bg-black transition-colors font-medium"
                  disabled={isLoadingLocation}
                >
                  <MapPinIcon className="w-5 h-5" />
                  <span>{isLoadingLocation ? 'Detecting...' : 'Auto Detect Location'}</span>
                </button>
              </div>

              {/* Divider */}
              <div className="flex items-center mb-4">
                <div className="flex-1 border-t border-gray-200"></div>
                <span className="px-3 text-sm text-gray-500">or</span>
                <div className="flex-1 border-t border-gray-200"></div>
              </div>

              {/* Manual Location Input */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enter Location Manually
                </label>
                <input
                  type="text"
                  value={manualLocation}
                  onChange={(e) => setManualLocation(e.target.value)}
                  placeholder="e.g., Mumbai, Delhi, Bangalore"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      setManualLocationHandler()
                    }
                  }}
                />
              </div>

              {/* Set Manual Location Button */}
              <button
                onClick={setManualLocationHandler}
                disabled={!manualLocation.trim()}
                className="w-full py-3 px-4 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Set Location
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}