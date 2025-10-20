
'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react'
import { toast } from 'react-hot-toast'
import Link from 'next/link'

interface ProductSection {
  id: string
  name: string
  slug: string
  title: string
  description: string | null
  isActive: boolean
  displayOrder: number
  maxProducts: number
  sectionProducts: Array<{ product: { id: string; name: string } }>
}

export default function ProductSectionsPage() {
  const [sections, setSections] = useState<ProductSection[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    title: '',
    description: '',
    maxProducts: 10
  })

  useEffect(() => {
    loadSections()
  }, [])

  const loadSections = async () => {
    try {
      const res = await fetch('/api/product-sections')
      const data = await res.json()
      setSections(data)
      setLoading(false)
    } catch (error) {
      console.error('Failed to load sections:', error)
      toast.error('Failed to load product sections')
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const res = await fetch('/api/product-sections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!res.ok) throw new Error('Failed to create section')

      toast.success('Section created successfully!')
      setShowForm(false)
      setFormData({ name: '', slug: '', title: '', description: '', maxProducts: 10 })
      loadSections()
    } catch (error) {
      console.error('Error creating section:', error)
      toast.error('Failed to create section')
    }
  }

  const toggleActive = async (id: string, isActive: boolean) => {
    try {
      const res = await fetch(`/api/product-sections/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !isActive })
      })

      if (!res.ok) throw new Error('Failed to update section')

      toast.success('Section updated successfully!')
      loadSections()
    } catch (error) {
      console.error('Error updating section:', error)
      toast.error('Failed to update section')
    }
  }

  const deleteSection = async (id: string) => {
    if (!confirm('Are you sure you want to delete this section?')) return

    try {
      const res = await fetch(`/api/product-sections/${id}`, {
        method: 'DELETE'
      })

      if (!res.ok) throw new Error('Failed to delete section')

      toast.success('Section deleted successfully!')
      loadSections()
    } catch (error) {
      console.error('Error deleting section:', error)
      toast.error('Failed to delete section')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Product Sections</h1>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="bg-easymeals-green hover:bg-easymeals-green/90"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Section
        </Button>
      </div>

      {showForm && (
        <Card className="mb-8">
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="slug">Slug</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="title">Display Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="maxProducts">Max Products</Label>
                <Input
                  id="maxProducts"
                  type="number"
                  value={formData.maxProducts}
                  onChange={(e) => setFormData({ ...formData, maxProducts: parseInt(e.target.value) })}
                  required
                  min="1"
                  max="20"
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="bg-easymeals-green hover:bg-easymeals-green/90">
                  Create Section
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-4">
        {sections.map((section) => (
          <Card key={section.id}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold">{section.title}</h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        section.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {section.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-2">{section.description}</p>
                  <div className="flex gap-4 text-sm text-gray-500">
                    <span>Slug: {section.slug}</span>
                    <span>Max Products: {section.maxProducts}</span>
                    <span>Current Products: {section.sectionProducts?.length || 0}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => toggleActive(section.id, section.isActive)}
                    title={section.isActive ? 'Deactivate' : 'Activate'}
                  >
                    {section.isActive ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    asChild
                  >
                    <Link href={`/admin/sections/${section.id}`}>
                      <Edit className="w-4 h-4" />
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => deleteSection(section.id)}
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
