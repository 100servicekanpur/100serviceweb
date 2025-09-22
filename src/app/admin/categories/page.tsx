'use client'

import React, { useState, useEffect } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import RoleProtected from '@/components/admin/RoleProtected'
import { mongodb } from '@/lib/mongodb'
import {
  FolderIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  PhotoIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline'
import type { Category, Subcategory } from '@/lib/mongodb-types'

interface CategoryWithSubcategories extends Category {
  subcategories?: Subcategory[]
  serviceCount?: number
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<CategoryWithSubcategories[]>([])
  const [filteredCategories, setFilteredCategories] = useState<CategoryWithSubcategories[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all')
  const [selectedCategory, setSelectedCategory] = useState<CategoryWithSubcategories | null>(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  useEffect(() => {
    fetchCategories()
  }, [])

  useEffect(() => {
    filterCategories()
  }, [categories, searchTerm, statusFilter])

  const fetchCategories = async () => {
    try {
      setIsLoading(true)
      const categoriesList = await mongodb.getAllCategories()
      
      // Add mock data for subcategories and service count
      const categoriesWithDetails = categoriesList.map(category => ({
        ...category,
        subcategories: [],
        serviceCount: Math.floor(Math.random() * 20) + 1
      }))
      
      setCategories(categoriesWithDetails)
    } catch (error) {
      console.error('Error fetching categories:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filterCategories = () => {
    let filtered = categories

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(category =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (category.description && category.description.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(category => 
        statusFilter === 'active' ? category.isActive : !category.isActive
      )
    }

    setFilteredCategories(filtered)
  }

  const handleCreateCategory = async (categoryData: Omit<Category, '_id' | 'createdAt' | 'updatedAt'>) => {
    try {
      await mongodb.createCategory(categoryData)
      await fetchCategories()
      setIsCreateModalOpen(false)
    } catch (error) {
      console.error('Error creating category:', error)
    }
  }

  const handleUpdateCategory = async (categoryId: string, updates: Partial<Category>) => {
    try {
      await mongodb.updateCategory(categoryId, updates)
      await fetchCategories()
      setIsEditModalOpen(false)
      setSelectedCategory(null)
    } catch (error) {
      console.error('Error updating category:', error)
    }
  }

  const handleDeleteCategory = async () => {
    if (selectedCategory && selectedCategory._id) {
      try {
        await mongodb.deleteCategory(selectedCategory._id)
        await fetchCategories()
        setIsDeleteModalOpen(false)
        setSelectedCategory(null)
      } catch (error) {
        console.error('Error deleting category:', error)
      }
    }
  }

  const handleToggleStatus = async (categoryId: string, isActive: boolean) => {
    try {
      await mongodb.updateCategory(categoryId, { isActive: !isActive })
      await fetchCategories()
    } catch (error) {
      console.error('Error toggling category status:', error)
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
                <h1 className="text-3xl font-bold text-gray-900">Categories Management</h1>
                <p className="text-gray-600 mt-2">Manage service categories and subcategories</p>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <PlusIcon className="w-5 h-5 mr-2" />
                Add Category
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <FolderIcon className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Categories</p>
                  <p className="text-2xl font-bold text-gray-900">{categories.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-lg">
                  <EyeIcon className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Categories</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {categories.filter(c => c.isActive).length}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <EyeSlashIcon className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Inactive Categories</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {categories.filter(c => !c.isActive).length}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <FolderIcon className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Services</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {categories.reduce((sum, cat) => sum + (cat.serviceCount || 0), 0)}
                  </p>
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
                    placeholder="Search categories by name or description..."
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
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>

          {/* Categories Grid */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {isLoading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading categories...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                {filteredCategories.map((category) => (
                  <div key={category._id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                          {category.imageUrl ? (
                            <img src={category.imageUrl} alt={category.name} className="w-8 h-8 rounded" />
                          ) : (
                            <FolderIcon className="w-6 h-6 text-gray-500" />
                          )}
                        </div>
                        <div className="ml-3">
                          <h3 className="text-lg font-medium text-gray-900">{category.name}</h3>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            category.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {category.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => handleToggleStatus(category._id!, category.isActive)}
                          className={`p-1 rounded ${
                            category.isActive ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'
                          }`}
                          title={category.isActive ? 'Deactivate' : 'Activate'}
                        >
                          {category.isActive ? <EyeSlashIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                        </button>
                        <button
                          onClick={() => {
                            setSelectedCategory(category)
                            setIsEditModalOpen(true)
                          }}
                          className="p-1 text-blue-600 hover:text-blue-900"
                          title="Edit"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedCategory(category)
                            setIsDeleteModalOpen(true)
                          }}
                          className="p-1 text-red-600 hover:text-red-900"
                          title="Delete"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {category.description || 'No description provided'}
                    </p>

                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>{category.serviceCount} services</span>
                      <span>Created {new Date(category.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}

                {filteredCategories.length === 0 && !isLoading && (
                  <div className="col-span-full text-center py-8">
                    <FolderIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No categories found</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Try adjusting your search or filter criteria.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Create Category Modal */}
        {isCreateModalOpen && (
          <CategoryFormModal
            onClose={() => setIsCreateModalOpen(false)}
            onSave={handleCreateCategory}
            title="Create New Category"
          />
        )}

        {/* Edit Category Modal */}
        {isEditModalOpen && selectedCategory && (
          <CategoryFormModal
            category={selectedCategory}
            onClose={() => setIsEditModalOpen(false)}
            onSave={(data) => handleUpdateCategory(selectedCategory._id!, data)}
            title="Edit Category"
          />
        )}

        {/* Delete Category Modal */}
        {isDeleteModalOpen && selectedCategory && (
          <DeleteCategoryModal
            category={selectedCategory}
            onClose={() => setIsDeleteModalOpen(false)}
            onConfirm={handleDeleteCategory}
          />
        )}
      </AdminLayout>
    </RoleProtected>
  )
}

// Category Form Modal Component
function CategoryFormModal({ category, onClose, onSave, title }: {
  category?: CategoryWithSubcategories
  onClose: () => void
  onSave: (data: Omit<Category, '_id' | 'createdAt' | 'updatedAt'>) => void
  title: string
}) {
  const [formData, setFormData] = useState({
    name: category?.name || '',
    description: category?.description || '',
    imageUrl: category?.imageUrl || '',
    isActive: category?.isActive ?? true
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Image URL
            </label>
            <input
              type="url"
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
              Active Category
            </label>
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
            >
              {category ? 'Update' : 'Create'} Category
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Delete Category Modal Component
function DeleteCategoryModal({ category, onClose, onConfirm }: {
  category: CategoryWithSubcategories
  onClose: () => void
  onConfirm: () => void
}) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Delete Category</h3>
        <p className="text-sm text-gray-600 mb-4">
          Are you sure you want to delete <strong>{category.name}</strong>? This will also affect {category.serviceCount} services in this category.
        </p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg"
          >
            Delete Category
          </button>
        </div>
      </div>
    </div>
  )
}
