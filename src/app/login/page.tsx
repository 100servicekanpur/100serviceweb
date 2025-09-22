'use client'

import { SignIn } from '@clerk/nextjs'
import Link from 'next/link'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Back to home link */}
        <Link 
          href="/" 
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6 justify-center"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          Back to Home
        </Link>

        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">100Service</h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to your account
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <SignIn 
            appearance={{
              elements: {
                formButtonPrimary: 
                  'bg-gray-900 hover:bg-gray-800 text-sm normal-case',
                card: 'shadow-none',
                headerTitle: 'hidden',
                headerSubtitle: 'hidden',
                socialButtonsBlockButton: 
                  'border border-gray-300 hover:border-gray-400 text-gray-700',
                formFieldInput: 
                  'border-gray-300 focus:border-gray-500 focus:ring-gray-500',
                footerActionLink: 'text-gray-900 hover:text-gray-700'
              }
            }}
            redirectUrl="/dashboard"
            signUpUrl="/register"
          />
        </div>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-50 text-gray-500">
                New to 100Service?
              </span>
            </div>
          </div>
          
          <div className="mt-6">
            <Link
              href="/register"
              className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}