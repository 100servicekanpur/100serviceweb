'use client'

export const dynamic = 'force-dynamic'

import React, { useState, useEffect } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import AdminProtected from '@/components/admin/AdminProtected'
import { supabase } from '@/lib/supabase'
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  EyeIcon,
  StarIcon,
  ClockIcon,
  CurrencyRupeeIcon,
  TagIcon
} from '@heroicons/react/24/outline'

interface Service {
  id: string
  name: string
  description: string
  short_description?: string
  price: number
  duration_minutes: number
  is_featured: boolean
  is_active: boolean
  rating: number
  total_bookings: number
  sort_order: number
  category_id: string
  subcategory_id?: string
  created_at: string
  updated_at: string
  categories?: {
    id: string
    name: string
  }
  subcategories?: {
    id: string
    name: string
  }
}

interface Category {
  id: string
  name: string
  is_active: boolean
}

interface Subcategory {
  id: string
  name: string
  category_id: string
  is_active: boolean
}

interface ServiceForm {
  name: string
  description: string
  short_description: string
  price: number
  duration_minutes: number
  is_featured: boolean
  is_active: boolean
  category_id: string
  subcategory_id: string
  sort_order: number
}

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [subcategories, setSubcategories] = useState<Subcategory[]>([])
  const [filteredServices, setFilteredServices] = useState<Service[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [showModal, setShowModal] = useState(false)
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [serviceForm, setServiceForm] = useState<ServiceForm>({
    name: '',
    description: '',
    short_description: '',
    price: 0,
    duration_minutes: 60,
    is_featured: false,
    is_active: true,
    category_id: '',
    subcategory_id: '',
    sort_order: 0
  })
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    filterServices()
  }, [services, searchQuery, selectedCategory, selectedStatus])

  const fetchData = async () => {
    try {
      setIsLoading(true)
      
      // Fetch services with category and subcategory data
      const { data: servicesData, error: servicesError } = await supabase
        .from('services')
        .select(`
          *,
          categories:category_id (id, name),
          subcategories:subcategory_id (id, name)
        `)
        .order('sort_order', { ascending: true })

      if (servicesError) throw servicesError
      setServices(servicesData || [])

      // Fetch categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('id, name, is_active')
        .eq('is_active', true)
        .order('name', { ascending: true })

      if (categoriesError) throw categoriesError
      setCategories(categoriesData || [])

      // Fetch subcategories
      const { data: subcategoriesData, error: subcategoriesError } = await supabase
        .from('subcategories')
        .select('id, name, category_id, is_active')
        .eq('is_active', true)
        .order('name', { ascending: true })

      if (subcategoriesError) throw subcategoriesError
      setSubcategories(subcategoriesData || [])
      
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filterServices = () => {
    let filtered = services

    if (searchQuery) {
      filtered = filtered.filter(service =>
        service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.categories?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.subcategories?.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(service => service.category_id === selectedCategory)
    }

    if (selectedStatus !== 'all') {
      filtered = filtered.filter(service => {
        if (selectedStatus === 'active') return service.is_active
        if (selectedStatus === 'inactive') return !service.is_active
        if (selectedStatus === 'featured') return service.is_featured
        return true
      })
    }

    setFilteredServices(filtered)
  }

  const getSubcategoriesForCategory = (categoryId: string) => {
    return subcategories.filter(sub => sub.category_id === categoryId)
  }

  const handleAddService = () => {
    setEditingService(null)
    setServiceForm({
      name: '',
      description: '',
      short_description: '',
      price: 0,
      duration_minutes: 60,
      is_featured: false,
      is_active: true,
      category_id: '',
      subcategory_id: '',
      sort_order: services.length
    })
    setShowModal(true)
  }

  const handleEditService = (service: Service) => {
    setEditingService(service)
    setServiceForm({
      name: service.name,
      description: service.description,
      short_description: service.short_description || '',
      price: service.price,
      duration_minutes: service.duration_minutes,
      is_featured: service.is_featured,
      is_active: service.is_active,
      category_id: service.category_id,
      subcategory_id: service.subcategory_id || '',
      sort_order: service.sort_order
    })
    setShowModal(true)
  }

  const handleSaveService = async () => {
    try {
      setIsSaving(true)
      
      const serviceData = {
        ...serviceForm,
        subcategory_id: serviceForm.subcategory_id || null
      }
      
      if (editingService) {
        // Update existing service
        const { error } = await supabase
          .from('services')
          .update(serviceData)
          .eq('id', editingService.id)
        
        if (error) throw error
      } else {
        // Create new service
        const { error } = await supabase
          .from('services')
          .insert([serviceData])
        
        if (error) throw error
      }
      
      setShowModal(false)
      fetchData()
    } catch (error: any) {
      console.error('Error saving service:', error)
      alert('Error saving service. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteService = async (service: Service) => {
    if (!confirm(`Are you sure you want to delete "${service.name}"?`)) {
      return
    }

    try {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', service.id)
      
      if (error) throw error
      fetchData()
    } catch (error: any) {
      console.error('Error deleting service:', error)
      alert('Error deleting service. Please try again.')
    }
  }

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes} min`
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    if (remainingMinutes === 0) return `${hours} hr`
    return `${hours}h ${remainingMinutes}m`
  }

  if (isLoading) {
    return (
      <AdminProtected>
        <AdminLayout>
          <div className="flex items-center justify-center min-h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </AdminLayout>
      </AdminProtected>
    )
  }

  return (
    <AdminProtected>
      <AdminLayout>
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Services Management</h1>
              <p className="text-gray-600">Manage all services in your platform</p>
            </div>
            <button
              onClick={handleAddService}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <PlusIcon className="w-5 h-5" />
              Add Service
            </button>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* Search */}
            <div className="relative">
              <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="featured">Featured</option>
            </select>
          </div>

          {/* Services Table */}
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Service
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Duration
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stats
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredServices.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center">
                        <div className="text-gray-400 mb-2">
                          <TagIcon className="w-12 h-12 mx-auto" />
                        </div>
                        <p className="text-gray-600">No services found</p>
                      </td>
                    </tr>
                  ) : (
                    filteredServices.map((service) => (
                      <tr key={service.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-sm font-medium text-gray-900">
                                {service.name}
                              </h3>
                              {service.is_featured && (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                  Featured
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                              {service.short_description || service.description}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {service.categories?.name}
                            </div>
                            {service.subcategories && (
                              <div className="text-sm text-gray-600">
                                {service.subcategories.name}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1">
                            <CurrencyRupeeIcon className="w-4 h-4 text-gray-500" />
                            <span className="text-sm font-medium text-gray-900">
                              {service.price}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1">
                            <ClockIcon className="w-4 h-4 text-gray-500" />
                            <span className="text-sm text-gray-900">
                              {formatDuration(service.duration_minutes)}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            service.is_active 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {service.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            <div className="flex items-center gap-1">
                              <StarIcon className="w-4 h-4 text-yellow-400" />
                              <span>{service.rating}</span>
                            </div>
                            <div className="text-gray-600">
                              {service.total_bookings} bookings
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleEditService(service)}
                              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                              title="Edit Service"
                            >
                              <PencilIcon className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteService(service)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                              title="Delete Service"
                            >
                              <TrashIcon className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Service Modal */}
          {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <h2 className="text-xl font-bold mb-4">
                  {editingService ? 'Edit Service' : 'Add Service'}
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Name */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Service Name *
                    </label>
                    <input
                      type="text"
                      value={serviceForm.name}
                      onChange={(e) => setServiceForm(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Service name"
                    />
                  </div>
                  
                  {/* Short Description */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Short Description
                    </label>
                    <input
                      type="text"
                      value={serviceForm.short_description}
                      onChange={(e) => setServiceForm(prev => ({ ...prev, short_description: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Brief description (for cards)"
                    />
                  </div>
                  
                  {/* Full Description */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Description *
                    </label>
                    <textarea
                      value={serviceForm.description}
                      onChange={(e) => setServiceForm(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Detailed description of the service"
                      rows={4}
                    />
                  </div>
                  
                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category *
                    </label>
                    <select
                      value={serviceForm.category_id}
                      onChange={(e) => {
                        setServiceForm(prev => ({ 
                          ...prev, 
                          category_id: e.target.value,
                          subcategory_id: '' // Reset subcategory when category changes
                        }))
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select category</option>
                      {categories.map(category => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  {/* Subcategory */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Subcategory
                    </label>
                    <select
                      value={serviceForm.subcategory_id}
                      onChange={(e) => setServiceForm(prev => ({ ...prev, subcategory_id: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      disabled={!serviceForm.category_id}
                    >
                      <option value="">Select subcategory (optional)</option>
                      {getSubcategoriesForCategory(serviceForm.category_id).map(subcategory => (
                        <option key={subcategory.id} value={subcategory.id}>
                          {subcategory.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  {/* Price */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price (₹) *
                    </label>
                    <input
                      type="number"
                      value={serviceForm.price}
                      onChange={(e) => setServiceForm(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  
                  {/* Duration */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Duration (minutes) *
                    </label>
                    <input
                      type="number"
                      value={serviceForm.duration_minutes}
                      onChange={(e) => setServiceForm(prev => ({ ...prev, duration_minutes: parseInt(e.target.value) || 60 }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      min="1"
                    />
                  </div>
                  
                  {/* Checkboxes */}
                  <div className="md:col-span-2">
                    <div className="flex gap-6">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="service-active"
                          checked={serviceForm.is_active}
                          onChange={(e) => setServiceForm(prev => ({ ...prev, is_active: e.target.checked }))}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="service-active" className="ml-2 block text-sm text-gray-900">
                          Active
                        </label>
                      </div>
                      
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="service-featured"
                          checked={serviceForm.is_featured}
                          onChange={(e) => setServiceForm(prev => ({ ...prev, is_featured: e.target.checked }))}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="service-featured" className="ml-2 block text-sm text-gray-900">
                          Featured
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end gap-3 mt-6">
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                    disabled={isSaving}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveService}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    disabled={isSaving || !serviceForm.name.trim() || !serviceForm.description.trim() || !serviceForm.category_id}
                  >
                    {isSaving ? 'Saving...' : 'Save'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </AdminLayout>
    </AdminProtected>
  )
}