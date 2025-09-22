'use client'

import React, { useState, useRef } from 'react'
import { mongodb } from '@/lib/mongodb'
import {
  PhotoIcon,
  XMarkIcon,
  ArrowUpTrayIcon,
  TrashIcon
} from '@heroicons/react/24/outline'

interface ImageUploadProps {
  currentImage?: string
  onImageChange: (imageUrl: string | null) => void
  bucket?: string
  folder?: string
  aspectRatio?: 'square' | 'landscape' | 'portrait'
  maxSize?: number // in MB
  className?: string
}

export default function ImageUpload({
  currentImage,
  onImageChange,
  bucket = 'uploads',
  folder = 'general',
  aspectRatio = 'square',
  maxSize = 5,
  className = ''
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const aspectRatioClasses = {
    square: 'aspect-square',
    landscape: 'aspect-video',
    portrait: 'aspect-[3/4]'
  }

  const uploadImage = async (file: File) => {
    try {
      setUploading(true)

      // Validate file size
      if (file.size > maxSize * 1024 * 1024) {
        alert(`File size must be less than ${maxSize}MB`)
        return
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file')
        return
      }

      // Generate unique filename
      const fileExt = file.name.split('.').pop()
      const fileName = `${folder}/${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`

      // TODO: Implement MongoDB/cloud storage upload
      // For now, create a placeholder URL
      const placeholderUrl = `/uploads/${fileName}`
      console.log('Would upload file:', fileName)
      
      onImageChange(placeholderUrl)
    } catch (error) {
      console.error('Error uploading image:', error)
      alert('Error uploading image. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      uploadImage(file)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    
    const file = e.dataTransfer.files[0]
    if (file) {
      uploadImage(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
  }

  const removeImage = async () => {
    if (currentImage) {
      // Extract filename from URL to delete from storage
      try {
        // TODO: Implement MongoDB/cloud storage delete
        console.log('Would delete image:', currentImage)
      } catch (error) {
        console.error('Error deleting image:', error)
      }
    }
    onImageChange(null)
  }

  return (
    <div className={`space-y-3 ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {currentImage ? (
        <div className="relative group">
          <div className={`relative ${aspectRatioClasses[aspectRatio]} w-full max-w-xs rounded-xl overflow-hidden bg-gray-900 border border-gray-800`}>
            <img
              src={currentImage}
              alt="Uploaded"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                  title="Change image"
                >
                  <ArrowUpTrayIcon className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={removeImage}
                  className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  title="Remove image"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`
            ${aspectRatioClasses[aspectRatio]} w-full max-w-xs
            border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200
            flex flex-col items-center justify-center gap-3 p-6
            ${dragOver 
              ? 'border-white bg-gray-900 text-white' 
              : 'border-gray-700 bg-gray-950 text-gray-400 hover:border-gray-600 hover:bg-gray-900 hover:text-gray-300'
            }
            ${uploading ? 'pointer-events-none opacity-50' : ''}
          `}
        >
          {uploading ? (
            <>
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
              <span className="text-sm">Uploading...</span>
            </>
          ) : (
            <>
              <PhotoIcon className="w-12 h-12" />
              <div className="text-center">
                <p className="text-sm font-medium">Upload Image</p>
                <p className="text-xs mt-1">
                  Click or drag to upload
                </p>
                <p className="text-xs mt-1 text-gray-500">
                  Max {maxSize}MB • JPG, PNG, WebP
                </p>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}