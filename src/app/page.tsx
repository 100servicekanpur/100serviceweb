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
  HomeIcon
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
      
      {/* Modern Hero Section with Sophisticated White Theme */}
      <section className="relative min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100 overflow-hidden">
        {/* Elegant Background */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-72 h-72 bg-gradient-to-r from-gray-200/30 to-gray-300/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-r from-gray-400/20 to-gray-500/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-gradient-to-r from-gray-300/25 to-gray-400/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
        </div>

        <div className="relative z-10 flex items-center min-h-screen">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="text-center">
              <h1 className="text-5xl lg:text-7xl font-bold mb-8">
                <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Professional Home
                </span>
                <br />
                <span className="bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                  Services at Your
                </span>
                <br />
                <span className="bg-gradient-to-r from-black to-gray-800 bg-clip-text text-transparent">
                  Doorstep
                </span>
              </h1>
              
              <p className="text-xl lg:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
                Connect with verified professionals for all your home service needs. From cleaning to repairs, 
                we've got you covered with quality service and guaranteed satisfaction.
              </p>

              {/* Modern Search Bar */}
              <div className="max-w-2xl mx-auto mb-12">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-200/40 to-gray-300/30 rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
                  <div className="relative bg-white/80 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-2xl p-2">
                    <div className="flex items-center">
                      <MagnifyingGlassIcon className="w-6 h-6 text-gray-500 ml-4" />
                      <input
                        type="text"
                        placeholder="What service do you need today?"
                        className="flex-1 bg-transparent border-0 outline-none px-4 py-4 text-lg text-gray-900 placeholder-gray-500"
                      />
                      <button className="bg-gradient-to-r from-gray-900 to-black text-white px-8 py-4 rounded-xl font-semibold hover:from-black hover:to-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                        Search
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Action Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                <div className="group relative h-full">
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-300/30 to-gray-400/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                  <div className="relative bg-white/90 backdrop-blur-xl border border-gray-200 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 h-full flex flex-col text-center">
                    <CogIcon className="w-8 h-8 text-gray-700 mb-4 mx-auto" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Quick Repairs</h3>
                    <p className="text-gray-600 text-sm flex-grow">Emergency fixes and urgent home repairs</p>
                  </div>
                </div>

                <div className="group relative h-full">
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-400/30 to-gray-300/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                  <div className="relative bg-white/90 backdrop-blur-xl border border-gray-200 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 h-full flex flex-col text-center">
                    <SparklesIcon className="w-8 h-8 text-gray-700 mb-4 mx-auto" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Home Cleaning</h3>
                    <p className="text-gray-600 text-sm flex-grow">Professional cleaning and maintenance services</p>
                  </div>
                </div>

                <div className="group relative h-full">
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-300/30 to-gray-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                  <div className="relative bg-white/90 backdrop-blur-xl border border-gray-200 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 h-full flex flex-col text-center">
                    <HomeIcon className="w-8 h-8 text-gray-700 mb-4 mx-auto" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Home Improvement</h3>
                    <p className="text-gray-600 text-sm flex-grow">Renovation and home improvement projects</p>
                  </div>
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
      <section className="py-24 bg-gradient-to-br from-white via-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-6">
              Popular <span className="bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">Services</span>
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
                <div className="bg-gray-900/90 backdrop-blur-xl rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-800/50 hover:-translate-y-3">
                  <div className="h-48 bg-gradient-to-br from-gray-800 to-black relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-700/30 to-gray-800/20"></div>
                    <div className="absolute bottom-4 left-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-gray-600 to-gray-500 rounded-2xl flex items-center justify-center shadow-lg">
                        <service.icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-2">{service.name}</h3>
                    
                    <p className="text-gray-300 text-sm mb-4 leading-relaxed">{service.description}</p>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <StarIcon className="w-4 h-4 text-yellow-400 mr-1 fill-current" />
                        <span className="text-sm font-medium text-white">{service.rating}</span>
                        <span className="text-sm text-gray-300 ml-1">({service.reviews})</span>
                      </div>
                      <div className="text-sm text-gray-300">
                        From <span className="font-semibold text-white">₹{service.startingPrice}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center text-gray-300 font-medium group-hover:text-white transition-colors">
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

      {/* Why Choose Us - Dark Theme with Light Cards */}
      <section className="py-24 bg-gradient-to-br from-gray-900 via-gray-800 to-black relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-white/10 to-gray-300/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-gray-500/15 to-white/5 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-6">
              Why Choose <span className="bg-gradient-to-r from-gray-400 to-gray-200 bg-clip-text text-transparent">100Service?</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Experience the difference with our premium home service platform
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="group relative h-full">
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-gray-200/15 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
              <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl p-8 border border-white/50 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 text-center h-full flex flex-col">
                <div className="w-16 h-16 bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <UserGroupIcon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Trusted Professionals</h3>
                <p className="text-gray-600 text-lg leading-relaxed flex-grow">
                  All our service providers are thoroughly vetted, verified, and background-checked for your complete peace of mind.
                </p>
              </div>
            </div>
            
            <div className="group relative h-full">
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-gray-300/15 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
              <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl p-8 border border-white/50 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 text-center h-full flex flex-col">
                <div className="w-16 h-16 bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <ShieldCheckIcon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Satisfaction Guarantee</h3>
                <p className="text-gray-600 text-lg leading-relaxed flex-grow">
                  We stand behind our work with a 100% satisfaction guarantee. Your happiness is our top priority.
                </p>
              </div>
            </div>
            
            <div className="group relative h-full">
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-gray-200/15 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
              <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl p-8 border border-white/50 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 text-center h-full flex flex-col">
                <div className="w-16 h-16 bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
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
