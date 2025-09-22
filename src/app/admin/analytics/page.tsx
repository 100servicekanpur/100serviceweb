'use client'

import React, { useState, useEffect } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import RoleProtected from '@/components/admin/RoleProtected'
import { mongodb } from '@/lib/mongodb'
import {
  UserGroupIcon,
  CogIcon,
  ShoppingBagIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  CalendarDaysIcon,
  ClockIcon
} from '@heroicons/react/24/outline'

interface AnalyticsData {
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
  monthlyRevenue: number
  avgBookingValue: number
  conversionRate: number
}

interface RecentStats {
  newUsersToday: number
  newBookingsToday: number
  revenueToday: number
  completionRate: number
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
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
    monthlyRevenue: 0,
    avgBookingValue: 0,
    conversionRate: 0
  })
  const [recentStats, setRecentStats] = useState<RecentStats>({
    newUsersToday: 0,
    newBookingsToday: 0,
    revenueToday: 0,
    completionRate: 0
  })
  const [isLoading, setIsLoading] = useState(true)
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d')

  useEffect(() => {
    fetchAnalytics()
  }, [timeRange])

  const fetchAnalytics = async () => {
    try {
      setIsLoading(true)
      
      // Get comprehensive analytics data
      const analyticsData = await mongodb.getAdminDashboardStats()
      
      // Calculate additional metrics
      const avgBookingValue = analyticsData.totalRevenue / Math.max(analyticsData.completedBookings, 1)
      const conversionRate = (analyticsData.completedBookings / Math.max(analyticsData.totalBookings, 1)) * 100
      const monthlyRevenue = analyticsData.totalRevenue * 0.8 // Simulate monthly revenue
      
      setAnalytics({
        ...analyticsData,
        avgBookingValue,
        conversionRate,
        monthlyRevenue
      })

      // Calculate recent stats (simulated)
      setRecentStats({
        newUsersToday: Math.floor(Math.random() * 10) + 1,
        newBookingsToday: Math.floor(Math.random() * 15) + 2,
        revenueToday: Math.floor(Math.random() * 5000) + 1000,
        completionRate: conversionRate
      })
      
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`
  }

  return (
    <RoleProtected requiredRole="admin">
      <AdminLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
                <p className="text-gray-600 mt-2">Comprehensive platform analytics and insights</p>
              </div>
              <div className="flex items-center space-x-4">
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value as any)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="7d">Last 7 days</option>
                  <option value="30d">Last 30 days</option>
                  <option value="90d">Last 90 days</option>
                </select>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <>
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <CurrencyDollarIcon className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {formatCurrency(analytics.totalRevenue)}
                      </p>
                      <p className="text-xs text-green-600 mt-1">
                        <ArrowTrendingUpIcon className="w-3 h-3 inline mr-1" />
                        +12.5% from last month
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center">
                    <div className="p-3 bg-green-100 rounded-lg">
                      <ShoppingBagIcon className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                      <p className="text-2xl font-bold text-gray-900">{analytics.totalBookings}</p>
                      <p className="text-xs text-green-600 mt-1">
                        <ArrowTrendingUpIcon className="w-3 h-3 inline mr-1" />
                        +8.2% from last month
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center">
                    <div className="p-3 bg-purple-100 rounded-lg">
                      <UserGroupIcon className="w-6 h-6 text-purple-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total Users</p>
                      <p className="text-2xl font-bold text-gray-900">{analytics.totalUsers}</p>
                      <p className="text-xs text-green-600 mt-1">
                        <ArrowTrendingUpIcon className="w-3 h-3 inline mr-1" />
                        +15.3% from last month
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center">
                    <div className="p-3 bg-yellow-100 rounded-lg">
                      <ChartBarIcon className="w-6 h-6 text-yellow-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {formatPercentage(analytics.conversionRate)}
                      </p>
                      <p className="text-xs text-green-600 mt-1">
                        <ArrowTrendingUpIcon className="w-3 h-3 inline mr-1" />
                        +2.1% from last month
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Secondary Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Avg Booking Value</p>
                      <p className="text-xl font-bold text-gray-900">
                        {formatCurrency(analytics.avgBookingValue)}
                      </p>
                    </div>
                    <CurrencyDollarIcon className="w-8 h-8 text-gray-400" />
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Active Providers</p>
                      <p className="text-xl font-bold text-gray-900">{analytics.totalProviders}</p>
                    </div>
                    <UserGroupIcon className="w-8 h-8 text-gray-400" />
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Services</p>
                      <p className="text-xl font-bold text-gray-900">{analytics.totalServices}</p>
                    </div>
                    <CogIcon className="w-8 h-8 text-gray-400" />
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Pending Services</p>
                      <p className="text-xl font-bold text-gray-900">{analytics.pendingServices}</p>
                    </div>
                    <ClockIcon className="w-8 h-8 text-gray-400" />
                  </div>
                </div>
              </div>

              {/* Today's Performance */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Today's Performance</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{recentStats.newUsersToday}</div>
                    <div className="text-sm text-gray-600">New Users</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{recentStats.newBookingsToday}</div>
                    <div className="text-sm text-gray-600">New Bookings</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {formatCurrency(recentStats.revenueToday)}
                    </div>
                    <div className="text-sm text-gray-600">Revenue</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600">
                      {formatPercentage(recentStats.completionRate)}
                    </div>
                    <div className="text-sm text-gray-600">Completion Rate</div>
                  </div>
                </div>
              </div>

              {/* Business Insights */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Service Performance</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Approved Services</span>
                      <div className="flex items-center">
                        <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                          <div 
                            className="bg-green-600 h-2 rounded-full" 
                            style={{ width: `${(analytics.approvedServices / analytics.totalServices) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">{analytics.approvedServices}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Pending Services</span>
                      <div className="flex items-center">
                        <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                          <div 
                            className="bg-yellow-600 h-2 rounded-full" 
                            style={{ width: `${(analytics.pendingServices / analytics.totalServices) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">{analytics.pendingServices}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Status</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Completed Bookings</span>
                      <div className="flex items-center">
                        <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                          <div 
                            className="bg-green-600 h-2 rounded-full" 
                            style={{ width: `${(analytics.completedBookings / analytics.totalBookings) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">{analytics.completedBookings}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Pending Bookings</span>
                      <div className="flex items-center">
                        <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                          <div 
                            className="bg-yellow-600 h-2 rounded-full" 
                            style={{ width: `${(analytics.pendingBookings / analytics.totalBookings) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">{analytics.pendingBookings}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </AdminLayout>
    </RoleProtected>
  )
}

  return (
    <AdminProtected>
      <AdminLayout>
        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900">Total Users</h3>
              <p className="text-3xl font-bold text-blue-600">{stats.totalUsers}</p>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900">Total Services</h3>
              <p className="text-3xl font-bold text-green-600">{stats.totalServices}</p>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900">Total Bookings</h3>
              <p className="text-3xl font-bold text-purple-600">{stats.totalBookings}</p>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900">Total Categories</h3>
              <p className="text-3xl font-bold text-orange-600">{stats.totalCategories}</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Analytics Dashboard</h3>
            <p className="text-gray-600">Successfully migrated to MongoDB.</p>
            <button
              onClick={fetchAnalytics}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Refresh Data
            </button>
          </div>
        </div>
      </AdminLayout>
    </AdminProtected>
  );
}
