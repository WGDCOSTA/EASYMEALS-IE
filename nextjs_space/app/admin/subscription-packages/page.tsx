
'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Plus, Edit, Trash2, Package } from 'lucide-react'
import { toast } from 'react-hot-toast'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'

interface SubscriptionPackage {
  id: string
  name: string
  description: string
  frequency: string
  price: number
  discountPercentage: number | null
  imageUrl: string | null
  isActive: boolean
  isFeatured: boolean
  mealsPerWeek: number | null
  servingsPerMeal: number | null
  customizable: boolean
  features: string[]
  packageItems: any[]
  _count?: {
    subscriptions: number
  }
}

export default function SubscriptionPackagesPage() {
  const [packages, setPackages] = useState<SubscriptionPackage[]>([])
  const [loading, setLoading] = useState(true)
  const [showDialog, setShowDialog] = useState(false)
  const [editingPackage, setEditingPackage] = useState<SubscriptionPackage | null>(null)
  const [products, setProducts] = useState<any[]>([])
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    frequency: 'WEEKLY',
    price: '',
    discountPercentage: '',
    imageUrl: '',
    isActive: true,
    isFeatured: false,
    mealsPerWeek: '',
    servingsPerMeal: '',
    customizable: true,
    features: ''
  })

  useEffect(() => {
    loadPackages()
    loadProducts()
  }, [])

  const loadPackages = async () => {
    try {
      const response = await fetch('/api/admin/subscription-packages')
      if (!response.ok) throw new Error('Failed to load packages')
      const data = await response.json()
      setPackages(data.packages)
    } catch (error) {
      console.error('Error loading packages:', error)
      toast.error('Failed to load packages')
    } finally {
      setLoading(false)
    }
  }

  const loadProducts = async () => {
    try {
      const response = await fetch('/api/products')
      if (!response.ok) throw new Error('Failed to load products')
      const data = await response.json()
      setProducts(data.products || [])
    } catch (error) {
      console.error('Error loading products:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const packageData = {
        ...formData,
        features: formData.features.split(',').map(f => f.trim()).filter(Boolean)
      }

      const url = editingPackage
        ? `/api/admin/subscription-packages/${editingPackage.id}`
        : '/api/admin/subscription-packages'

      const response = await fetch(url, {
        method: editingPackage ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(packageData)
      })

      if (!response.ok) throw new Error('Failed to save package')

      toast.success(editingPackage ? 'Package updated!' : 'Package created!')
      setShowDialog(false)
      resetForm()
      loadPackages()
    } catch (error) {
      console.error('Error saving package:', error)
      toast.error('Failed to save package')
    }
  }

  const handleEdit = (pkg: SubscriptionPackage) => {
    setEditingPackage(pkg)
    setFormData({
      name: pkg.name,
      description: pkg.description || '',
      frequency: pkg.frequency,
      price: pkg.price.toString(),
      discountPercentage: pkg.discountPercentage?.toString() || '',
      imageUrl: pkg.imageUrl || '',
      isActive: pkg.isActive,
      isFeatured: pkg.isFeatured,
      mealsPerWeek: pkg.mealsPerWeek?.toString() || '',
      servingsPerMeal: pkg.servingsPerMeal?.toString() || '',
      customizable: pkg.customizable,
      features: pkg.features.join(', ')
    })
    setShowDialog(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this package?')) return

    try {
      const response = await fetch(`/api/admin/subscription-packages/${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) throw new Error('Failed to delete package')

      toast.success('Package deleted!')
      loadPackages()
    } catch (error) {
      console.error('Error deleting package:', error)
      toast.error('Failed to delete package')
    }
  }

  const resetForm = () => {
    setEditingPackage(null)
    setFormData({
      name: '',
      description: '',
      frequency: 'WEEKLY',
      price: '',
      discountPercentage: '',
      imageUrl: '',
      isActive: true,
      isFeatured: false,
      mealsPerWeek: '',
      servingsPerMeal: '',
      customizable: true,
      features: ''
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-easymeals-green"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Subscription Packages</h1>
          <p className="text-gray-600 mt-1">Manage subscription plans for your customers</p>
        </div>
        <Button onClick={() => setShowDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Package
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {packages.map((pkg) => (
          <Card key={pkg.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5 text-easymeals-green" />
                    {pkg.name}
                  </CardTitle>
                  <CardDescription className="mt-2">
                    {pkg.description}
                  </CardDescription>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(pkg)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(pkg.id)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-easymeals-green">
                    €{pkg.price.toFixed(2)}
                  </span>
                  <Badge variant={pkg.frequency === 'WEEKLY' ? 'default' : 'secondary'}>
                    {pkg.frequency}
                  </Badge>
                </div>

                {pkg.discountPercentage && (
                  <Badge variant="outline" className="bg-green-50">
                    {pkg.discountPercentage}% OFF
                  </Badge>
                )}

                <div className="flex gap-2 flex-wrap">
                  {pkg.isActive && <Badge variant="outline">Active</Badge>}
                  {pkg.isFeatured && <Badge className="bg-yellow-500">Featured</Badge>}
                  {pkg.customizable && <Badge variant="secondary">Customizable</Badge>}
                </div>

                {pkg.mealsPerWeek && (
                  <p className="text-sm text-gray-600">
                    {pkg.mealsPerWeek} meals per week
                  </p>
                )}

                {pkg._count && (
                  <p className="text-sm text-gray-600">
                    {pkg._count.subscriptions} active subscriptions
                  </p>
                )}

                {pkg.features.length > 0 && (
                  <div className="mt-3">
                    <p className="text-sm font-semibold mb-1">Features:</p>
                    <ul className="text-xs text-gray-600 space-y-1">
                      {pkg.features.slice(0, 3).map((feature, idx) => (
                        <li key={idx}>• {feature}</li>
                      ))}
                      {pkg.features.length > 3 && (
                        <li className="text-easymeals-green">
                          +{pkg.features.length - 3} more
                        </li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={showDialog} onOpenChange={(open) => {
        setShowDialog(open)
        if (!open) resetForm()
      }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingPackage ? 'Edit Package' : 'Create New Package'}
            </DialogTitle>
            <DialogDescription>
              Configure your subscription package details
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label htmlFor="name">Package Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  placeholder="e.g., Weekly Family Plan"
                />
              </div>

              <div className="col-span-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  placeholder="Describe what's included in this package..."
                />
              </div>

              <div>
                <Label htmlFor="price">Price (€) *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
                  placeholder="29.99"
                />
              </div>

              <div>
                <Label htmlFor="frequency">Frequency *</Label>
                <Select
                  value={formData.frequency}
                  onValueChange={(value) => setFormData({ ...formData, frequency: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="WEEKLY">Weekly</SelectItem>
                    <SelectItem value="FORTNIGHTLY">Fortnightly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="discountPercentage">Discount %</Label>
                <Input
                  id="discountPercentage"
                  type="number"
                  value={formData.discountPercentage}
                  onChange={(e) => setFormData({ ...formData, discountPercentage: e.target.value })}
                  placeholder="10"
                />
              </div>

              <div>
                <Label htmlFor="mealsPerWeek">Meals per Week</Label>
                <Input
                  id="mealsPerWeek"
                  type="number"
                  value={formData.mealsPerWeek}
                  onChange={(e) => setFormData({ ...formData, mealsPerWeek: e.target.value })}
                  placeholder="7"
                />
              </div>

              <div className="col-span-2">
                <Label htmlFor="imageUrl">Image URL</Label>
                <Input
                  id="imageUrl"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="https://..."
                />
              </div>

              <div className="col-span-2">
                <Label htmlFor="features">Features (comma-separated)</Label>
                <Textarea
                  id="features"
                  value={formData.features}
                  onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                  rows={3}
                  placeholder="Free delivery, 20% discount, Priority support"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                />
                <Label htmlFor="isActive">Active</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="isFeatured"
                  checked={formData.isFeatured}
                  onCheckedChange={(checked) => setFormData({ ...formData, isFeatured: checked })}
                />
                <Label htmlFor="isFeatured">Featured</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="customizable"
                  checked={formData.customizable}
                  onCheckedChange={(checked) => setFormData({ ...formData, customizable: checked })}
                />
                <Label htmlFor="customizable">Customizable</Label>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowDialog(false)
                  resetForm()
                }}
              >
                Cancel
              </Button>
              <Button type="submit">
                {editingPackage ? 'Update Package' : 'Create Package'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
