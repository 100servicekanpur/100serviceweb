'use client'

export const dynamic = 'force-dynamic'

import React, { useState, useEffect } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import AdminProtected from '@/components/admin/AdminProtected'
import { supabase } from '@/lib/supabase'
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  TagIcon,
  EyeIcon,
  EyeSlashIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  FolderIcon,
  FolderOpenIcon
} from '@heroicons/react/24/outline'

interface Category {
  id: string
  name: string
  description: string | null
  icon: string | null
  color: string | null
  is_active: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

interface Subcategory {
  id: string
  category_id: string
  name: string
  description: string | null
  icon: string | null
  is_active: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

interface CategoryForm {
  name: string
  description: string
  icon: string
  color: string
  is_active: boolean
  sort_order: number
}

interface SubcategoryForm {
  name: string
  description: string
  icon: string
  category_id: string
  is_active: boolean
  sort_order: number
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [subcategories, setSubcategories] = useState<Subcategory[]>([])
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([])
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [showCategoryModal, setShowCategoryModal] = useState(false)
  const [showSubcategoryModal, setShowSubcategoryModal] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [editingSubcategory, setEditingSubcategory] = useState<Subcategory | null>(null)
  const [selectedCategoryForSub, setSelectedCategoryForSub] = useState<string>('')
  const [categoryForm, setCategoryForm] = useState<CategoryForm>({
    name: '',
    description: '',
    icon: '',
    color: '#3B82F6',
    is_active: true,
    sort_order: 0
  })
  const [subcategoryForm, setSubcategoryForm] = useState<SubcategoryForm>({
    name: '',
    description: '',
    icon: '',
    category_id: '',
    is_active: true,
    sort_order: 0
  })
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    filterCategories()
  }, [categories, searchQuery])

