'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
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
      
      {/* Hero Section - Two Column Layout */}
      <section className="bg-white py-12 lg:py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            
            {/* Left Side - Home Cleaning & Other Services */}
            <div className="space-y-4">
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-6">
                Our Top Services
              </h2>
              
              <div className="grid grid-cols-1 gap-4">
                {/* Home Cleaning - Main Category */}
                <div className="group p-4 bg-white rounded-xl border border-gray-200 hover:border-gray-300 transition-all duration-300 hover:shadow-md">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 relative flex-shrink-0 overflow-hidden rounded-lg border border-gray-100">
                      <Image 
                        src="https://ipyoocasncbxgczhaftj.supabase.co/storage/v1/object/public/subcat/homecleaning.1705553535.png"
                        alt="Home Cleaning Services"
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900">Home Cleaning</h3>
                      <p className="text-sm text-gray-600">Professional cleaning services for your home</p>
                    </div>
                  </div>
                  
                  {/* Home Cleaning Subcategories */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 ml-4">
                    {/* Kitchen Cleaning */}
                    <Link href="/services?subcategory=kitchen-cleaning" className="group/sub flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                      <div className="w-10 h-10 relative flex-shrink-0 overflow-hidden rounded-lg">
                        <Image 
                          src="https://ipyoocasncbxgczhaftj.supabase.co/storage/v1/object/public/subcat/kitchen%20cleaning%20services%20by%20100service.1726715584.png"
                          alt="Kitchen Cleaning"
                          fill
                          className="object-cover group-hover/sub:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-semibold text-gray-800">Kitchen Cleaning</h4>
                        <p className="text-xs text-gray-600">Deep kitchen sanitization</p>
                      </div>
                    </Link>
                    
                    {/* Sofa Cleaning */}
                    <Link href="/services?subcategory=sofa-cleaning" className="group/sub flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                      <div className="w-10 h-10 relative flex-shrink-0 overflow-hidden rounded-lg">
                        <Image 
                          src="https://ipyoocasncbxgczhaftj.supabase.co/storage/v1/object/public/subcat/sofa%20cleaning.1697609434.png"
                          alt="Sofa Cleaning"
                          fill
                          className="object-cover group-hover/sub:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-semibold text-gray-800">Sofa Cleaning</h4>
                        <p className="text-xs text-gray-600">Professional upholstery care</p>
                      </div>
                    </Link>
                    
                    {/* Water Tank Cleaning */}
                    <Link href="/services?subcategory=water-tank-cleaning" className="group/sub flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                      <div className="w-10 h-10 relative flex-shrink-0 overflow-hidden rounded-lg">
                        <Image 
                          src="https://ipyoocasncbxgczhaftj.supabase.co/storage/v1/object/public/subcat/water%20tank%20cleaning.1726546913.png"
                          alt="Water Tank Cleaning"
                          fill
                          className="object-cover group-hover/sub:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-semibold text-gray-800">Water Tank Cleaning</h4>
                        <p className="text-xs text-gray-600">Safe water storage cleaning</p>
                      </div>
                    </Link>
                  </div>
                </div>

                {/* AC Service */}
                <Link href="/services?category=ac-service" className="group flex items-center space-x-4 p-4 bg-white rounded-xl border border-gray-200 hover:border-gray-300 transition-all duration-300 hover:shadow-md cursor-pointer">
                  <div className="w-12 h-12 relative flex-shrink-0 overflow-hidden rounded-lg border border-gray-100">
                    <Image 
                      src="https://ipyoocasncbxgczhaftj.supabase.co/storage/v1/object/public/subcat/expertacservice.1707633065.png"
                      alt="AC Service"
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900">AC Service</h3>
                    <p className="text-sm text-gray-600">Expert AC repair and maintenance</p>
                  </div>
                </Link>

                {/* Car Wash */}
                <Link href="/services?category=car-wash" className="group flex items-center space-x-4 p-4 bg-white rounded-xl border border-gray-200 hover:border-gray-300 transition-all duration-300 hover:shadow-md cursor-pointer">
                  <div className="w-12 h-12 relative flex-shrink-0 overflow-hidden rounded-lg border border-gray-100">
                    <Image 
                      src="https://ipyoocasncbxgczhaftj.supabase.co/storage/v1/object/public/subcat/car%20wash.athome.png"
                      alt="Car Wash"
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900">Car Wash</h3>
                    <p className="text-sm text-gray-600">Professional car cleaning at home</p>
                  </div>
                </Link>
              </div>
            </div>

            {/* Right Side - 6 Service Banners - Optimized for 1280x720 */}
            <div className="space-y-3">
              <h2 className="text-xl lg:text-2xl font-bold text-gray-900 mb-4">
                All Categories
              </h2>
              
              <div className="grid grid-cols-2 grid-rows-3 gap-2">
                {/* AC Services */}
                <div className="group relative overflow-hidden rounded-md border border-gray-200 hover:border-gray-300 transition-all duration-300 hover:shadow-md cursor-pointer">
                  <div className="aspect-[16/9] relative">
                    <Image 
                      src="https://ipyoocasncbxgczhaftj.supabase.co/storage/v1/object/public/categories/ac.webp"
                      alt="AC Services"
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </div>

                {/* Car Wash */}
                <div className="group relative overflow-hidden rounded-md border border-gray-200 hover:border-gray-300 transition-all duration-300 hover:shadow-md cursor-pointer">
                  <div className="aspect-[16/9] relative">
                    <Image 
                      src="https://ipyoocasncbxgczhaftj.supabase.co/storage/v1/object/public/categories/car%20wash.webp"
                      alt="Car Wash"
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </div>

                {/* Care Clean */}
                <div className="group relative overflow-hidden rounded-md border border-gray-200 hover:border-gray-300 transition-all duration-300 hover:shadow-md cursor-pointer">
                  <div className="aspect-[16/9] relative">
                    <Image 
                      src="https://ipyoocasncbxgczhaftj.supabase.co/storage/v1/object/public/categories/care%20clean.jpg"
                      alt="Care Clean"
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </div>

                {/* Cleaning */}
                <div className="group relative overflow-hidden rounded-md border border-gray-200 hover:border-gray-300 transition-all duration-300 hover:shadow-md cursor-pointer">
                  <div className="aspect-[16/9] relative">
                    <Image 
                      src="https://ipyoocasncbxgczhaftj.supabase.co/storage/v1/object/public/categories/cleaning.webp"
                      alt="Cleaning"
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </div>

                {/* Home Clean */}
                <div className="group relative overflow-hidden rounded-md border border-gray-200 hover:border-gray-300 transition-all duration-300 hover:shadow-md cursor-pointer">
                  <div className="aspect-[16/9] relative">
                    <Image 
                      src="https://ipyoocasncbxgczhaftj.supabase.co/storage/v1/object/public/categories/home%20clean.webp"
                      alt="Home Clean"
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </div>

                {/* Kitchen */}
                <div className="group relative overflow-hidden rounded-md border border-gray-200 hover:border-gray-300 transition-all duration-300 hover:shadow-md cursor-pointer">
                  <div className="aspect-[16/9] relative">
                    <Image 
                      src="https://ipyoocasncbxgczhaftj.supabase.co/storage/v1/object/public/categories/kitchen.jpg"
                      alt="Kitchen Services"
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Services Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Popular Services
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Services that our customers love and trust
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {/* Home Cleaning */}
            <Link href="/services?category=home-cleaning" className="group bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <div className="aspect-square relative mb-3 overflow-hidden rounded-lg">
                <Image 
                  src="https://ipyoocasncbxgczhaftj.supabase.co/storage/v1/object/public/subcat/homecleaning.1705553535.png"
                  alt="Home Cleaning"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h3 className="text-sm font-semibold text-gray-900 text-center">Home Cleaning</h3>
              <p className="text-xs text-gray-600 text-center mt-1">₹299 onwards</p>
            </Link>

            {/* AC Service */}
            <Link href="/services?category=ac-service" className="group bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <div className="aspect-square relative mb-3 overflow-hidden rounded-lg">
                <Image 
                  src="https://ipyoocasncbxgczhaftj.supabase.co/storage/v1/object/public/subcat/expertacservice.1707633065.png"
                  alt="AC Service"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h3 className="text-sm font-semibold text-gray-900 text-center">AC Service</h3>
              <p className="text-xs text-gray-600 text-center mt-1">₹499 onwards</p>
            </Link>

            {/* Sofa Cleaning */}
            <Link href="/services?subcategory=sofa-cleaning" className="group bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <div className="aspect-square relative mb-3 overflow-hidden rounded-lg">
                <Image 
                  src="https://ipyoocasncbxgczhaftj.supabase.co/storage/v1/object/public/subcat/sofa%20cleaning.1697609434.png"
                  alt="Sofa Cleaning"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h3 className="text-sm font-semibold text-gray-900 text-center">Sofa Cleaning</h3>
              <p className="text-xs text-gray-600 text-center mt-1">₹199 onwards</p>
            </Link>

            {/* Kitchen Cleaning */}
            <Link href="/services?subcategory=kitchen-cleaning" className="group bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <div className="aspect-square relative mb-3 overflow-hidden rounded-lg">
                <Image 
                  src="https://ipyoocasncbxgczhaftj.supabase.co/storage/v1/object/public/subcat/kitchen%20cleaning%20services%20by%20100service.1726715584.png"
                  alt="Kitchen Cleaning"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h3 className="text-sm font-semibold text-gray-900 text-center">Kitchen Cleaning</h3>
              <p className="text-xs text-gray-600 text-center mt-1">₹599 onwards</p>
            </Link>

            {/* Water Tank Cleaning */}
            <Link href="/services?subcategory=water-tank-cleaning" className="group bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <div className="aspect-square relative mb-3 overflow-hidden rounded-lg">
                <Image 
                  src="https://ipyoocasncbxgczhaftj.supabase.co/storage/v1/object/public/subcat/water%20tank%20cleaning.1726546913.png"
                  alt="Water Tank Cleaning"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h3 className="text-sm font-semibold text-gray-900 text-center">Water Tank Cleaning</h3>
              <p className="text-xs text-gray-600 text-center mt-1">₹799 onwards</p>
            </Link>

            {/* Car Wash */}
            <Link href="/services?category=car-wash" className="group bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <div className="aspect-square relative mb-3 overflow-hidden rounded-lg">
                <Image 
                  src="https://ipyoocasncbxgczhaftj.supabase.co/storage/v1/object/public/subcat/car%20wash.athome.png"
                  alt="Car Wash"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h3 className="text-sm font-semibold text-gray-900 text-center">Car Wash</h3>
              <p className="text-xs text-gray-600 text-center mt-1">₹399 onwards</p>
            </Link>
          </div>
        </div>
      </section>

      {/* Most Booked Services Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Most Booked Services
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Top choice services with highest customer satisfaction
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Kitchen Cleaning */}
            <Link href="/services?subcategory=kitchen-cleaning" className="group bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="w-16 h-16 relative flex-shrink-0 overflow-hidden rounded-xl mr-4">
                  <Image 
                    src="https://ipyoocasncbxgczhaftj.supabase.co/storage/v1/object/public/subcat/kitchen%20cleaning%20services%20by%20100service.1726715584.png"
                    alt="Kitchen Cleaning"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">Kitchen Cleaning</h3>
                  <p className="text-sm text-gray-600">Deep cleaning & sanitization</p>
                </div>
              </div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-1">
                  <div className="flex space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <span className="text-sm font-medium text-gray-900">4.9</span>
                  <span className="text-sm text-gray-600">(1.2k bookings)</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-xl font-bold text-gray-900">₹599</div>
                <div className="text-sm bg-green-100 text-green-800 px-3 py-1 rounded-full font-medium">Most Popular</div>
              </div>
            </Link>

            {/* Water Tank Cleaning */}
            <Link href="/services?subcategory=water-tank-cleaning" className="group bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="w-16 h-16 relative flex-shrink-0 overflow-hidden rounded-xl mr-4">
                  <Image 
                    src="https://ipyoocasncbxgczhaftj.supabase.co/storage/v1/object/public/subcat/water%20tank%20cleaning.1726546913.png"
                    alt="Water Tank Cleaning"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">Water Tank Cleaning</h3>
                  <p className="text-sm text-gray-600">Safe & hygienic water storage</p>
                </div>
              </div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-1">
                  <div className="flex space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <span className="text-sm font-medium text-gray-900">4.8</span>
                  <span className="text-sm text-gray-600">(850 bookings)</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-xl font-bold text-gray-900">₹799</div>
                <div className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">Trending</div>
              </div>
            </Link>

            {/* AC Repair & Service */}
            <Link href="/services?category=ac-service" className="group bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="w-16 h-16 relative flex-shrink-0 overflow-hidden rounded-xl mr-4">
                  <Image 
                    src="https://ipyoocasncbxgczhaftj.supabase.co/storage/v1/object/public/subcat/expertacservice.1707633065.png"
                    alt="AC Service"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">AC Repair & Service</h3>
                  <p className="text-sm text-gray-600">Expert maintenance & repair</p>
                </div>
              </div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-1">
                  <div className="flex space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <span className="text-sm font-medium text-gray-900">4.7</span>
                  <span className="text-sm text-gray-600">(2.1k bookings)</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-xl font-bold text-gray-900">₹499</div>
                <div className="text-sm bg-red-100 text-red-800 px-3 py-1 rounded-full font-medium">High Demand</div>
              </div>
            </Link>
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
