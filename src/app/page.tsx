'use client'

import React from 'react'
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
  ScissorsIcon,
  ComputerDesktopIcon
} from '@heroicons/react/24/outline'

export default function Home() {
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

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section - Modern Black & White Premium Design */}
      <section className="relative bg-gradient-to-br from-gray-900 via-black to-gray-800 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 py-24 lg:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl lg:text-7xl font-bold text-white mb-8 leading-tight">
              Premium Home Services
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300">
                At Your Doorstep
              </span>
            </h1>
            <p className="text-xl lg:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Experience luxury home maintenance with our certified professionals. 
              Quality service, transparent pricing, guaranteed satisfaction.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link
                href="/services"
                className="group relative px-8 py-4 bg-white text-black font-semibold rounded-full hover:bg-gray-100 transition-all duration-300 flex items-center space-x-3 shadow-xl"
              >
                <span>Book Premium Service</span>
                <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <div className="flex items-center space-x-2 text-white">
                <div className="flex space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="text-gray-300">4.9/5 from 10,000+ customers</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/3 rounded-full blur-3xl"></div>
      </section>

      {/* Service Categories - Modern Grid */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Professional Services
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Premium quality services delivered by certified experts
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
            <div className="group bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 cursor-pointer">
              <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mb-4 group-hover:bg-gray-800 transition-colors">
                <WrenchScrewdriverIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Home Repair</h3>
              <p className="text-gray-600 text-sm">Expert repairs for all home issues</p>
            </div>

            <div className="group bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 cursor-pointer">
              <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mb-4 group-hover:bg-gray-800 transition-colors">
                <BoltIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Electrical</h3>
              <p className="text-gray-600 text-sm">Licensed electricians available</p>
            </div>

            <div className="group bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 cursor-pointer">
              <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mb-4 group-hover:bg-gray-800 transition-colors">
                <ScissorsIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Beauty & Spa</h3>
              <p className="text-gray-600 text-sm">Premium salon services</p>
            </div>

            <div className="group bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 cursor-pointer">
              <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mb-4 group-hover:bg-gray-800 transition-colors">
                <ComputerDesktopIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Tech Support</h3>
              <p className="text-gray-600 text-sm">Computer & device repairs</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Services - Premium Cards */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Featured Services
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover our most popular premium services
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {featuredServices.map((service) => (
              <Link
                key={service.id}
                href={`/services/${service.id}`}
                className="group bg-gradient-to-br from-gray-50 to-white rounded-3xl p-8 shadow-sm border border-gray-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mr-4 group-hover:bg-gray-800 transition-colors">
                    <service.icon className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">{service.name}</h3>
                    <p className="text-gray-600">{service.description}</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <StarIcon key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <span className="text-sm font-medium text-gray-900">{service.rating}</span>
                    <span className="text-sm text-gray-600">({service.reviews} reviews)</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600">Starting from</div>
                    <div className="text-2xl font-bold text-gray-900">₹{service.startingPrice}</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-black font-semibold group-hover:text-gray-800 transition-colors">
                    Book Now
                    <ArrowRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                  <div className="text-sm text-green-600 font-medium">Available Today</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us - Modern Design */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Why Choose 100Service?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Premium service quality that exceeds expectations
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="group text-center bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-300">
              <div className="w-20 h-20 bg-gradient-to-br from-black to-gray-800 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <CheckBadgeIcon className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Verified Professionals</h3>
              <p className="text-gray-600 leading-relaxed">
                All service providers are thoroughly vetted, certified, and insured professionals with proven track records.
              </p>
            </div>
            
            <div className="group text-center bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-300">
              <div className="w-20 h-20 bg-gradient-to-br from-black to-gray-800 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <ShieldCheckIcon className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">100% Satisfaction Guarantee</h3>
              <p className="text-gray-600 leading-relaxed">
                We stand behind our work with a comprehensive satisfaction guarantee and dedicated customer support.
              </p>
            </div>
            
            <div className="group text-center bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-300">
              <div className="w-20 h-20 bg-gradient-to-br from-black to-gray-800 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <ClockIcon className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">24/7 Emergency Support</h3>
              <p className="text-gray-600 leading-relaxed">
                Round-the-clock availability for urgent repairs and emergency services when you need us most.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
