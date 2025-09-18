'use client'

import React from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import {
  CheckBadgeIcon,
  StarIcon,
  UserGroupIcon,
  ClockIcon,
  ShieldCheckIcon,
  HeartIcon,
  TrophyIcon
} from '@heroicons/react/24/outline'

export default function AboutPage() {
  const stats = [
    { label: 'Happy Customers', value: '50,000+', icon: UserGroupIcon },
    { label: 'Services Completed', value: '100,000+', icon: CheckBadgeIcon },
    { label: 'Expert Professionals', value: '5,000+', icon: StarIcon },
    { label: 'Cities Covered', value: '25+', icon: TrophyIcon }
  ]

  const values = [
    {
      title: 'Quality First',
      description: 'We ensure every service meets the highest standards of quality and professionalism.',
      icon: CheckBadgeIcon
    },
    {
      title: 'Trusted Professionals',
      description: 'All our service providers are thoroughly vetted, verified, and highly skilled.',
      icon: ShieldCheckIcon
    },
    {
      title: '24/7 Support',
      description: 'Round-the-clock customer support to help you whenever you need assistance.',
      icon: ClockIcon
    },
    {
      title: 'Customer Satisfaction',
      description: 'Your satisfaction is our priority. We go above and beyond to exceed expectations.',
      icon: HeartIcon
    }
  ]

  const team = [
    {
      name: 'Rajesh Kumar',
      role: 'CEO & Founder',
      image: '/api/placeholder/300/300',
      description: 'Visionary leader with 15+ years in the service industry, dedicated to transforming home services.'
    },
    {
      name: 'Priya Sharma',
      role: 'Head of Operations',
      image: '/api/placeholder/300/300',
      description: 'Expert in operations management, ensuring seamless service delivery across all locations.'
    },
    {
      name: 'Amit Patel',
      role: 'Technology Director',
      image: '/api/placeholder/300/300',
      description: 'Tech innovator building the platform that connects customers with trusted professionals.'
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
              About 100Service
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              We&apos;re on a mission to make home services simple, reliable, and accessible for everyone. 
              Connecting you with trusted professionals who deliver exceptional results.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-gray-900 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4">
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-gray-300">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  Founded in 2020, 100Service was born from a simple idea: home services should be 
                  hassle-free, transparent, and reliable. We noticed that finding trustworthy 
                  professionals for home repairs and maintenance was often stressful and uncertain.
                </p>
                <p>
                  Starting in Mumbai, we began building a network of verified professionals who 
                  shared our commitment to quality and customer satisfaction. Today, we&apos;re proud 
                  to serve customers across 25+ cities, having completed over 100,000 services 
                  with a 4.8-star average rating.
                </p>
                <p>
                  Our platform combines cutting-edge technology with human expertise to ensure 
                  every interaction is smooth, every professional is qualified, and every customer 
                  is delighted with the service they receive.
                </p>
              </div>
            </div>
            <div className="bg-gray-200 h-96 rounded-xl flex items-center justify-center">
              <span className="text-gray-500">Company Story Image</span>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              These core values guide everything we do and shape our commitment to excellence.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white rounded-xl p-6 text-center shadow-sm hover:shadow-lg transition duration-200">
                <div className="flex justify-center mb-4">
                  <value.icon className="w-12 h-12 text-black" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The passionate people behind 100Service, working tirelessly to transform the home services industry.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div key={index} className="text-center">
                <div className="w-48 h-48 bg-gray-200 rounded-full mx-auto mb-6"></div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{member.name}</h3>
                <p className="text-black font-medium mb-3">{member.role}</p>
                <p className="text-gray-600">{member.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-gradient-to-r from-black to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Our Mission</h2>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto mb-8">
            To revolutionize the home services industry by creating a seamless platform that connects 
            homeowners with trusted professionals, ensuring quality, reliability, and peace of mind 
            in every interaction.
          </p>
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserGroupIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">For Customers</h3>
              <p className="text-gray-300">Reliable, vetted professionals at your fingertips with transparent pricing and guaranteed quality.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrophyIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">For Professionals</h3>
              <p className="text-gray-300">A platform to grow your business, connect with customers, and showcase your expertise.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <HeartIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">For Communities</h3>
              <p className="text-gray-300">Building stronger neighborhoods through trusted connections and quality service delivery.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Ready to Experience the 100Service Difference?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of satisfied customers who trust us for their home service needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition duration-200 font-semibold">
              Browse Services
            </button>
            <button className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-50 transition duration-200 font-semibold">
              Contact Us
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}