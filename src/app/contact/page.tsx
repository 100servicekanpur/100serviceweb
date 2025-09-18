'use client'

import React, { useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import {
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  ClockIcon,
  ChatBubbleLeftRightIcon,
  QuestionMarkCircleIcon
} from '@heroicons/react/24/outline'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    category: 'general'
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    alert('Thank you for your message! We\'ll get back to you within 24 hours.')
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
      category: 'general'
    })
    setIsSubmitting(false)
  }

  const contactInfo = [
    {
      icon: PhoneIcon,
      title: 'Phone Support',
      details: '+91 1800-100-SERVICE',
      subtitle: 'Mon-Sun: 6 AM - 10 PM',
      action: 'Call Now'
    },
    {
      icon: EnvelopeIcon,
      title: 'Email Support',
      details: 'support@100service.com',
      subtitle: 'Response within 2 hours',
      action: 'Send Email'
    },
    {
      icon: ChatBubbleLeftRightIcon,
      title: 'Live Chat',
      details: 'Chat with our team',
      subtitle: 'Available 24/7',
      action: 'Start Chat'
    },
    {
      icon: QuestionMarkCircleIcon,
      title: 'Help Center',
      details: 'Browse FAQs & Guides',
      subtitle: 'Self-service support',
      action: 'Visit Help Center'
    }
  ]

  const offices = [
    {
      city: 'Mumbai',
      address: '123 Business District, Bandra Kurla Complex, Mumbai 400051',
      phone: '+91 22 1234 5678',
      isHeadquarters: true
    },
    {
      city: 'Delhi',
      address: '456 Corporate Plaza, Connaught Place, New Delhi 110001',
      phone: '+91 11 2345 6789',
      isHeadquarters: false
    },
    {
      city: 'Bangalore',
      address: '789 Tech Park, Whitefield, Bangalore 560066',
      phone: '+91 80 3456 7890',
      isHeadquarters: false
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Get in Touch
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Have questions? Need support? Want to partner with us? We're here to help! 
              Reach out through any of our convenient contact methods.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((info, index) => (
              <div key={index} className="bg-white rounded-xl p-6 text-center shadow-sm hover:shadow-lg transition duration-200">
                <div className="flex justify-center mb-4">
                  <info.icon className="w-12 h-12 text-black" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{info.title}</h3>
                <p className="text-gray-900 font-medium mb-1">{info.details}</p>
                <p className="text-gray-600 text-sm mb-4">{info.subtitle}</p>
                <button className="text-black font-medium hover:underline">
                  {info.action}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white rounded-xl shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                    placeholder="Your full name"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                    placeholder="+91 XXXXX XXXXX"
                  />
                </div>
                
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                  >
                    <option value="general">General Inquiry</option>
                    <option value="support">Customer Support</option>
                    <option value="partnership">Partnership</option>
                    <option value="feedback">Feedback</option>
                    <option value="media">Media & Press</option>
                    <option value="careers">Careers</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                  placeholder="What can we help you with?"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black resize-none"
                  placeholder="Please provide details about your inquiry..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition duration-200 font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Sending Message...' : 'Send Message'}
              </button>
            </form>
          </div>

          {/* Office Locations & Info */}
          <div className="space-y-8">
            {/* Office Locations */}
            <div className="bg-white rounded-xl shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Offices</h2>
              <div className="space-y-6">
                {offices.map((office, index) => (
                  <div key={index} className="border-b border-gray-200 last:border-0 pb-6 last:pb-0">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{office.city}</h3>
                      {office.isHeadquarters && (
                        <span className="bg-black text-white px-2 py-1 text-xs rounded-full">
                          Headquarters
                        </span>
                      )}
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-start">
                        <MapPinIcon className="w-5 h-5 text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-600">{office.address}</span>
                      </div>
                      <div className="flex items-center">
                        <PhoneIcon className="w-5 h-5 text-gray-400 mr-2 flex-shrink-0" />
                        <span className="text-gray-600">{office.phone}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Business Hours */}
            <div className="bg-white rounded-xl shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Business Hours</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Monday - Friday</span>
                  <span className="font-medium text-gray-900">9:00 AM - 8:00 PM</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Saturday</span>
                  <span className="font-medium text-gray-900">10:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Sunday</span>
                  <span className="font-medium text-gray-900">10:00 AM - 4:00 PM</span>
                </div>
                <div className="border-t border-gray-200 pt-3 mt-4">
                  <div className="flex items-center text-green-600">
                    <ClockIcon className="w-5 h-5 mr-2" />
                    <span className="font-medium">24/7 Emergency Support Available</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-gradient-to-r from-gray-900 to-black rounded-xl p-8 text-white">
              <h2 className="text-2xl font-bold mb-6">Need Immediate Help?</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Emergency Services</h3>
                  <p className="text-gray-300 text-sm mb-3">
                    For urgent electrical, plumbing, or HVAC issues
                  </p>
                  <button className="bg-white text-black px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition duration-200">
                    Call Emergency Line
                  </button>
                </div>
                <div className="border-t border-gray-700 pt-4">
                  <h3 className="font-semibold mb-2">Existing Booking Support</h3>
                  <p className="text-gray-300 text-sm mb-3">
                    Help with your current service booking
                  </p>
                  <button className="border border-white text-white px-4 py-2 rounded-lg font-medium hover:bg-white hover:text-black transition duration-200">
                    Get Booking Help
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}