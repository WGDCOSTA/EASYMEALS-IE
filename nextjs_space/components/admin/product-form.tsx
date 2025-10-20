
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft, Save } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

interface ProductFormProps {
  productId?: string
}

export default function ProductForm({ productId }: ProductFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [imagePreview, setImagePreview] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    imageUrl: '',
    category: 'TRADITIONAL_IRISH',
    storageType: 'FRESH_CHILLED',
    stockQuantity: '',
    isActive: true,
    allergens: [] as string[],
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
    preparationTime: '',
    servingSize: '',
    ingredients: ''
  })

  useEffect(() => {
    if (productId) {
      loadProduct()
    }
  }, [productId])

  const loadProduct = async () => {
    try {
      const res = await fetch(`/api/admin/products/${productId}`)
      const data = await res.json()
      setFormData({
        name: data.name,
        description: data.description,
        price: data.price.toString(),
        imageUrl: data.imageUrl,
        category: data.category,
        storageType: data.storageType,
        stockQuantity: data.stockQuantity.toString(),
        isActive: data.isActive,
        allergens: data.allergens || [],
        calories: data.calories?.toString() || '',
        protein: data.protein?.toString() || '',
        carbs: data.carbs?.toString() || '',
        fat: data.fat?.toString() || '',
        preparationTime: data.preparationTime?.toString() || '',
        servingSize: data.servingSize?.toString() || '',
        ingredients: data.ingredients || ''
      })
      setImagePreview(data.imageUrl)
    } catch (error) {
      console.error('Failed to load product:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = productId 
        ? `/api/admin/products/${productId}`
        : '/api/admin/products'

      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        stockQuantity: parseInt(formData.stockQuantity),
        calories: formData.calories ? parseInt(formData.calories) : null,
        protein: formData.protein ? parseFloat(formData.protein) : null,
        carbs: formData.carbs ? parseFloat(formData.carbs) : null,
        fat: formData.fat ? parseFloat(formData.fat) : null,
        preparationTime: formData.preparationTime ? parseInt(formData.preparationTime) : null,
        servingSize: formData.servingSize ? parseInt(formData.servingSize) : null
      }

      const res = await fetch(url, {
        method: productId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (res.ok) {
        router.push('/admin/products')
      } else {
        alert('Failed to save product')
      }
    } catch (error) {
      console.error('Failed to save product:', error)
      alert('Failed to save product')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))

    if (name === 'imageUrl') {
      setImagePreview(value)
    }
  }

  const categories = [
    { value: 'TRADITIONAL_IRISH', label: 'Traditional Irish' },
    { value: 'INTERNATIONAL', label: 'International' },
    { value: 'HEALTHY', label: 'Healthy' },
    { value: 'VEGETARIAN', label: 'Vegetarian' },
    { value: 'SEAFOOD', label: 'Seafood' },
    { value: 'COMFORT_FOOD', label: 'Comfort Food' }
  ]

  const storageTypes = [
    { value: 'FRESH_CHILLED', label: 'Fresh & Chilled' },
    { value: 'FROZEN', label: 'Frozen' }
  ]

  const commonAllergens = [
    'Gluten', 'Dairy', 'Eggs', 'Soy', 'Nuts', 'Fish', 'Shellfish', 'Sesame'
  ]

  const toggleAllergen = (allergen: string) => {
    setFormData(prev => ({
      ...prev,
      allergens: prev.allergens.includes(allergen)
        ? prev.allergens.filter(a => a !== allergen)
        : [...prev.allergens, allergen]
    }))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/admin/products">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <h2 className="text-2xl font-bold">
            {productId ? 'Edit Product' : 'Add New Product'}
          </h2>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">Product Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="ingredients">Ingredients</Label>
                  <Textarea
                    id="ingredients"
                    name="ingredients"
                    value={formData.ingredients}
                    onChange={handleChange}
                    rows={3}
                    placeholder="List all ingredients..."
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="price">Price (€) *</Label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="stockQuantity">Stock Quantity *</Label>
                    <Input
                      id="stockQuantity"
                      name="stockQuantity"
                      type="number"
                      value={formData.stockQuantity}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="category">Category *</Label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1c7430]"
                      required
                    >
                      {categories.map(cat => (
                        <option key={cat.value} value={cat.value}>{cat.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="storageType">Storage Type *</Label>
                    <select
                      id="storageType"
                      name="storageType"
                      value={formData.storageType}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1c7430]"
                      required
                    >
                      {storageTypes.map(type => (
                        <option key={type.value} value={type.value}>{type.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Nutritional Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="calories">Calories</Label>
                    <Input
                      id="calories"
                      name="calories"
                      type="number"
                      value={formData.calories}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <Label htmlFor="protein">Protein (g)</Label>
                    <Input
                      id="protein"
                      name="protein"
                      type="number"
                      step="0.1"
                      value={formData.protein}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <Label htmlFor="carbs">Carbs (g)</Label>
                    <Input
                      id="carbs"
                      name="carbs"
                      type="number"
                      step="0.1"
                      value={formData.carbs}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <Label htmlFor="fat">Fat (g)</Label>
                    <Input
                      id="fat"
                      name="fat"
                      type="number"
                      step="0.1"
                      value={formData.fat}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <Label htmlFor="preparationTime">Prep Time (minutes)</Label>
                    <Input
                      id="preparationTime"
                      name="preparationTime"
                      type="number"
                      value={formData.preparationTime}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <Label htmlFor="servingSize">Servings</Label>
                    <Input
                      id="servingSize"
                      name="servingSize"
                      type="number"
                      value={formData.servingSize}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div>
                  <Label>Allergens</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2">
                    {commonAllergens.map(allergen => (
                      <label key={allergen} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.allergens.includes(allergen)}
                          onChange={() => toggleAllergen(allergen)}
                          className="rounded border-gray-300 text-[#1c7430] focus:ring-[#1c7430]"
                        />
                        <span className="text-sm">{allergen}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Product Image</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="imageUrl">Image URL *</Label>
                  <Input
                    id="imageUrl"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleChange}
                    placeholder="https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Origin_of_life_stages.svg/1200px-Origin_of_life_stages.svg.png"
                    required
                  />
                </div>

                {imagePreview && (
                  <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-gray-100">
                    <Image
                      src={imagePreview}
                      alt="Preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Status</CardTitle>
              </CardHeader>
              <CardContent>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleChange}
                    className="rounded border-gray-300 text-[#1c7430] focus:ring-[#1c7430]"
                  />
                  <span className="text-sm font-medium">Product is active</span>
                </label>
                <p className="text-xs text-gray-500 mt-2">
                  Inactive products won't appear in the store
                </p>
              </CardContent>
            </Card>

            <Button 
              type="submit" 
              className="w-full bg-[#1c7430] hover:bg-[#155225]"
              disabled={loading}
            >
              <Save className="w-4 h-4 mr-2" />
              {loading ? 'Saving...' : 'Save Product'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
