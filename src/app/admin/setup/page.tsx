'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { ShieldCheckIcon } from '@heroicons/react/24/outline'

export default function AdminSetupPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [isComplete, setIsComplete] = useState(false)

  const createAdminUser = async () => {
    setIsLoading(true)
    setMessage('')

    try {
      // Step 1: Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: 'v9ibhav@gmail.com',
        password: 'Vaibhav@1233',
        options: {
          data: {
            full_name: 'System Administrator',
            role: 'admin'
          }
        }
      })

      if (authError) {
        // If user already exists, try to sign in
        if (authError.message.includes('already registered')) {
          const { error: signInError } = await supabase.auth.signInWithPassword({
            email: 'v9ibhav@gmail.com',
            password: 'Vaibhav@1233'
          })

          if (signInError) {
            throw signInError
          }

          // Get current user and update their role
          const { data: { user } } = await supabase.auth.getUser()
          if (user) {
            const { error: updateError } = await supabase
              .from('users')
              .upsert({
                id: user.id,
                email: 'v9ibhav@gmail.com',
                full_name: 'System Administrator',
                role: 'admin',
                is_verified: true
              })

            if (updateError) {
              throw updateError
            }
          }
        } else {
          throw authError
        }
      } else if (authData.user) {
        // New user created, insert into users table
        const { error: insertError } = await supabase
          .from('users')
          .insert({
            id: authData.user.id,
            email: 'v9ibhav@gmail.com',
            full_name: 'System Administrator',
            role: 'admin',
            is_verified: true
          })

        if (insertError) {
          throw insertError
        }
      }

      setMessage('Admin user created successfully!')
      setIsComplete(true)
    } catch (error: any) {
      console.error('Error creating admin user:', error)
      setMessage(`Error: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-2xl p-8">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
            <ShieldCheckIcon className="h-8 w-8 text-blue-600" />
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Admin Setup
          </h1>
          
          <p className="text-gray-600 mb-8">
            Create the default admin user for 100Service platform
          </p>

          {!isComplete ? (
            <div className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg text-left">
                <h3 className="font-medium text-gray-900 mb-2">Default Admin Credentials:</h3>
                <div className="text-sm text-gray-600 space-y-1">
                  <p><strong>Email:</strong> admin@100service.com</p>
                  <p><strong>Password:</strong> Admin123!@#</p>
                </div>
              </div>

              <button
                onClick={createAdminUser}
                disabled={isLoading}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? 'Creating Admin User...' : 'Create Admin User'}
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-800 font-medium">✅ Admin user created successfully!</p>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
                <h3 className="font-medium text-blue-900 mb-2">Next Steps:</h3>
                <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                  <li>Go to the admin login page</li>
                  <li>Use the credentials shown above</li>
                  <li>Access the admin dashboard</li>
                  <li>Delete this setup page (for security)</li>
                </ol>
              </div>

              <a
                href="/admin/login"
                className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors block text-center"
              >
                Go to Admin Login
              </a>
            </div>
          )}

          {message && (
            <div className={`mt-4 p-3 rounded-lg text-sm ${
              message.includes('Error') 
                ? 'bg-red-50 text-red-800 border border-red-200' 
                : 'bg-green-50 text-green-800 border border-green-200'
            }`}>
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}