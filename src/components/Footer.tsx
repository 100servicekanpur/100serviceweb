'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { 
  PhoneIcon,
  EnvelopeIcon,
  ArrowRightIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'

export default function Footer() {
  const [email, setEmail] = useState('')
  const [isSubscribed, setIsSubscribed] = useState(false)

  const usefulLinks = [
    { name: 'About Us', href: '/about' },
    { name: 'Blog', href: '/blog' },
    { name: 'Careers', href: '/careers' },
    { name: 'Contact', href: '/contact' }
  ]

  const quickLinks = [
    { name: 'FAQs', href: '/faq' },
    { name: 'Support', href: '/support' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'How it Works', href: '/how-it-works' }
  ]

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setIsSubscribed(true)
      setEmail('')
      setTimeout(() => setIsSubscribed(false), 3000)
    }
  }

  return (
    <footer className="bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-white/5 to-gray-300/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-gray-500/10 to-white/5 rounded-full blur-3xl"></div>
      </div>

      {/* Main Footer */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Left: Logo & Tagline */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center space-x-3 mb-8">
              <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-4 shadow-lg border border-gray-200/50">
                <Image 
                  src="https://ipyoocasncbxgczhaftj.supabase.co/storage/v1/object/public/100service/100servicelogo.png"
                  alt="100Service Logo"
                  width={140}
                  height={40}
                  priority
                  className="h-12 w-auto"
                />
              </div>
            </Link>
            
            <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-4">
              Your Service, Anytime
            </h3>

            <p className="text-gray-300 mb-8 leading-relaxed text-lg">
              Professional home services at your doorstep. Quality, reliability, and convenience when you need it most.
            </p>

            {/* Newsletter Signup */}
            <div className="mb-8">
              <h4 className="text-xl font-bold text-white mb-6">Stay Updated</h4>
              <form onSubmit={handleSubscribe} className="flex">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 px-6 py-4 rounded-l-2xl bg-gray-800/60 backdrop-blur-xl text-white border border-gray-600/50 focus:outline-none focus:ring-2 focus:ring-white focus:border-white placeholder-gray-400"
                  required
                />
                <button
                  type="submit"
                  className="bg-gradient-to-r from-white to-gray-200 text-black px-8 py-4 rounded-r-2xl font-semibold hover:from-gray-200 hover:to-gray-300 transition-all duration-300 flex items-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  {isSubscribed ? (
                    <CheckCircleIcon className="w-6 h-6" />
                  ) : (
                    <ArrowRightIcon className="w-6 h-6" />
                  )}
                </button>
              </form>
              
              {isSubscribed && (
                <p className="text-gray-300 mt-4 text-sm font-medium">✨ Thank you for subscribing!</p>
              )}
            </div>
          </div>

          {/* Center: Useful Links */}
          <div className="lg:col-span-1">
            <h4 className="text-xl font-bold text-white mb-8">Useful Links</h4>
            <ul className="space-y-5">
              {usefulLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-all duration-300 flex items-center group text-lg"
                  >
                    <span className="border-b border-transparent group-hover:border-white transition-all duration-300 pb-1">
                      {link.name}
                    </span>
                    <ArrowRightIcon className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Center: Quick Links */}
          <div className="lg:col-span-1">
            <h4 className="text-xl font-bold text-white mb-8">Quick Links</h4>
            <ul className="space-y-5">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-all duration-300 flex items-center group text-lg"
                  >
                    <span className="border-b border-transparent group-hover:border-white transition-all duration-300 pb-1">
                      {link.name}
                    </span>
                    <ArrowRightIcon className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Right: Contact Info & Social */}
          <div className="lg:col-span-1">
            <h4 className="text-xl font-bold text-white mb-8">Contact Info</h4>
            
            {/* Contact Details */}
            <div className="space-y-6 mb-10">
              <div className="flex items-start space-x-4 group">
                <div className="w-12 h-12 bg-gradient-to-r from-gray-700 to-gray-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:from-gray-600 group-hover:to-gray-500 transition-all duration-300">
                  <PhoneIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <a 
                    href="tel:+911234567890" 
                    className="text-gray-300 hover:text-white transition-colors duration-300 text-lg font-medium"
                  >
                    +91 123 456 7890
                  </a>
                  <p className="text-gray-400 text-sm mt-1">24/7 Support</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4 group">
                <div className="w-12 h-12 bg-gradient-to-r from-gray-600 to-gray-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:from-gray-500 group-hover:to-gray-400 transition-all duration-300">
                  <EnvelopeIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <a 
                    href="mailto:support@100service.com" 
                    className="text-gray-300 hover:text-white transition-colors duration-300 text-lg font-medium"
                  >
                    support@100service.com
                  </a>
                  <p className="text-gray-400 text-sm mt-1">Customer Support</p>
                </div>
              </div>
            </div>

            {/* Social Icons */}
            <div>
              <h5 className="text-xl font-bold text-white mb-6">Follow Us</h5>
              <div className="flex space-x-4">
                <a 
                  href="https://instagram.com/100service" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-600 to-gray-500 rounded-2xl blur-lg opacity-0 group-hover:opacity-75 transition-opacity duration-300"></div>
                  <div className="relative w-14 h-14 bg-gradient-to-r from-gray-700 to-gray-600 hover:from-white hover:to-gray-200 hover:text-black rounded-2xl flex items-center justify-center transition-all duration-300 transform group-hover:scale-110 shadow-lg hover:shadow-2xl">
                    <svg className="w-7 h-7 text-white group-hover:text-black transition-colors duration-300" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </div>
                </a>
                
                <a 
                  href="https://linkedin.com/company/100service" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-600 to-gray-500 rounded-2xl blur-lg opacity-0 group-hover:opacity-75 transition-opacity duration-300"></div>
                  <div className="relative w-14 h-14 bg-gradient-to-r from-gray-700 to-gray-600 hover:from-white hover:to-gray-200 hover:text-black rounded-2xl flex items-center justify-center transition-all duration-300 transform group-hover:scale-110 shadow-lg hover:shadow-2xl">
                    <svg className="w-7 h-7 text-white group-hover:text-black transition-colors duration-300" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </div>
                </a>
                
                <a 
                  href="https://facebook.com/100service" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-600 to-gray-500 rounded-2xl blur-lg opacity-0 group-hover:opacity-75 transition-opacity duration-300"></div>
                  <div className="relative w-14 h-14 bg-gradient-to-r from-gray-700 to-gray-600 hover:from-white hover:to-gray-200 hover:text-black rounded-2xl flex items-center justify-center transition-all duration-300 transform group-hover:scale-110 shadow-lg hover:shadow-2xl">
                    <svg className="w-7 h-7 text-white group-hover:text-black transition-colors duration-300" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </div>
                </a>
                
                <a 
                  href="https://twitter.com/100service" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-600 to-gray-500 rounded-2xl blur-lg opacity-0 group-hover:opacity-75 transition-opacity duration-300"></div>
                  <div className="relative w-14 h-14 bg-gradient-to-r from-gray-700 to-gray-600 hover:from-white hover:to-gray-200 hover:text-black rounded-2xl flex items-center justify-center transition-all duration-300 transform group-hover:scale-110 shadow-lg hover:shadow-2xl">
                    <svg className="w-7 h-7 text-white group-hover:text-black transition-colors duration-300" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                    </svg>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Strip with Glass Morphism */}
      <div className="relative border-t border-gray-700/50">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 to-black/80 backdrop-blur-xl"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-center md:text-left">
              <p className="text-gray-300 text-base">
                All Rights Reserved © 2025 Homivo Services OPC Private Limited
              </p>
            </div>
            
            <div className="flex items-center space-x-8">
              <Link 
                href="/privacy" 
                className="text-gray-300 hover:text-white text-base transition-colors duration-300 font-medium"
              >
                Privacy Policy
              </Link>
              <Link 
                href="/terms" 
                className="text-gray-300 hover:text-white text-base transition-colors duration-300 font-medium"
              >
                Terms of Service
              </Link>
              <Link 
                href="/sitemap" 
                className="text-gray-300 hover:text-white text-base transition-colors duration-300 font-medium"
              >
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}