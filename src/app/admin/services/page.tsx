'use client'

import React, { useState, useEffect } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import RoleProtected from '@/components/admin/RoleProtected'
import { mongodb } from '@/lib/mongodb'
import {
  CogIcon,
  MagnifyingGlassIcon,
  CheckIcon,
  XMarkIcon,
  ClockIcon,
  FunnelIcon,
  EyeIcon,
  TrashIcon
} from '@heroicons/react/24/outline'
import type { Service } from '@/lib/mongodb-types'

interface ServiceWithDetails extends Service {
  providerName?: string
  categoryName?: string
}

export default function ServicesPage() {
  const [services, setServices] = useState<ServiceWithDetails[]>([])
  const [filteredServices, setFilteredServices] = useState<ServiceWithDetails[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'approved' | 'pending' | 'rejected'>('all')
  const [selectedService, setSelectedService] = useState<ServiceWithDetails | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)

  useEffect(() => {
    fetchServices()
  }, [])

  useEffect(() => {
    filterServices()
  }, [services, searchTerm, statusFilter])

  const fetchServices = async () => {
    try {
      setIsLoading(true)
      const servicesList = await mongodb.getAllServicesWithDetails()
      
      // Add mock provider and category names since we don't have them in the current data structure
      const servicesWithDetails = servicesList.map(service => ({
        ...service,
        providerName: `Provider ${service.providerId}`,
        categoryName: service.categoryId || 'Uncategorized'
      }))
      
      setServices(servicesWithDetails)
    } catch (error) {
      console.error('Error fetching services:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filterServices = () => {
    let filtered = services

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(service =>
        service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.categoryName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.providerName?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(service => service.status === statusFilter)
    }

    setFilteredServices(filtered)
  }

  const handleApproveService = async (serviceId: string) => {
    try {
      await mongodb.updateServiceStatus(serviceId, 'approved')
      await fetchServices()
    } catch (error) {
      console.error('Error approving service:', error)
    }
  }

  const handleRejectService = async (serviceId: string) => {
    try {
      await mongodb.updateServiceStatus(serviceId, 'rejected')
      await fetchServices()
    } catch (error) {
      console.error('Error rejecting service:', error)
    }
  }

  const handleDeleteService = async (serviceId: string) => {
    if (confirm('Are you sure you want to delete this service?')) {
      try {
        await mongodb.deleteService(serviceId)
        await fetchServices()
      } catch (error) {
        console.error('Error deleting service:', error)
      }
    }
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckIcon className="w-4 h-4" />
      case 'pending':
        return <ClockIcon className="w-4 h-4" />
      case 'rejected':
        return <XMarkIcon className="w-4 h-4" />
      default:
        return null
    }
  }

  return (
    <RoleProtected requiredRole="admin">
      <AdminLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Service Management</h1>
                <p className="text-gray-600 mt-2">Review and manage all services in the system</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-500">
                  Total Services: {filteredServices.length}
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-yellow-400 rounded-full mr-2"></div>
                    <span className="text-sm text-gray-600">
                      Pending: {filteredServices.filter(s => s.status === 'pending').length}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search services by title, description, or category..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Status Filter */}
              <div className="flex items-center space-x-2">
                <FunnelIcon className="w-5 h-5 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="approved">Approved</option>
                  <option value="pending">Pending</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>
          </div>

          {/* Services Table */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {isLoading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading services...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Service
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Provider
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Created
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredServices.map((service) => (
                      <tr key={service._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {service.title}
                            </div>
                            <div className="text-sm text-gray-500 truncate max-w-xs">
                              {service.description}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{service.providerName}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{service.categoryName}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            ₹{service.price?.toLocaleString() || 'N/A'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(service.status)}`}>
                            {getStatusIcon(service.status)}
                            <span className="ml-1">{service.status.charAt(0).toUpperCase() + service.status.slice(1)}</span>
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(service.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => {
                                setSelectedService(service)
                                setIsDetailModalOpen(true)
                              }}
                              className="text-blue-600 hover:text-blue-900"
                              title="View Details"
                            >
                              <EyeIcon className="h-4 w-4" />
                            </button>
                            {service.status === 'pending' && (
                              <>
                                <button
                                  onClick={() => service._id && handleApproveService(service._id)}
                                  className="text-green-600 hover:text-green-900"
                                  title="Approve"
                                >
                                  <CheckIcon className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => service._id && handleRejectService(service._id)}
                                  className="text-red-600 hover:text-red-900"
                                  title="Reject"
                                >
                                  <XMarkIcon className="h-4 w-4" />
                                </button>
                              </>
                            )}
                            <button
                              onClick={() => service._id && handleDeleteService(service._id)}
                              className="text-red-600 hover:text-red-900"
                              title="Delete"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {filteredServices.length === 0 && !isLoading && (
                  <div className="text-center py-8">
                    <CogIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No services found</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Try adjusting your search or filter criteria.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Service Detail Modal */}
        {isDetailModalOpen && selectedService && (
          <ServiceDetailModal
            service={selectedService}
            onClose={() => setIsDetailModalOpen(false)}
            onApprove={() => {
              if (selectedService._id) {
                handleApproveService(selectedService._id)
                setIsDetailModalOpen(false)
              }
            }}
            onReject={() => {
              if (selectedService._id) {
                handleRejectService(selectedService._id)
                setIsDetailModalOpen(false)
              }
            }}
          />
        )}
      </AdminLayout>
    </RoleProtected>
  )
}

// Service Detail Modal Component
function ServiceDetailModal({ service, onClose, onApprove, onReject }: {
  service: ServiceWithDetails
  onClose: () => void
  onApprove: () => void
  onReject: () => void
}) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Service Details</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <p className="text-sm text-gray-900">{service.title}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <p className="text-sm text-gray-900">{service.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <p className="text-sm text-gray-900">{service.categoryName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                <p className="text-sm text-gray-900">₹{service.price?.toLocaleString() || 'N/A'}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Provider</label>
                <p className="text-sm text-gray-900">{service.providerName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(service.status)}`}>
                  {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Created</label>
              <p className="text-sm text-gray-900">{new Date(service.createdAt).toLocaleString()}</p>
            </div>

            {service.status === 'pending' && (
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button
                  onClick={onReject}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg"
                >
                  Reject Service
                </button>
                <button
                  onClick={onApprove}
                  className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg"
                >
                  Approve Service
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function getStatusBadgeColor(status: string) {
  switch (status) {
    case 'approved':
      return 'bg-green-100 text-green-800'
    case 'pending':
      return 'bg-yellow-100 text-yellow-800'
    case 'rejected':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}
