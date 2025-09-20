'use client'

export const dynamic = 'force-dynamic'

import React, { useState, useEffect } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import AdminProtected from '@/components/admin/AdminProtected'
import { supabase } from '@/lib/supabase'
import {
  MagnifyingGlassIcon,
  PlusIcon,
  TrashIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline'

interface User {
  id: string
  email: string
  full_name: string
  phone?: string
  role: 'customer' | 'provider' | 'admin'
  is_verified: boolean
  provider_status?: 'pending' | 'approved' | 'rejected' | 'suspended'
  skills?: string[]
  experience_years?: number
  hourly_rate?: number
  bio?: string
  city?: string
  state?: string
  created_at: string
}

interface Service {
  id: string
  name: string
  category: string
}

interface ProviderService {
  id: string
  provider_id: string
  service_id: string
  service?: Service
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [providerServices, setProviderServices] = useState<ProviderService[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRole, setSelectedRole] = useState<string>('all')
  const [selectedProviderStatus, setSelectedProviderStatus] = useState<string>('all')
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showProviderModal, setShowProviderModal] = useState(false)
  const [showServiceAssignModal, setShowServiceAssignModal] = useState(false)
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([])

  useEffect(() => {
    fetchUsers()
    fetchServices()
    fetchProviderServices()
  }, [])

  useEffect(() => {
    filterUsers()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [users, searchQuery, selectedRole, selectedProviderStatus])

  const fetchUsers = async () => {
    try {
      setIsLoading(true)
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setUsers(data || [])
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('id, name, category')
        .order('name')

      if (error) throw error
      setServices(data || [])
    } catch (error) {
      console.error('Error fetching services:', error)
    }
  }

  const fetchProviderServices = async () => {
    try {
      const { data, error } = await supabase
        .from('provider_services')
        .select(`
          id,
          provider_id,
          service_id,
          services:service_id (
            id,
            name,
            category
          )
        `)

      if (error) throw error
      setProviderServices(data || [])
    } catch (error) {
      console.error('Error fetching provider services:', error)
    }
  }

  const filterUsers = () => {
    let filtered = users

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(user =>
        user.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.phone?.includes(searchQuery)
      )
    }

    // Filter by role
    if (selectedRole !== 'all') {
      filtered = filtered.filter(user => user.role === selectedRole)
    }

    // Filter by provider status (only for providers)
    if (selectedProviderStatus !== 'all' && selectedRole === 'provider') {
      filtered = filtered.filter(user => user.provider_status === selectedProviderStatus)
    }

    setFilteredUsers(filtered)
  }

  const handleUpdateUserRole = async (userId: string, newRole: string) => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ role: newRole })
        .eq('id', userId)

      if (error) throw error

      // Update local state
      setUsers(users.map(user => 
        user.id === userId ? { ...user, role: newRole as 'customer' | 'provider' | 'admin' } : user
      ))
    } catch (error) {
      console.error('Error updating user role:', error)
    }
  }

  const handleToggleVerification = async (userId: string, isVerified: boolean) => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ is_verified: !isVerified })
        .eq('id', userId)

      if (error) throw error

      // Update local state
      setUsers(users.map(user => 
        user.id === userId ? { ...user, is_verified: !isVerified } : user
      ))
    } catch (error) {
      console.error('Error updating user verification:', error)
    }
  }

  const handleDeleteUser = async () => {
    if (!selectedUser) return

    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', selectedUser.id)

      if (error) throw error

      // Update local state
      setUsers(users.filter(user => user.id !== selectedUser.id))
      setShowDeleteModal(false)
      setSelectedUser(null)
    } catch (error) {
      console.error('Error deleting user:', error)
    }
  }

  const handleUpdateProviderStatus = async (userId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ provider_status: newStatus })
        .eq('id', userId)

      if (error) throw error

      // Update local state
      setUsers(users.map(user => 
        user.id === userId ? { ...user, provider_status: newStatus as 'pending' | 'approved' | 'rejected' | 'suspended' } : user
      ))
    } catch (error) {
      console.error('Error updating provider status:', error)
    }
  }

  const getProviderServices = (providerId: string) => {
    return providerServices.filter(ps => ps.provider_id === providerId)
  }

  const handleAssignServices = async () => {
    if (!selectedUser) return

    try {
      // First, remove all existing services for this provider
      await supabase
        .from('provider_services')
        .delete()
        .eq('provider_id', selectedUser.id)

      // Then add the selected services
      if (selectedServiceIds.length > 0) {
        const newAssignments = selectedServiceIds.map(serviceId => ({
          provider_id: selectedUser.id,
          service_id: serviceId
        }))

        const { error } = await supabase
          .from('provider_services')
          .insert(newAssignments)

        if (error) throw error
      }

      // Refresh provider services
      await fetchProviderServices()
      setShowServiceAssignModal(false)
      setSelectedServiceIds([])
    } catch (error) {
      console.error('Error assigning services:', error)
    }
  }

  const openServiceAssignModal = (user: User) => {
    setSelectedUser(user)
    const currentServices = getProviderServices(user.id).map(ps => ps.service_id)
    setSelectedServiceIds(currentServices)
    setShowServiceAssignModal(true)
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800'
      case 'provider': return 'bg-blue-100 text-blue-800'
      case 'customer': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getProviderStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'approved': return 'bg-green-100 text-green-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      case 'suspended': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <AdminProtected>
      <AdminLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Users Management</h1>
                <p className="text-gray-600 mt-2">Manage all users, providers, and administrators</p>
              </div>
              <button className="bg-gray-900 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center">
                <PlusIcon className="w-5 h-5 mr-2" />
                Add User
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search users by name, email, or phone..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Role Filter */}
              <div className="md:w-48">
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                >
                  <option value="all">All Roles</option>
                  <option value="customer">Customers</option>
                  <option value="provider">Providers</option>
                  <option value="admin">Administrators</option>
                </select>
              </div>

              {/* Provider Status Filter (only show when providers are selected) */}
              {selectedRole === 'provider' && (
                <div className="md:w-48">
                  <select
                    value={selectedProviderStatus}
                    onChange={(e) => setSelectedProviderStatus(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    {selectedRole === 'provider' && (
                      <>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Provider Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Services</th>
                      </>
                    )}
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {isLoading ? (
                    <tr>
                      <td colSpan={selectedRole === 'provider' ? 8 : 6} className="px-6 py-4 text-center text-gray-500">
                        Loading users...
                      </td>
                    </tr>
                  ) : filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={selectedRole === 'provider' ? 8 : 6} className="px-6 py-4 text-center text-gray-500">
                        No users found
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 bg-gray-300 rounded-full flex items-center justify-center">
                              <UserCircleIcon className="h-6 w-6 text-gray-600" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{user.full_name || 'N/A'}</div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                              {user.phone && <div className="text-sm text-gray-500">{user.phone}</div>}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <select
                            value={user.role}
                            onChange={(e) => handleUpdateUserRole(user.id, e.target.value)}
                            className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(user.role)} border-0 focus:ring-2 focus:ring-gray-500`}
                          >
                            <option value="customer">Customer</option>
                            <option value="provider">Provider</option>
                            <option value="admin">Admin</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => handleToggleVerification(user.id, user.is_verified)}
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              user.is_verified 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {user.is_verified ? 'Verified' : 'Unverified'}
                          </button>
                        </td>
                        {selectedRole === 'provider' && (
                          <>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <select
                                value={user.provider_status || 'pending'}
                                onChange={(e) => handleUpdateProviderStatus(user.id, e.target.value)}
                                className={`px-3 py-1 rounded-full text-xs font-medium ${getProviderStatusBadgeColor(user.provider_status || 'pending')} border-0 focus:ring-2 focus:ring-gray-500`}
                              >
                                <option value="pending">Pending</option>
                                <option value="approved">Approved</option>
                                <option value="rejected">Rejected</option>
                                <option value="suspended">Suspended</option>
                              </select>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {getProviderServices(user.id).length} services
                              </div>
                              <button
                                onClick={() => openServiceAssignModal(user)}
                                className="text-xs text-blue-600 hover:text-blue-900"
                              >
                                Manage Services
                              </button>
                            </td>
                          </>
                        )}
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.city ? `${user.city}, ${user.state}` : 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(user.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          {user.role === 'provider' && (
                            <button
                              onClick={() => {
                                setSelectedUser(user)
                                setShowProviderModal(true)
                              }}
                              className="text-blue-600 hover:text-blue-900 mr-2"
                            >
                              View Details
                            </button>
                          )}
                          <button
                            onClick={() => {
                              setSelectedUser(user)
                              setShowDeleteModal(true)
                            }}
                            className="text-red-600 hover:text-red-900"
                          >
                            <TrashIcon className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Stats Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Users</h3>
              <p className="text-3xl font-bold text-blue-600">{users.length}</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Providers</h3>
              <p className="text-3xl font-bold text-green-600">
                {users.filter(u => u.role === 'provider').length}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Verified Users</h3>
              <p className="text-3xl font-bold text-purple-600">
                {users.filter(u => u.is_verified).length}
              </p>
            </div>
          </div>
        </div>

        {/* Provider Details Modal */}
        {showProviderModal && selectedUser && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Provider Details</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900">Basic Information</h4>
                  <p className="text-sm text-gray-600">Name: {selectedUser.full_name}</p>
                  <p className="text-sm text-gray-600">Email: {selectedUser.email}</p>
                  <p className="text-sm text-gray-600">Phone: {selectedUser.phone || 'N/A'}</p>
                  <p className="text-sm text-gray-600">Location: {selectedUser.city ? `${selectedUser.city}, ${selectedUser.state}` : 'N/A'}</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900">Provider Information</h4>
                  <p className="text-sm text-gray-600">Status: {selectedUser.provider_status || 'pending'}</p>
                  <p className="text-sm text-gray-600">Experience: {selectedUser.experience_years || 'N/A'} years</p>
                  <p className="text-sm text-gray-600">Hourly Rate: ₹{selectedUser.hourly_rate || 'N/A'}</p>
                  <p className="text-sm text-gray-600">Bio: {selectedUser.bio || 'No bio provided'}</p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900">Assigned Services</h4>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {getProviderServices(selectedUser.id).map((ps) => (
                      <span key={ps.id} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                        {ps.service?.name || 'Unknown Service'}
                      </span>
                    ))}
                    {getProviderServices(selectedUser.id).length === 0 && (
                      <span className="text-gray-500 text-sm">No services assigned</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex justify-end mt-6">
                <button
                  onClick={() => setShowProviderModal(false)}
                  className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Service Assignment Modal */}
        {showServiceAssignModal && selectedUser && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Assign Services to {selectedUser.full_name}
              </h3>
              
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  Select the services this provider can offer:
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                  {services.map((service) => (
                    <label key={service.id} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <input
                        type="checkbox"
                        checked={selectedServiceIds.includes(service.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedServiceIds([...selectedServiceIds, service.id])
                          } else {
                            setSelectedServiceIds(selectedServiceIds.filter(id => id !== service.id))
                          }
                        }}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{service.name}</div>
                        <div className="text-xs text-gray-500">{service.category}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  onClick={() => {
                    setShowServiceAssignModal(false)
                    setSelectedServiceIds([])
                  }}
                  className="px-4 py-2 text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAssignServices}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Save Services
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Modal */}
        {showDeleteModal && selectedUser && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Delete User</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete {selectedUser.full_name}? This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteUser}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </AdminLayout>
    </AdminProtected>
  )
}