'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import {
  StarIcon,
  ClockIcon,
  CheckBadgeIcon,
  ArrowRightIcon,
  WrenchScrewdriverIcon,
  BoltIcon,
  ShieldCheckIcon,
  MagnifyingGlassIcon,
  UserGroupIcon,
  CogIcon,
  SparklesIcon,
  HomeIcon,
  ScissorsIcon,
  BeakerIcon,
  ComputerDesktopIcon
} from '@heroicons/react/24/outline'

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0)

  const heroSlides = [
    {
      title: "Professional Home Services at Your Doorstep",
      subtitle: "Trusted experts for all your home repair and maintenance needs",
      cta: "Book a Service",
      ctaLink: "/services"
    },
    {
      title: "Emergency Services Available 24/7", 
      subtitle: "Urgent repairs? We're here when you need us most",
      cta: "Emergency Help",
      ctaLink: "/contact"
    }
  ]

  const featuredServices = [
    {
      id: 1,
      name: "Electrical Services",
      description: "Professional electricians for repairs & installations",
      icon: BoltIcon,
      startingPrice: 299,
      rating: 4.8,
      reviews: 1250
    },
    {
      id: 2, 
      name: "Plumbing Services",
      description: "Expert plumbers for leaks & installations",
      icon: WrenchScrewdriverIcon,
      startingPrice: 199,
      rating: 4.9,
      reviews: 980
    }
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [heroSlides.length])

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section - Two Column Layout */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            
            {/* Left Column */}
            <div className="space-y-8">
              {/* Main Heading */}
              <div>
                <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Home services at your doorstep
                </h1>
                <p className="text-lg lg:text-xl text-gray-600 mt-6 leading-relaxed">
                  Professional, reliable, and affordable home services delivered by verified experts in your area.
                </p>
              </div>

              {/* Service Categories Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="group bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer">
                  <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-3 group-hover:bg-gray-200 group-hover:scale-110 transition-all duration-300">
                    <ScissorsIcon className="w-6 h-6 text-gray-700" />
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900">Women's Salon & Spa</h3>
                </div>

                <div className="group bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer">
                  <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-3 group-hover:bg-gray-200 group-hover:scale-110 transition-all duration-300">
                    <UserGroupIcon className="w-6 h-6 text-gray-700" />
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900">Men's Salon & Massage</h3>
                </div>

                <div className="group bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer">
                  <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-3 group-hover:bg-gray-200 group-hover:scale-110 transition-all duration-300">
                    <CogIcon className="w-6 h-6 text-gray-700" />
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900">AC & Appliance Repair</h3>
                </div>

                <div className="group bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer">
                  <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-3 group-hover:bg-gray-200 group-hover:scale-110 transition-all duration-300">
                    <SparklesIcon className="w-6 h-6 text-gray-700" />
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900">Cleaning</h3>
                </div>

                <div className="group bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer">
                  <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-3 group-hover:bg-gray-200 group-hover:scale-110 transition-all duration-300">
                    <WrenchScrewdriverIcon className="w-6 h-6 text-gray-700" />
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900">Electrician, Plumber & Carpenter</h3>
                </div>

                <div className="group bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer">
                  <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-3 group-hover:bg-gray-200 group-hover:scale-110 transition-all duration-300">
                    <ComputerDesktopIcon className="w-6 h-6 text-gray-700" />
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900">Freelance/Digital Services</h3>
                </div>
              </div>
            </div>

            {/* Right Column - Image Grid */}
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-lg">
                    <img 
                      src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
                      alt="Professional massage service"
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-lg">
                    <img 
                      src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
                      alt="Home cleaning service"
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                </div>
                <div className="space-y-4 pt-8">
                  <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-lg">
                    <img 
                      src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
                      alt="AC repair service"
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-lg">
                    <img 
                      src="https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
                      alt="Freelance digital work"
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Stats Strip */}
          <div className="mt-16 lg:mt-24">
            <div className="bg-gray-50 rounded-3xl p-8 lg:p-12">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <StarIcon className="w-6 h-6 text-gray-900 mr-2" />
                    <span className="text-3xl lg:text-4xl font-bold text-gray-900">4.9</span>
                  </div>
                  <p className="text-gray-600 text-sm lg:text-base">Average Rating</p>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <UserGroupIcon className="w-6 h-6 text-gray-900 mr-2" />
                    <span className="text-3xl lg:text-4xl font-bold text-gray-900">50K+</span>
                  </div>
                  <p className="text-gray-600 text-sm lg:text-base">Happy Customers</p>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <CheckBadgeIcon className="w-6 h-6 text-gray-900 mr-2" />
                    <span className="text-3xl lg:text-4xl font-bold text-gray-900">5K+</span>
                  </div>
                  <p className="text-gray-600 text-sm lg:text-base">Expert Providers</p>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <ClockIcon className="w-6 h-6 text-gray-900 mr-2" />
                    <span className="text-3xl lg:text-4xl font-bold text-gray-900">24/7</span>
                  </div>
                  <p className="text-gray-600 text-sm lg:text-base">Support Available</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modern Statistics Section - Light Theme */}
      <section className="py-24 bg-gradient-to-br from-gray-100 via-gray-50 to-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-r from-gray-300/20 to-gray-400/15 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-64 h-64 bg-gradient-to-r from-gray-400/25 to-gray-500/20 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-6">
              Trusted by <span className="bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">Thousands</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Join the growing community of satisfied customers who trust us with their most important home services
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-gray-200/40 to-gray-300/30 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
              <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl p-8 border border-gray-200 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-gray-700 to-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <CogIcon className="w-8 h-8 text-white" />
                </div>
                <div className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">150+</div>
                <div className="text-xl font-semibold text-gray-800 mb-2">Services Available</div>
                <div className="text-gray-600">Across 50+ categories</div>
              </div>
            </div>

            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-gray-300/40 to-gray-200/30 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
              <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl p-8 border border-gray-200 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-gray-700 to-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <CheckBadgeIcon className="w-8 h-8 text-white" />
                </div>
                <div className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">50,000+</div>
                <div className="text-xl font-semibold text-gray-800 mb-2">Happy Customers</div>
                <div className="text-gray-600">5-star rated experiences</div>
              </div>
            </div>

            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-gray-200/40 to-gray-400/30 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
              <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl p-8 border border-gray-200 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-gray-700 to-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <ShieldCheckIcon className="w-8 h-8 text-white" />
                </div>
                <div className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">5,000+</div>
                <div className="text-xl font-semibold text-gray-800 mb-2">Expert Providers</div>
                <div className="text-gray-600">Verified professionals</div>
              </div>
            </div>

            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-gray-300/40 to-gray-300/30 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
              <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl p-8 border border-gray-200 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-gray-700 to-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <StarIcon className="w-8 h-8 text-white" />
                </div>
                <div className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">4.9★</div>
                <div className="text-xl font-semibold text-gray-800 mb-2">Average Rating</div>
                <div className="text-gray-600">Based on 50k+ reviews</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Services - Modern White Theme */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Popular Services
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Browse our most requested home services with verified professionals
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredServices.map((service) => (
              <Link
                key={service.id}
                href={`/services/${service.id}`}
                className="group"
              >
                <div className="bg-white rounded-3xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-500 overflow-hidden hover:-translate-y-3">
                  <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-50/30 to-gray-100/20"></div>
                    <div className="absolute bottom-4 left-4">
                      <div className="w-12 h-12 bg-gray-900 rounded-2xl flex items-center justify-center shadow-lg">
                        <service.icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{service.name}</h3>
                    
                    <p className="text-gray-600 text-sm mb-4 leading-relaxed">{service.description}</p>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <StarIcon className="w-4 h-4 text-gray-900 mr-1 fill-current" />
                        <span className="text-sm font-medium text-gray-900">{service.rating}</span>
                        <span className="text-sm text-gray-600 ml-1">({service.reviews})</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        From <span className="font-semibold text-gray-900">₹{service.startingPrice}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center text-gray-600 font-medium group-hover:text-gray-900 transition-colors">
                      Book Now
                      <ArrowRightIcon className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us - Light Theme */}
      <section className="py-24 bg-gray-50 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-gray-200/30 to-gray-300/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-gray-300/25 to-gray-200/15 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Why Choose 100Service?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Experience the difference with our premium home service platform
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="group relative h-full">
              <div className="absolute inset-0 bg-gradient-to-r from-gray-200/40 to-gray-300/30 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
              <div className="relative bg-white backdrop-blur-xl rounded-3xl p-8 border border-gray-200 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 text-center h-full flex flex-col">
                <div className="w-16 h-16 bg-gray-900 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <UserGroupIcon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Trusted Professionals</h3>
                <p className="text-gray-600 text-lg leading-relaxed flex-grow">
                  All our service providers are thoroughly vetted, verified, and background-checked for your complete peace of mind.
                </p>
              </div>
            </div>
            
            <div className="group relative h-full">
              <div className="absolute inset-0 bg-gradient-to-r from-gray-300/40 to-gray-200/30 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
              <div className="relative bg-white backdrop-blur-xl rounded-3xl p-8 border border-gray-200 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 text-center h-full flex flex-col">
                <div className="w-16 h-16 bg-gray-900 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <ShieldCheckIcon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Satisfaction Guarantee</h3>
                <p className="text-gray-600 text-lg leading-relaxed flex-grow">
                  We stand behind our work with a 100% satisfaction guarantee. Your happiness is our top priority.
                </p>
              </div>
            </div>
            
            <div className="group relative h-full">
              <div className="absolute inset-0 bg-gradient-to-r from-gray-200/40 to-gray-300/30 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
              <div className="relative bg-white backdrop-blur-xl rounded-3xl p-8 border border-gray-200 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 text-center h-full flex flex-col">
                <div className="w-16 h-16 bg-gray-900 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <ClockIcon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">24/7 Support</h3>
                <p className="text-gray-600 text-lg leading-relaxed flex-grow">
                  Round-the-clock customer support and emergency services whenever you need us most.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
