'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  StarIcon,
  ClockIcon,
  CheckBadgeIcon,
  ArrowRightIcon,
  WrenchScrewdriverIcon,
  HomeIcon,
  BoltIcon,
  PaintBrushIcon,
  ShieldCheckIcon
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
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="relative h-96 lg:h-[500px] overflow-hidden">
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-500 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30 z-10" />
            <div className="absolute inset-0 bg-gray-800" />
            
            <div className="relative z-20 flex items-center h-full">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl">
                  <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6">
                    {slide.title}
                  </h1>
                  <p className="text-xl lg:text-2xl text-gray-300 mb-8">
                    {slide.subtitle}
                  </p>
                  <Link
                    href={slide.ctaLink}
                    className="inline-flex items-center bg-white text-black px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition duration-200"
                  >
                    {slide.cta}
                    <ArrowRightIcon className="ml-2 w-5 h-5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Featured Services */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Popular Services
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Browse our most requested home services
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredServices.map((service) => (
              <Link
                key={service.id}
                href={`/services/${service.id}`}
                className="bg-white rounded-xl shadow-sm hover:shadow-lg transition duration-200 overflow-hidden group"
              >
                <div className="h-48 bg-gray-200"></div>
                
                <div className="p-6">
                  <div className="flex items-center mb-3">
                    <service.icon className="w-8 h-8 text-black mr-3" />
                    <h3 className="text-lg font-semibold text-gray-900">{service.name}</h3>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4">{service.description}</p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <StarIcon className="w-4 h-4 text-yellow-400 mr-1" />
                      <span className="text-sm font-medium text-gray-900">{service.rating}</span>
                      <span className="text-sm text-gray-600 ml-1">({service.reviews})</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      From <span className="font-semibold text-gray-900">{service.startingPrice}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-black font-medium">
                    Book Now
                    <ArrowRightIcon className="w-4 h-4 ml-2" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Why Choose 100Service?
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckBadgeIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Verified Professionals</h3>
              <p className="text-gray-600">
                All service providers are verified and skilled professionals.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-6">
                <ShieldCheckIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Satisfaction Guarantee</h3>
              <p className="text-gray-600">
                We stand behind our work and guarantee satisfaction.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-6">
                <ClockIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">24/7 Support</h3>
              <p className="text-gray-600">
                Round-the-clock support and emergency services.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
