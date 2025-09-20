'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function SupabaseTestPage() {
  const [testResult, setTestResult] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const testConnection = async () => {
    setIsLoading(true)
    setTestResult('Testing...')
    
    try {
      // Test 1: Basic connection
      const { data, error } = await supabase
        .from('services')
        .select('count')
        .limit(1)
      
      if (error) {
        setTestResult(`❌ Connection Error: ${error.message}`)
        console.error('Supabase connection error:', error)
        return
      }
      
      // Test 2: Check users table
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('count')
        .limit(1)
      
      if (userError) {
        setTestResult(`❌ Users Table Error: ${userError.message}`)
        console.error('Users table error:', userError)
        return
      }
      
      // Test 3: Try to create a test user
      const { data: newUser, error: createError } = await supabase
        .from('users')
        .insert([{
          email: 'test@example.com',
          full_name: 'Test User',
          name: 'Test User',
          role: 'user'
        }])
        .select()
      
      if (createError) {
        setTestResult(`❌ User Creation Error: ${createError.message}`)
        console.error('User creation error:', createError)
        return
      }
      
      // Clean up test user
      await supabase
        .from('users')
        .delete()
        .eq('email', 'test@example.com')
      
      setTestResult('✅ All tests passed! Supabase is working correctly.')
      
    } catch (error) {
      setTestResult(`❌ Unexpected Error: ${error}`)
      console.error('Unexpected error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const testAdminUser = async () => {
    setIsLoading(true)
    setTestResult('Checking admin user...')
    
    try {
      // Check if admin user exists
      const { data: adminUser, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', 'v9ibhav@gmail.com')
        .single()
      
      if (error) {
        if (error.code === 'PGRST116') {
          setTestResult('❌ Admin user does not exist in database')
        } else {
          setTestResult(`❌ Error checking admin user: ${error.message}`)
        }
        console.error('Admin user check error:', error)
        return
      }
      
      setTestResult(`✅ Admin user found: ${JSON.stringify(adminUser, null, 2)}`)
      
    } catch (error) {
      setTestResult(`❌ Unexpected Error: ${error}`)
      console.error('Unexpected error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const createAdminUser = async () => {
    setIsLoading(true)
    setTestResult('Creating admin user...')
    
    try {
      const { data: newUser, error } = await supabase
        .from('users')
        .insert([{
          email: 'v9ibhav@gmail.com',
          full_name: 'Vaibhav Katiyar',
          name: 'Vaibhav Katiyar',
          role: 'admin',
          is_verified: true
        }])
        .select()
        .single()
      
      if (error) {
        setTestResult(`❌ Error creating admin user: ${error.message}`)
        console.error('Admin user creation error:', error)
        return
      }
      
      setTestResult(`✅ Admin user created: ${JSON.stringify(newUser, null, 2)}`)
      
    } catch (error) {
      setTestResult(`❌ Unexpected Error: ${error}`)
      console.error('Unexpected error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Supabase Connection Test</h1>
        
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">Connection Tests</h2>
          
          <div className="space-y-4">
            <button
              onClick={testConnection}
              disabled={isLoading}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {isLoading ? 'Testing...' : 'Test Supabase Connection'}
            </button>
            
            <button
              onClick={testAdminUser}
              disabled={isLoading}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50 ml-4"
            >
              {isLoading ? 'Checking...' : 'Check Admin User'}
            </button>
            
            <button
              onClick={createAdminUser}
              disabled={isLoading}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:opacity-50 ml-4"
            >
              {isLoading ? 'Creating...' : 'Create Admin User'}
            </button>
          </div>
          
          <div className="mt-6">
            <h3 className="font-semibold mb-2">Test Result:</h3>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
              {testResult || 'Click a button to run tests...'}
            </pre>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Environment Check</h2>
          <div className="space-y-2 text-sm">
            <p><strong>Supabase URL:</strong> {process.env.NEXT_PUBLIC_SUPABASE_URL}</p>
            <p><strong>Supabase Key:</strong> {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing'}</p>
          </div>
        </div>
      </div>
    </div>
  )
}