'use client'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AdminLayout from '@/components/admin/AdminLayout'
import RoleProtected from '@/components/admin/RoleProtected'
import {
  UserGroupIcon,
  CogIcon,
  ShoppingBagIcon,
  StarIcon,
  ClockIcon,
  CurrencyRupeeIcon
} from '@heroicons/react/24/outline'
import { mongodb } from '@/lib/mongodb'

interface DashboardStats {
  totalUsers: number
  totalProviders: number
  totalCustomers: number
  totalServices: number
  approvedServices: number
  pendingServices: number
  totalBookings: number
  completedBookings: number
  pendingBookings: number
  totalRevenue: number
  activeProviders: number
}

interface Activity {
  _id: string
  type: string
  message: string
  details: string
  timestamp: string
}

export default function AdminDashboard() {
  const router = useRouter()
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalProviders: 0,
    totalCustomers: 0,
    totalServices: 0,
    approvedServices: 0,
    pendingServices: 0,
    totalBookings: 0,
    completedBookings: 0,
    pendingBookings: 0,
    totalRevenue: 0,
    activeProviders: 0
  })
  const [activities, setActivities] = useState<Activity[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true)

      // Get comprehensive admin dashboard stats
      const dashboardStats = await mongodb.getAdminDashboardStats()
      
      setStats(dashboardStats)

      // Get recent activities
      const recentActivities = await mongodb.getRecentActivities(5)
      setActivities(recentActivities)
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <RoleProtected requiredRole="admin">
      <AdminLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back! Here&apos;s what&apos;s happening with 100Service today.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Total Users */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <UserGroupIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">
                  {isLoading ? '...' : stats.totalUsers.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Total Services */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <CogIcon className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Services</p>
                <p className="text-2xl font-bold text-gray-900">
                  {isLoading ? '...' : stats.totalServices.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Total Bookings */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <ShoppingBagIcon className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                <p className="text-2xl font-bold text-gray-900">
                  {isLoading ? '...' : stats.totalBookings.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Total Revenue */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <CurrencyRupeeIcon className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">
                  {isLoading ? '...' : `₹${stats.totalRevenue.toLocaleString()}`}
                </p>
              </div>
            </div>
          </div>

          {/* Pending Services */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-red-100 rounded-lg">
                <ClockIcon className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Services</p>
                <p className="text-2xl font-bold text-gray-900">
                  {isLoading ? '...' : stats.pendingServices.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Active Providers */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-indigo-100 rounded-lg">
                <StarIcon className="w-6 h-6 text-indigo-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Providers</p>
                <p className="text-2xl font-bold text-gray-900">
                  {isLoading ? '...' : stats.activeProviders.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              onClick={() => router.push('/admin/users')}
              className="p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <UserGroupIcon className="w-8 h-8 text-blue-600 mb-2" />
              <h3 className="font-medium text-gray-900">Manage Users</h3>
              <p className="text-sm text-gray-600">View and manage all users</p>
            </button>

            <button
              onClick={() => router.push('/admin/services')}
              className="p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <CogIcon className="w-8 h-8 text-green-600 mb-2" />
              <h3 className="font-medium text-gray-900">Manage Services</h3>
              <p className="text-sm text-gray-600">Approve and manage services</p>
            </button>

            <button
              onClick={() => router.push('/admin/bookings')}
              className="p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <ShoppingBagIcon className="w-8 h-8 text-purple-600 mb-2" />
              <h3 className="font-medium text-gray-900">View Bookings</h3>
              <p className="text-sm text-gray-600">Monitor all bookings</p>
            </button>

            <button
              onClick={() => router.push('/admin/settings')}
              className="p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <CogIcon className="w-8 h-8 text-gray-600 mb-2" />
              <h3 className="font-medium text-gray-900">Settings</h3>
              <p className="text-sm text-gray-600">Configure site settings</p>
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {isLoading ? (
              <div className="animate-pulse space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center p-4 bg-gray-50 rounded-lg">
                    <div className="w-2 h-2 bg-gray-300 rounded-full mr-3"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-300 rounded w-1/4"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : activities.length > 0 ? (
              activities.map((activity) => (
                <div key={activity._id} className="flex items-center p-4 bg-gray-50 rounded-lg">
                  <div className={`w-2 h-2 rounded-full mr-3 ${
                    activity.type === 'user_registered' ? 'bg-green-500' :
                    activity.type === 'service_approved' ? 'bg-blue-500' :
                    activity.type === 'booking_completed' ? 'bg-yellow-500' :
                    'bg-gray-500'
                  }`}></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                    <p className="text-xs text-gray-600">
                      {new Date(activity.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No recent activities found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
    </RoleProtected>
  )
}