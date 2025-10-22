
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Plus, Search, Edit, Trash2, Eye, EyeOff } from 'lucide-react'
import Image from 'next/image'

interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  imageUrl: string | null
  isActive: boolean
  displayOrder: number
  parent: { name: string } | null
  children: Category[]
  _count: {
    productCategories: number
  }
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    loadCategories()
  }, [])

  useEffect(() => {
    if (searchQuery) {
      const filtered = categories.filter(cat =>
        cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cat.slug.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setFilteredCategories(filtered)
    } else {
      setFilteredCategories(categories)
    }
  }, [searchQuery, categories])

  const loadCategories = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/admin/categories?includeInactive=true')
      const data = await res.json()
      setCategories(data)
      setFilteredCategories(data)
    } catch (error) {
      console.error('Failed to load categories:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return

    try {
      const res = await fetch(`/api/admin/categories/${id}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        loadCategories()
      } else {
        const error = await res.json()
        alert(error.error || 'Failed to delete category')
      }
    } catch (error) {
      console.error('Failed to delete category:', error)
      alert('Failed to delete category')
    }
  }

  const toggleActive = async (category: Category) => {
    try {
      const res = await fetch(`/api/admin/categories/${category.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...category,
          isActive: !category.isActive
        })
      })

      if (res.ok) {
        loadCategories()
      } else {
        alert('Failed to update category')
      }
    } catch (error) {
      console.error('Failed to update category:', error)
      alert('Failed to update category')
    }
  }

  const parentCategories = filteredCategories.filter(c => !c.parent)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Category Management</h2>
        <Link href="/admin/categories/new">
          <Button className="bg-[#1c7430] hover:bg-[#155225]">
            <Plus className="w-4 h-4 mr-2" />
            Add Category
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Search Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search by name or slug..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="text-center py-12">Loading categories...</div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Categories ({filteredCategories.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {parentCategories.map((category) => (
                <div key={category.id} className="space-y-2">
                  <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    {category.imageUrl && (
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                        <Image
                          src={category.imageUrl}
                          alt={category.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-lg">{category.name}</h3>
                        {!category.isActive && (
                          <Badge variant="secondary">Inactive</Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 mb-1">
                        Slug: {category.slug}
                      </p>
                      {category.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1">
                          {category.description}
                        </p>
                      )}
                      <p className="text-xs text-gray-500 mt-1">
                        {category._count?.productCategories ?? 0} products
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleActive(category)}
                        title={category.isActive ? 'Deactivate' : 'Activate'}
                      >
                        {category.isActive ? (
                          <Eye className="w-4 h-4" />
                        ) : (
                          <EyeOff className="w-4 h-4" />
                        )}
                      </Button>
                      <Link href={`/admin/categories/edit/${category.id}`}>
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(category.id, category.name)}
                        disabled={(category._count?.productCategories ?? 0) > 0}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Child categories */}
                  {category.children.length > 0 && (
                    <div className="ml-8 space-y-2">
                      {category.children.map((child) => (
                        <div key={child.id} className="flex items-center gap-4 p-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg">
                          {child.imageUrl && (
                            <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                              <Image
                                src={child.imageUrl}
                                alt={child.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium">{child.name}</h4>
                              {!child.isActive && (
                                <Badge variant="secondary" className="text-xs">Inactive</Badge>
                              )}
                            </div>
                            <p className="text-xs text-gray-500">
                              {child._count?.productCategories ?? 0} products
                            </p>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleActive(child)}
                            >
                              {child.isActive ? (
                                <Eye className="w-3 h-3" />
                              ) : (
                                <EyeOff className="w-3 h-3" />
                              )}
                            </Button>
                            <Link href={`/admin/categories/edit/${child.id}`}>
                              <Button variant="ghost" size="sm">
                                <Edit className="w-3 h-3" />
                              </Button>
                            </Link>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(child.id, child.name)}
                              disabled={(child._count?.productCategories ?? 0) > 0}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {filteredCategories.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  No categories found
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