  const fetchData = async () => {
    try {
      setIsLoading(true)
      
      // Fetch categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('*')
        .order('sort_order', { ascending: true })

      if (categoriesError) throw categoriesError
      setCategories(categoriesData || [])

      // Fetch subcategories
      const { data: subcategoriesData, error: subcategoriesError } = await supabase
        .from('subcategories')
        .select('*')
        .order('sort_order', { ascending: true })

      if (subcategoriesError) throw subcategoriesError
      setSubcategories(subcategoriesData || [])
      
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filterCategories = () => {
    if (!searchQuery.trim()) {
      setFilteredCategories(categories)
    } else {
      const filtered = categories.filter(category =>
        category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (category.description && category.description.toLowerCase().includes(searchQuery.toLowerCase()))
      )
      setFilteredCategories(filtered)
    }
  }

  const getSubcategoriesForCategory = (categoryId: string) => {
    return subcategories.filter(sub => sub.category_id === categoryId)
  }

  const toggleCategoryExpansion = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories)
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId)
    } else {
      newExpanded.add(categoryId)
    }
    setExpandedCategories(newExpanded)
  }

  // Category functions
  const handleAddCategory = () => {
    setEditingCategory(null)
    setCategoryForm({
      name: '',
      description: '',
      icon: '',
      color: '#3B82F6',
      is_active: true,
      sort_order: categories.length
    })
    setShowCategoryModal(true)
  }

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category)
    setCategoryForm({
      name: category.name,
      description: category.description || '',
      icon: category.icon || '',
      color: category.color || '#3B82F6',
      is_active: category.is_active,
      sort_order: category.sort_order
    })
    setShowCategoryModal(true)
  }

  const handleSaveCategory = async () => {
    try {
      setIsSaving(true)
      
      if (editingCategory) {
        // Update existing category
        const { error } = await supabase
          .from('categories')
          .update(categoryForm)
          .eq('id', editingCategory.id)
        
        if (error) throw error
      } else {
        // Create new category
        const { error } = await supabase
          .from('categories')
          .insert([categoryForm])
        
        if (error) throw error
      }
      
      setShowCategoryModal(false)
      fetchData()
    } catch (error: any) {
      console.error('Error saving category:', error)
      console.error('Save error details:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      })
      
      let errorMessage = 'Error saving category. Please try again.'
      if (error.message) {
        errorMessage = `Error: ${error.message}`
      }
      if (error.code === 'PGRST301') {
        errorMessage = 'Permission denied. Please check your admin access.'
      }
      if (error.code === '42501') {
        errorMessage = 'Database permission error. Please check RLS policies.'
      }
      
      alert(errorMessage)
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteCategory = async (category: Category) => {
    if (!confirm(`Are you sure you want to delete "${category.name}"? This will also delete all its subcategories and services.`)) {
      return
    }

    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', category.id)
      
      if (error) throw error
      fetchData()
    } catch (error: any) {
      console.error('Error deleting category:', error)
      console.error('Delete error details:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      })
      
      let errorMessage = 'Error deleting category. Please try again.'
      if (error.message) {
        errorMessage = `Error: ${error.message}`
      }
      if (error.code === 'PGRST301') {
        errorMessage = 'Permission denied. Please check your admin access.'
      }
      if (error.code === '42501') {
        errorMessage = 'Database permission error. Please check RLS policies.'
      }
      
      alert(errorMessage)
    }
  }

  // Subcategory functions
  const handleAddSubcategory = (categoryId: string) => {
    setEditingSubcategory(null)
    setSelectedCategoryForSub(categoryId)
    setSubcategoryForm({
      name: '',
      description: '',
      icon: '',
      category_id: categoryId,
      is_active: true,
      sort_order: getSubcategoriesForCategory(categoryId).length
    })
    setShowSubcategoryModal(true)
  }

  const handleEditSubcategory = (subcategory: Subcategory) => {
    setEditingSubcategory(subcategory)
    setSubcategoryForm({
      name: subcategory.name,
      description: subcategory.description || '',
      icon: subcategory.icon || '',
      category_id: subcategory.category_id,
      is_active: subcategory.is_active,
      sort_order: subcategory.sort_order
    })
    setShowSubcategoryModal(true)
  }

  const handleSaveSubcategory = async () => {
    try {
      setIsSaving(true)
      
      if (editingSubcategory) {
        // Update existing subcategory
        const { error } = await supabase
          .from('subcategories')
          .update(subcategoryForm)
          .eq('id', editingSubcategory.id)
        
        if (error) throw error
      } else {
        // Create new subcategory
        const { error } = await supabase
          .from('subcategories')
          .insert([subcategoryForm])
        
        if (error) throw error
      }
      
      setShowSubcategoryModal(false)
      fetchData()
    } catch (error: any) {
      console.error('Error saving subcategory:', error)
      alert('Error saving subcategory. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteSubcategory = async (subcategory: Subcategory) => {
    if (!confirm(`Are you sure you want to delete "${subcategory.name}"? This will also delete all its services.`)) {
      return
    }

    try {
      const { error } = await supabase
        .from('subcategories')
        .delete()
        .eq('id', subcategory.id)
      
      if (error) throw error
      fetchData()
    } catch (error: any) {
      console.error('Error deleting subcategory:', error)
      alert('Error deleting subcategory. Please try again.')
    }
  }

  if (isLoading) {
    return (
      <AdminProtected>
        <AdminLayout>
          <div className="flex items-center justify-center min-h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </AdminLayout>
      </AdminProtected>
    )
  }

  return (
    <AdminProtected>
      <AdminLayout>
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Categories & Subcategories</h1>
              <p className="text-gray-600">Manage service categories and their subcategories</p>
            </div>
            <button
              onClick={handleAddCategory}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <PlusIcon className="w-5 h-5" />
              Add Category
            </button>
          </div>

          {/* Search */}
          <div className="mb-6">
            <div className="relative max-w-md">
              <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Categories List */}
          <div className="bg-white rounded-lg shadow-sm border">
            {filteredCategories.length === 0 ? (
              <div className="text-center py-8">
                <TagIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">No categories found</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {filteredCategories.map((category) => {
                  const categorySubcategories = getSubcategoriesForCategory(category.id)
                  const isExpanded = expandedCategories.has(category.id)
                  
                  return (
                    <div key={category.id}>
                      {/* Category Row */}
                      <div className="p-4 hover:bg-gray-50">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => toggleCategoryExpansion(category.id)}
                              className="p-1 hover:bg-gray-200 rounded"
                            >
                              {categorySubcategories.length > 0 ? (
                                isExpanded ? (
                                  <ChevronDownIcon className="w-4 h-4 text-gray-600" />
                                ) : (
                                  <ChevronRightIcon className="w-4 h-4 text-gray-600" />
                                )
                              ) : (
                                <div className="w-4 h-4"></div>
                              )}
                            </button>
                            
                            {isExpanded ? (
                              <FolderOpenIcon className="w-6 h-6 text-blue-600" />
                            ) : (
                              <FolderIcon className="w-6 h-6 text-blue-600" />
                            )}
                            
                            <div className="flex items-center gap-3">
                              {category.color && (
                                <div 
                                  className="w-4 h-4 rounded-full border"
                                  style={{ backgroundColor: category.color }}
                                ></div>
                              )}
                              <div>
                                <h3 className="font-medium text-gray-900">{category.name}</h3>
                                {category.description && (
                                  <p className="text-sm text-gray-600">{category.description}</p>
                                )}
                                <div className="flex items-center gap-2 mt-1">
                                  <span className="text-xs text-gray-500">
                                    {categorySubcategories.length} subcategories
                                  </span>
                                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                    category.is_active 
                                      ? 'bg-green-100 text-green-800' 
                                      : 'bg-red-100 text-red-800'
                                  }`}>
                                    {category.is_active ? 'Active' : 'Inactive'}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleAddSubcategory(category.id)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                              title="Add Subcategory"
                            >
                              <PlusIcon className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleEditCategory(category)}
                              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                              title="Edit Category"
                            >
                              <PencilIcon className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteCategory(category)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                              title="Delete Category"
                            >
                              <TrashIcon className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      {/* Subcategories */}
                      {isExpanded && categorySubcategories.length > 0 && (
                        <div className="bg-gray-50 border-t">
                          {categorySubcategories.map((subcategory) => (
                            <div key={subcategory.id} className="pl-16 pr-4 py-3 border-b border-gray-200 last:border-b-0">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <TagIcon className="w-4 h-4 text-gray-400" />
                                  <div>
                                    <h4 className="font-medium text-gray-800">{subcategory.name}</h4>
                                    {subcategory.description && (
                                      <p className="text-sm text-gray-600">{subcategory.description}</p>
                                    )}
                                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-1 ${
                                      subcategory.is_active 
                                        ? 'bg-green-100 text-green-800' 
                                        : 'bg-red-100 text-red-800'
                                    }`}>
                                      {subcategory.is_active ? 'Active' : 'Inactive'}
                                    </span>
                                  </div>
                                </div>
                                
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => handleEditSubcategory(subcategory)}
                                    className="p-1 text-gray-600 hover:bg-gray-200 rounded"
                                    title="Edit Subcategory"
                                  >
                                    <PencilIcon className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteSubcategory(subcategory)}
                                    className="p-1 text-red-600 hover:bg-red-100 rounded"
                                    title="Delete Subcategory"
                                  >
                                    <TrashIcon className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Category Modal */}
          {showCategoryModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">
                  {editingCategory ? 'Edit Category' : 'Add Category'}
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name *
                    </label>
                    <input
                      type="text"
                      value={categoryForm.name}
                      onChange={(e) => setCategoryForm(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Category name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      value={categoryForm.description}
                      onChange={(e) => setCategoryForm(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Category description"
                      rows={3}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Icon (emoji)
                    </label>
                    <input
                      type="text"
                      value={categoryForm.icon}
                      onChange={(e) => setCategoryForm(prev => ({ ...prev, icon: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="🏠"
                      maxLength={4}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Color
                    </label>
                    <input
                      type="color"
                      value={categoryForm.color}
                      onChange={(e) => setCategoryForm(prev => ({ ...prev, color: e.target.value }))}
                      className="w-full h-10 border border-gray-300 rounded-lg"
                    />
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="category-active"
                      checked={categoryForm.is_active}
                      onChange={(e) => setCategoryForm(prev => ({ ...prev, is_active: e.target.checked }))}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="category-active" className="ml-2 block text-sm text-gray-900">
                      Active
                    </label>
                  </div>
                </div>
                
                <div className="flex justify-end gap-3 mt-6">
                  <button
                    onClick={() => setShowCategoryModal(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                    disabled={isSaving}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveCategory}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    disabled={isSaving || !categoryForm.name.trim()}
                  >
                    {isSaving ? 'Saving...' : 'Save'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Subcategory Modal */}
          {showSubcategoryModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">
                  {editingSubcategory ? 'Edit Subcategory' : 'Add Subcategory'}
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name *
                    </label>
                    <input
                      type="text"
                      value={subcategoryForm.name}
                      onChange={(e) => setSubcategoryForm(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Subcategory name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      value={subcategoryForm.description}
                      onChange={(e) => setSubcategoryForm(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Subcategory description"
                      rows={3}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Icon (emoji)
                    </label>
                    <input
                      type="text"
                      value={subcategoryForm.icon}
                      onChange={(e) => setSubcategoryForm(prev => ({ ...prev, icon: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="🧹"
                      maxLength={4}
                    />
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="subcategory-active"
                      checked={subcategoryForm.is_active}
                      onChange={(e) => setSubcategoryForm(prev => ({ ...prev, is_active: e.target.checked }))}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="subcategory-active" className="ml-2 block text-sm text-gray-900">
                      Active
                    </label>
                  </div>
                </div>
                
                <div className="flex justify-end gap-3 mt-6">
                  <button
                    onClick={() => setShowSubcategoryModal(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                    disabled={isSaving}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveSubcategory}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    disabled={isSaving || !subcategoryForm.name.trim()}
                  >
                    {isSaving ? 'Saving...' : 'Save'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </AdminLayout>
    </AdminProtected>
  )
}