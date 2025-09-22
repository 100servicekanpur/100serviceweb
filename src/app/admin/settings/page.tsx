'use client'

export const dynamic = 'force-dynamic'

import React, { useState, useEffect } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import AdminProtected from '@/components/admin/AdminProtected'
import { mongodb } from '@/lib/mongodb'
import {
  Cog6ToothIcon,
  GlobeAltIcon,
  CurrencyRupeeIcon,
  BellIcon,
  ShieldCheckIcon,
  DocumentTextIcon,
  CheckIcon
} from '@heroicons/react/24/outline'

interface SiteSettings {
  id?: string
  site_name: string
  site_description: string
  site_logo: string
  site_favicon: string
  contact_email: string
  contact_phone: string
  contact_address: string
  currency: string
  tax_rate: number
  commission_rate: number
  min_booking_amount: number
  max_booking_amount: number
  allow_cancellation: boolean
  cancellation_hours: number
  email_notifications: boolean
  sms_notifications: boolean
  maintenance_mode: boolean
  registration_enabled: boolean
  provider_approval_required: boolean
  service_approval_required: boolean
  meta_title: string
  meta_description: string
  meta_keywords: string
  google_analytics_id: string
  facebook_pixel_id: string
  terms_of_service: string
  privacy_policy: string
  refund_policy: string
  created_at?: string
  updated_at?: string
}

