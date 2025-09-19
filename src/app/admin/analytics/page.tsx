'use client';

export const dynamic = 'force-dynamic'

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import AdminProtected from '@/components/admin/AdminProtected';
import {
  ChartBarIcon,
  CurrencyRupeeIcon,
  UserGroupIcon,
  CalendarDaysIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  StarIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline';

interface Analytics {
  totalRevenue: number;
  monthlyRevenue: number;
  totalBookings: number;
  monthlyBookings: number;
  totalCustomers: number;
  monthlyCustomers: number;
  totalProviders: number;
  monthlyProviders: number;
  completionRate: number;
  averageRating: number;
  pendingBookings: number;
  cancelledBookings: number;
  revenueGrowth: number;
  bookingGrowth: number;
  customerGrowth: number;
  topServices: Array<{ name: string; bookings: number; revenue: number }>;
  revenueChart: Array<{ month: string; revenue: number; bookings: number }>;
  statusDistribution: Array<{ status: string; count: number; percentage: number }>;
}

export default function AdminAnalytics() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('30'); // days

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      
      // Calculate date ranges
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - parseInt(dateRange));
      
      const prevEndDate = new Date(startDate);
      const prevStartDate = new Date(startDate);
      prevStartDate.setDate(prevEndDate.getDate() - parseInt(dateRange));

      // Fetch bookings data
      const { data: bookings, error: bookingsError } = await supabase
        .from('bookings')
        .select(`
          *,
          services(name, price),
          profiles!bookings_user_id_fkey(created_at),
          ratings(rating)
        `);

      if (bookingsError) throw bookingsError;

      // Fetch users data
      const { data: users, error: usersError } = await supabase
        .from('profiles')
        .select('created_at, user_type');

      if (usersError) throw usersError;

      // Process current period data
      const currentBookings = bookings?.filter(b => 
        new Date(b.created_at) >= startDate && new Date(b.created_at) <= endDate
      ) || [];

      const prevBookings = bookings?.filter(b => 
        new Date(b.created_at) >= prevStartDate && new Date(b.created_at) < startDate
      ) || [];

      // Calculate metrics
      const totalRevenue = bookings?.filter(b => b.payment_status === 'paid')
        .reduce((sum, b) => sum + (b.total_amount || 0), 0) || 0;

      const monthlyRevenue = currentBookings.filter(b => b.payment_status === 'paid')
        .reduce((sum, b) => sum + (b.total_amount || 0), 0);

      const prevRevenue = prevBookings.filter(b => b.payment_status === 'paid')
        .reduce((sum, b) => sum + (b.total_amount || 0), 0);

      const totalBookings = bookings?.length || 0;
      const monthlyBookings = currentBookings.length;
      const prevMonthlyBookings = prevBookings.length;

      const customers = users?.filter(u => u.user_type === 'customer') || [];
      const providers = users?.filter(u => u.user_type === 'provider') || [];
      
      const totalCustomers = customers.length;
      const totalProviders = providers.length;

      const monthlyCustomers = customers.filter(c => 
        new Date(c.created_at) >= startDate && new Date(c.created_at) <= endDate
      ).length;

      const monthlyProviders = providers.filter(p => 
        new Date(p.created_at) >= startDate && new Date(p.created_at) <= endDate
      ).length;

      const prevMonthlyCustomers = customers.filter(c => 
        new Date(c.created_at) >= prevStartDate && new Date(c.created_at) < startDate
      ).length;

      // Calculate completion rate
      const completedBookings = bookings?.filter(b => b.status === 'completed').length || 0;
      const completionRate = totalBookings > 0 ? (completedBookings / totalBookings) * 100 : 0;

      // Calculate average rating
      const ratings = bookings?.flatMap(b => b.ratings || []).map(r => r.rating) || [];
      const averageRating = ratings.length > 0 ? 
        ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length : 0;

      // Count pending and cancelled bookings
      const pendingBookings = bookings?.filter(b => b.status === 'pending').length || 0;
      const cancelledBookings = bookings?.filter(b => b.status === 'cancelled').length || 0;

      // Calculate growth rates
      const revenueGrowth = prevRevenue > 0 ? 
        ((monthlyRevenue - prevRevenue) / prevRevenue) * 100 : 0;
      
      const bookingGrowth = prevMonthlyBookings > 0 ? 
        ((monthlyBookings - prevMonthlyBookings) / prevMonthlyBookings) * 100 : 0;
      
      const customerGrowth = prevMonthlyCustomers > 0 ? 
        ((monthlyCustomers - prevMonthlyCustomers) / prevMonthlyCustomers) * 100 : 0;

      // Top services
      const serviceStats: { [key: string]: { bookings: number; revenue: number } } = {};
      
      bookings?.forEach(booking => {
        const serviceName = booking.services?.name || 'Unknown';
        if (!serviceStats[serviceName]) {
          serviceStats[serviceName] = { bookings: 0, revenue: 0 };
        }
        serviceStats[serviceName].bookings += 1;
        if (booking.payment_status === 'paid') {
          serviceStats[serviceName].revenue += booking.total_amount || 0;
        }
      });

      const topServices = Object.entries(serviceStats)
        .map(([name, stats]) => ({ name, ...stats }))
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5);

      // Revenue chart data (last 6 months)
      const revenueChart = [];
      for (let i = 5; i >= 0; i--) {
        const monthStart = new Date();
        monthStart.setMonth(monthStart.getMonth() - i);
        monthStart.setDate(1);
        
        const monthEnd = new Date(monthStart);
        monthEnd.setMonth(monthEnd.getMonth() + 1);
        monthEnd.setDate(0);

        const monthBookings = bookings?.filter(b => {
          const bookingDate = new Date(b.created_at);
          return bookingDate >= monthStart && bookingDate <= monthEnd;
        }) || [];

        const monthRevenue = monthBookings
          .filter(b => b.payment_status === 'paid')
          .reduce((sum, b) => sum + (b.total_amount || 0), 0);

        revenueChart.push({
          month: monthStart.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }),
          revenue: monthRevenue,
          bookings: monthBookings.length
        });
      }

      // Status distribution
      const statusCounts: { [key: string]: number } = {};
      bookings?.forEach(booking => {
        statusCounts[booking.status] = (statusCounts[booking.status] || 0) + 1;
      });

      const statusDistribution = Object.entries(statusCounts).map(([status, count]) => ({
        status,
        count,
        percentage: totalBookings > 0 ? (count / totalBookings) * 100 : 0
      }));

      setAnalytics({
        totalRevenue,
        monthlyRevenue,
        totalBookings,
        monthlyBookings,
        totalCustomers,
        monthlyCustomers,
        totalProviders,
        monthlyProviders,
        completionRate,
        averageRating,
        pendingBookings,
        cancelledBookings,
        revenueGrowth,
        bookingGrowth,
        customerGrowth,
        topServices,
        revenueChart,
        statusDistribution
      });

    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  }, [dateRange]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getGrowthIcon = (growth: number) => {
    if (growth > 0) return <ArrowTrendingUpIcon className="h-4 w-4 text-green-500" />;
    if (growth < 0) return <ArrowTrendingDownIcon className="h-4 w-4 text-red-500" />;
    return <div className="h-4 w-4" />;
  };

  const getGrowthColor = (growth: number) => {
    if (growth > 0) return 'text-green-600';
    if (growth < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  if (loading || !analytics) {
    return (
      <AdminProtected>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </AdminProtected>
    );
  }

  return (
    <AdminProtected>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
            <p className="mt-1 text-sm text-gray-500">
              Track business performance and key metrics
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
              <option value="365">Last year</option>
            </select>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {formatCurrency(analytics.totalRevenue)}
                </p>
                <div className="flex items-center mt-2">
                  {getGrowthIcon(analytics.revenueGrowth)}
                  <span className={`text-sm ml-1 ${getGrowthColor(analytics.revenueGrowth)}`}>
                    {analytics.revenueGrowth.toFixed(1)}% vs last period
                  </span>
                </div>
              </div>
              <div className="flex-shrink-0">
                <CurrencyRupeeIcon className="h-8 w-8 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Bookings</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {analytics.totalBookings.toLocaleString()}
                </p>
                <div className="flex items-center mt-2">
                  {getGrowthIcon(analytics.bookingGrowth)}
                  <span className={`text-sm ml-1 ${getGrowthColor(analytics.bookingGrowth)}`}>
                    {analytics.bookingGrowth.toFixed(1)}% vs last period
                  </span>
                </div>
              </div>
              <div className="flex-shrink-0">
                <CalendarDaysIcon className="h-8 w-8 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Customers</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {analytics.totalCustomers.toLocaleString()}
                </p>
                <div className="flex items-center mt-2">
                  {getGrowthIcon(analytics.customerGrowth)}
                  <span className={`text-sm ml-1 ${getGrowthColor(analytics.customerGrowth)}`}>
                    {analytics.customerGrowth.toFixed(1)}% vs last period
                  </span>
                </div>
              </div>
              <div className="flex-shrink-0">
                <UserGroupIcon className="h-8 w-8 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Completion Rate</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {analytics.completionRate.toFixed(1)}%
                </p>
                <div className="flex items-center mt-2">
                  <CheckCircleIcon className="h-4 w-4 text-green-500" />
                  <span className="text-sm ml-1 text-gray-600">
                    {analytics.pendingBookings} pending
                  </span>
                </div>
              </div>
              <div className="flex-shrink-0">
                <ChartBarIcon className="h-8 w-8 text-indigo-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Secondary Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-4 rounded-lg shadow border">
            <div className="flex items-center">
              <BuildingOfficeIcon className="h-6 w-6 text-gray-400 mr-3" />
              <div>
                <p className="text-sm text-gray-500">Total Providers</p>
                <p className="text-lg font-semibold text-gray-900">
                  {analytics.totalProviders}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow border">
            <div className="flex items-center">
              <StarIcon className="h-6 w-6 text-yellow-400 mr-3" />
              <div>
                <p className="text-sm text-gray-500">Average Rating</p>
                <p className="text-lg font-semibold text-gray-900">
                  {analytics.averageRating.toFixed(1)}/5
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow border">
            <div className="flex items-center">
              <ClockIcon className="h-6 w-6 text-orange-400 mr-3" />
              <div>
                <p className="text-sm text-gray-500">Pending Bookings</p>
                <p className="text-lg font-semibold text-gray-900">
                  {analytics.pendingBookings}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow border">
            <div className="flex items-center">
              <XCircleIcon className="h-6 w-6 text-red-400 mr-3" />
              <div>
                <p className="text-sm text-gray-500">Cancelled</p>
                <p className="text-lg font-semibold text-gray-900">
                  {analytics.cancelledBookings}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts and Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Chart */}
          <div className="bg-white p-6 rounded-lg shadow border">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Revenue Trend</h3>
            <div className="space-y-3">
              {analytics.revenueChart.map((data, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{data.month}</span>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm font-medium">
                      {formatCurrency(data.revenue)}
                    </span>
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{
                          width: `${Math.min((data.revenue / Math.max(...analytics.revenueChart.map(d => d.revenue))) * 100, 100)}%`
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Services */}
          <div className="bg-white p-6 rounded-lg shadow border">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Top Services</h3>
            <div className="space-y-4">
              {analytics.topServices.map((service, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{service.name}</p>
                    <p className="text-xs text-gray-500">{service.bookings} bookings</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {formatCurrency(service.revenue)}
                    </p>
                    <div className="w-16 bg-gray-200 rounded-full h-1.5 mt-1">
                      <div
                        className="bg-green-600 h-1.5 rounded-full"
                        style={{
                          width: `${Math.min((service.revenue / Math.max(...analytics.topServices.map(s => s.revenue))) * 100, 100)}%`
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Status Distribution */}
        <div className="bg-white p-6 rounded-lg shadow border">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Booking Status Distribution</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {analytics.statusDistribution.map((status, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl font-semibold text-gray-900">
                  {status.count}
                </div>
                <div className="text-sm text-gray-500 capitalize">
                  {status.status.replace('-', ' ')}
                </div>
                <div className="text-xs text-gray-400">
                  {status.percentage.toFixed(1)}%
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1 mt-2">
                  <div
                    className="bg-blue-600 h-1 rounded-full"
                    style={{ width: `${status.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Performance */}
        <div className="bg-white p-6 rounded-lg shadow border">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Current Period Performance</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                {formatCurrency(analytics.monthlyRevenue)}
              </div>
              <div className="text-sm text-gray-500">Revenue</div>
              <div className={`text-xs mt-1 ${getGrowthColor(analytics.revenueGrowth)}`}>
                {analytics.revenueGrowth > 0 ? '+' : ''}{analytics.revenueGrowth.toFixed(1)}%
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {analytics.monthlyBookings}
              </div>
              <div className="text-sm text-gray-500">Bookings</div>
              <div className={`text-xs mt-1 ${getGrowthColor(analytics.bookingGrowth)}`}>
                {analytics.bookingGrowth > 0 ? '+' : ''}{analytics.bookingGrowth.toFixed(1)}%
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">
                {analytics.monthlyCustomers}
              </div>
              <div className="text-sm text-gray-500">New Customers</div>
              <div className={`text-xs mt-1 ${getGrowthColor(analytics.customerGrowth)}`}>
                {analytics.customerGrowth > 0 ? '+' : ''}{analytics.customerGrowth.toFixed(1)}%
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminProtected>
  );
}