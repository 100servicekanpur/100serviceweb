'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import {
  HomeIcon,
  UserGroupIcon,
  TagIcon,
  BuildingStorefrontIcon,
  ShoppingBagIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  BellIcon
} from '@heroicons/react/24/outline'

interface AdminLayoutProps {
  children: React.ReactNode
}

const navigation = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: HomeIcon },
  { name: 'Categories', href: '/admin/categories', icon: TagIcon },
  { name: 'Services', href: '/admin/services', icon: BuildingStorefrontIcon },
  { name: 'Users', href: '/admin/users', icon: UserGroupIcon },
  { name: 'Bookings', href: '/admin/bookings', icon: ShoppingBagIcon },
  { name: 'Analytics', href: '/admin/analytics', icon: ChartBarIcon },
  { name: 'Settings', href: '/admin/settings', icon: Cog6ToothIcon },
]

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  const handleLogout = async () => {
    await logout()
    router.push('/admin/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-black bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 flex w-72 flex-col bg-white shadow-2xl">
          <div className="flex h-16 items-center justify-between px-6 bg-black">
            <h1 className="text-xl font-bold text-white">100Service Admin</h1>
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
          <nav className="flex-1 px-4 py-6 space-y-1 bg-gray-900">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`group flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-white text-black shadow-lg'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <item.icon className={`mr-3 h-5 w-5 ${isActive ? 'text-black' : 'text-gray-400 group-hover:text-gray-300'}`} />
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </div>
      </div>

      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col">
        <div className="flex flex-col flex-grow bg-white shadow-xl border-r border-gray-200">
          <div className="flex h-16 items-center px-6 bg-black border-b border-gray-700">
            <h1 className="text-xl font-bold text-white">100Service Admin</h1>
          </div>
          <nav className="flex-1 px-4 py-6 space-y-1 bg-gray-900">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-white text-black shadow-lg'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <item.icon className={`mr-3 h-5 w-5 ${isActive ? 'text-black' : 'text-gray-400 group-hover:text-gray-300'}`} />
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </div>
      </div>

      <div className="lg:pl-72">
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>

          <div className="h-6 w-px bg-gray-200 lg:hidden" aria-hidden="true" />

          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              <h1 className="text-lg font-semibold text-gray-900">
                {navigation.find(nav => nav.href === pathname)?.name || 'Admin Panel'}
              </h1>
            </div>
            <div className="flex items-center gap-x-4 lg:gap-x-6 ml-auto">
              <button
                type="button"
                className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500"
              >
                <span className="sr-only">View notifications</span>
                <BellIcon className="h-6 w-6" aria-hidden="true" />
              </button>

              <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200" aria-hidden="true" />
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-black flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {user?.email?.charAt(0).toUpperCase() || 'A'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <main className="py-6">
          <div className="px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