const defaultSettings: SiteSettings = {
  site_name: '100Service',
  site_description: 'Professional home services at your doorstep',
  site_logo: '',
  site_favicon: '',
  contact_email: 'support@100service.com',
  contact_phone: '+91-9999999999',
  contact_address: 'Tilak Nagar, Kanpur, UP, India',
  currency: 'INR',
  tax_rate: 18,
  commission_rate: 15,
  min_booking_amount: 100,
  max_booking_amount: 50000,
  allow_cancellation: true,
  cancellation_hours: 24,
  email_notifications: true,
  sms_notifications: true,
  maintenance_mode: false,
  registration_enabled: true,
  provider_approval_required: true,
  service_approval_required: true,
  meta_title: '100Service - Home Services at Your Doorstep',
  meta_description: 'Book trusted professionals for home services in Kanpur. From cleaning to repairs, we\'ve got you covered.',
  meta_keywords: 'home services, cleaning, repairs, maintenance, Kanpur',
  google_analytics_id: '',
  facebook_pixel_id: '',
  terms_of_service: '',
  privacy_policy: '',
  refund_policy: ''
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('general')
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      setIsLoading(true)
      // TODO: Implement MongoDB settings fetch
      // For now, set default settings
      const defaultSettings = {
        site_name: '100 Service',
        site_description: 'Your trusted home service provider',
        site_logo: '',
        site_favicon: '',
        contact_email: 'contact@100service.com',
        contact_phone: '+91-1234567890',
        contact_address: '',
        currency: 'INR',
        tax_rate: 0,
        commission_rate: 0,
        min_booking_amount: 100,
        max_booking_amount: 50000,
        allow_cancellation: true,
        cancellation_hours: 24,
        email_notifications: true,
        sms_notifications: false,
        maintenance_mode: false,
        registration_enabled: true,
        provider_approval_required: true,
        service_approval_required: true,
        meta_title: '100 Service',
        meta_description: 'Professional home services',
        meta_keywords: 'home service, cleaning, repair',
        google_analytics_id: '',
        facebook_pixel_id: '',
        terms_of_service: '',
        privacy_policy: '',
        refund_policy: ''
      }
      setSettings(defaultSettings)
    } catch (error) {
      console.error('Error fetching settings:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const saveSettings = async () => {
    try {
      setIsSaving(true)
      
      // TODO: Implement MongoDB settings save
      console.log('Saving settings:', settings)
      
      setShowSuccessMessage(true)
      setTimeout(() => setShowSuccessMessage(false), 3000)
    } catch (error) {
      console.error('Error saving settings:', error)
      alert('Error saving settings. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleInputChange = (field: keyof SiteSettings, value: string | number | boolean) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const tabs = [
    { id: 'general', name: 'General', icon: Cog6ToothIcon },
    { id: 'business', name: 'Business', icon: CurrencyRupeeIcon },
    { id: 'notifications', name: 'Notifications', icon: BellIcon },
    { id: 'security', name: 'Security', icon: ShieldCheckIcon },
    { id: 'seo', name: 'SEO', icon: GlobeAltIcon },
    { id: 'policies', name: 'Policies', icon: DocumentTextIcon },
  ]

  if (isLoading) {
    return (
      <AdminProtected>
        <AdminLayout>
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading settings...</p>
            </div>
          </div>
        </AdminLayout>
      </AdminProtected>
    )
  }

  return (
    <AdminProtected>
      <AdminLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Site Settings</h1>
                <p className="text-gray-600 mt-2">Configure your platform settings and preferences</p>
              </div>
              <button
                onClick={saveSettings}
                disabled={isSaving}
                className="bg-gray-900 text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>

          {/* Success Message */}
          {showSuccessMessage && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center">
                <CheckIcon className="w-5 h-5 text-green-600 mr-2" />
                <p className="text-green-800">Settings saved successfully!</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Tabs Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <nav className="space-y-1">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center px-4 py-3 text-sm font-medium text-left transition-colors ${
                        activeTab === tab.id
                          ? 'bg-gray-900 text-white'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <tab.icon className={`mr-3 h-5 w-5 ${activeTab === tab.id ? 'text-white' : 'text-gray-400'}`} />
                      {tab.name}
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Settings Content */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                
                {/* General Settings */}
                {activeTab === 'general' && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold text-gray-900">General Settings</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Site Name</label>
                        <input
                          type="text"
                          value={settings.site_name}
                          onChange={(e) => handleInputChange('site_name', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Contact Email</label>
                        <input
                          type="email"
                          value={settings.contact_email}
                          onChange={(e) => handleInputChange('contact_email', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Site Description</label>
                      <textarea
                        value={settings.site_description}
                        onChange={(e) => handleInputChange('site_description', e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Contact Phone</label>
                        <input
                          type="text"
                          value={settings.contact_phone}
                          onChange={(e) => handleInputChange('contact_phone', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                        <select
                          value={settings.currency}
                          onChange={(e) => handleInputChange('currency', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                        >
                          <option value="INR">INR (₹)</option>
                          <option value="USD">USD ($)</option>
                          <option value="EUR">EUR (€)</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Contact Address</label>
                      <textarea
                        value={settings.contact_address}
                        onChange={(e) => handleInputChange('contact_address', e.target.value)}
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                )}

                {/* Business Settings */}
                {activeTab === 'business' && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold text-gray-900">Business Settings</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Tax Rate (%)</label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          step="0.01"
                          value={settings.tax_rate}
                          onChange={(e) => handleInputChange('tax_rate', parseFloat(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Commission Rate (%)</label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          step="0.01"
                          value={settings.commission_rate}
                          onChange={(e) => handleInputChange('commission_rate', parseFloat(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Cancellation Hours</label>
                        <input
                          type="number"
                          min="0"
                          value={settings.cancellation_hours}
                          onChange={(e) => handleInputChange('cancellation_hours', parseInt(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Booking Amount</label>
                        <input
                          type="number"
                          min="0"
                          value={settings.min_booking_amount}
                          onChange={(e) => handleInputChange('min_booking_amount', parseFloat(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Maximum Booking Amount</label>
                        <input
                          type="number"
                          min="0"
                          value={settings.max_booking_amount}
                          onChange={(e) => handleInputChange('max_booking_amount', parseFloat(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="allow_cancellation"
                          checked={settings.allow_cancellation}
                          onChange={(e) => handleInputChange('allow_cancellation', e.target.checked)}
                          className="h-4 w-4 text-gray-600 focus:ring-gray-500 border-gray-300 rounded"
                        />
                        <label htmlFor="allow_cancellation" className="ml-2 block text-sm text-gray-700">
                          Allow booking cancellations
                        </label>
                      </div>
                      
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="provider_approval_required"
                          checked={settings.provider_approval_required}
                          onChange={(e) => handleInputChange('provider_approval_required', e.target.checked)}
                          className="h-4 w-4 text-gray-600 focus:ring-gray-500 border-gray-300 rounded"
                        />
                        <label htmlFor="provider_approval_required" className="ml-2 block text-sm text-gray-700">
                          Require admin approval for new providers
                        </label>
                      </div>
                      
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="service_approval_required"
                          checked={settings.service_approval_required}
                          onChange={(e) => handleInputChange('service_approval_required', e.target.checked)}
                          className="h-4 w-4 text-gray-600 focus:ring-gray-500 border-gray-300 rounded"
                        />
                        <label htmlFor="service_approval_required" className="ml-2 block text-sm text-gray-700">
                          Require admin approval for new services
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {/* Notification Settings */}
                {activeTab === 'notifications' && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold text-gray-900">Notification Settings</h2>
                    
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="email_notifications"
                          checked={settings.email_notifications}
                          onChange={(e) => handleInputChange('email_notifications', e.target.checked)}
                          className="h-4 w-4 text-gray-600 focus:ring-gray-500 border-gray-300 rounded"
                        />
                        <label htmlFor="email_notifications" className="ml-2 block text-sm text-gray-700">
                          Enable email notifications
                        </label>
                      </div>
                      
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="sms_notifications"
                          checked={settings.sms_notifications}
                          onChange={(e) => handleInputChange('sms_notifications', e.target.checked)}
                          className="h-4 w-4 text-gray-600 focus:ring-gray-500 border-gray-300 rounded"
                        />
                        <label htmlFor="sms_notifications" className="ml-2 block text-sm text-gray-700">
                          Enable SMS notifications
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {/* Security Settings */}
                {activeTab === 'security' && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold text-gray-900">Security Settings</h2>
                    
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="maintenance_mode"
                          checked={settings.maintenance_mode}
                          onChange={(e) => handleInputChange('maintenance_mode', e.target.checked)}
                          className="h-4 w-4 text-gray-600 focus:ring-gray-500 border-gray-300 rounded"
                        />
                        <label htmlFor="maintenance_mode" className="ml-2 block text-sm text-gray-700">
                          Enable maintenance mode
                        </label>
                      </div>
                      
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="registration_enabled"
                          checked={settings.registration_enabled}
                          onChange={(e) => handleInputChange('registration_enabled', e.target.checked)}
                          className="h-4 w-4 text-gray-600 focus:ring-gray-500 border-gray-300 rounded"
                        />
                        <label htmlFor="registration_enabled" className="ml-2 block text-sm text-gray-700">
                          Allow new user registrations
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {/* SEO Settings */}
                {activeTab === 'seo' && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold text-gray-900">SEO Settings</h2>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Meta Title</label>
                      <input
                        type="text"
                        value={settings.meta_title}
                        onChange={(e) => handleInputChange('meta_title', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Meta Description</label>
                      <textarea
                        value={settings.meta_description}
                        onChange={(e) => handleInputChange('meta_description', e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Meta Keywords</label>
                      <input
                        type="text"
                        value={settings.meta_keywords}
                        onChange={(e) => handleInputChange('meta_keywords', e.target.value)}
                        placeholder="Separate keywords with commas"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Google Analytics ID</label>
                        <input
                          type="text"
                          value={settings.google_analytics_id}
                          onChange={(e) => handleInputChange('google_analytics_id', e.target.value)}
                          placeholder="GA-XXXXXXXXX-X"
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Facebook Pixel ID</label>
                        <input
                          type="text"
                          value={settings.facebook_pixel_id}
                          onChange={(e) => handleInputChange('facebook_pixel_id', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Policies */}
                {activeTab === 'policies' && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold text-gray-900">Legal Policies</h2>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Terms of Service</label>
                      <textarea
                        value={settings.terms_of_service}
                        onChange={(e) => handleInputChange('terms_of_service', e.target.value)}
                        rows={6}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                        placeholder="Enter your terms of service..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Privacy Policy</label>
                      <textarea
                        value={settings.privacy_policy}
                        onChange={(e) => handleInputChange('privacy_policy', e.target.value)}
                        rows={6}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                        placeholder="Enter your privacy policy..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Refund Policy</label>
                      <textarea
                        value={settings.refund_policy}
                        onChange={(e) => handleInputChange('refund_policy', e.target.value)}
                        rows={6}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                        placeholder="Enter your refund policy..."
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </AdminLayout>
    </AdminProtected>
  )
}