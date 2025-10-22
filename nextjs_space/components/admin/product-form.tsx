
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft, Save, Sparkles } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { toast } from 'sonner'

interface ProductFormProps {
  productId?: string
}

interface Category {
  id: string
  name: string
  slug: string
}

export default function ProductForm({ productId }: ProductFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [aiLoading, setAiLoading] = useState(false)
  const [imagePreview, setImagePreview] = useState('')
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [primaryCategoryId, setPrimaryCategoryId] = useState<string>('')
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    shortDescription: '',
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
    ingredients: '',
    sku: '',
    weight: '',
    dimensions: ''
  })

  useEffect(() => {
    loadCategories()
    if (productId) {
      loadProduct()
    }
  }, [productId])

  const loadCategories = async () => {
    try {
      const res = await fetch('/api/admin/categories')
      const data = await res.json()
      setCategories(data)
    } catch (error) {
      console.error('Failed to load categories:', error)
    }
  }

  const loadProduct = async () => {
    try {
      const res = await fetch(`/api/admin/products/${productId}`)
      const data = await res.json()
      setFormData({
        name: data.name,
        description: data.description,
        shortDescription: data.shortDescription || '',
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
        ingredients: data.ingredients || '',
        sku: data.sku || '',
        weight: data.weight?.toString() || '',
        dimensions: data.dimensions || ''
      })
      setImagePreview(data.imageUrl)
      
      // Load product categories
      if (data.productCategories && data.productCategories.length > 0) {
        const categoryIds = data.productCategories.map((pc: any) => pc.categoryId)
        setSelectedCategories(categoryIds)
        
        const primary = data.productCategories.find((pc: any) => pc.isPrimary)
        if (primary) {
          setPrimaryCategoryId(primary.categoryId)
        }
      }
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
        servingSize: formData.servingSize ? parseInt(formData.servingSize) : null,
        weight: formData.weight ? parseFloat(formData.weight) : null,
        categories: selectedCategories.map(categoryId => ({
          categoryId,
          isPrimary: categoryId === primaryCategoryId
        }))
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

  const toggleCategory = (categoryId: string) => {
    if (selectedCategories.includes(categoryId)) {
      setSelectedCategories(selectedCategories.filter(id => id !== categoryId))
      if (primaryCategoryId === categoryId) {
        setPrimaryCategoryId('')
      }
    } else {
      const newCategories = [...selectedCategories, categoryId]
      setSelectedCategories(newCategories)
      // Set as primary if it's the first category
      if (newCategories.length === 1) {
        setPrimaryCategoryId(categoryId)
      }
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

  const legacyCategories = [
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

  const populateNutritionWithAI = async () => {
    if (!formData.description && !formData.ingredients) {
      toast.error('Please enter product description or ingredients first')
      return
    }

    setAiLoading(true)
    try {
      const res = await fetch('/api/admin/ai-nutrition', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          shortDescription: formData.shortDescription,
          ingredients: formData.ingredients
        })
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Failed to generate nutrition data')
      }

      const nutritionData = await res.json()

      // Update form data with AI-generated values
      setFormData(prev => ({
        ...prev,
        calories: nutritionData.calories?.toString() || prev.calories,
        protein: nutritionData.protein?.toString() || prev.protein,
        carbs: nutritionData.carbs?.toString() || prev.carbs,
        fat: nutritionData.fat?.toString() || prev.fat,
        servingSize: prev.servingSize || '1' // Default to 1 serving if not set
      }))

      toast.success('Nutrition information populated successfully!')
    } catch (error: any) {
      console.error('AI nutrition error:', error)
      toast.error(error.message || 'Failed to generate nutrition data')
    } finally {
      setAiLoading(false)
    }
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
                  <Label htmlFor="shortDescription">Short Description</Label>
                  <Textarea
                    id="shortDescription"
                    name="shortDescription"
                    value={formData.shortDescription}
                    onChange={handleChange}
                    rows={2}
                    placeholder="Brief product summary..."
                  />
                </div>

                <div>
                  <Label htmlFor="description">Full Description *</Label>
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

                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <Label htmlFor="sku">SKU</Label>
                    <Input
                      id="sku"
                      name="sku"
                      value={formData.sku}
                      onChange={handleChange}
                      placeholder="Product SKU"
                    />
                  </div>

                  <div>
                    <Label htmlFor="weight">Weight (kg)</Label>
                    <Input
                      id="weight"
                      name="weight"
                      type="number"
                      step="0.01"
                      value={formData.weight}
                      onChange={handleChange}
                      placeholder="0.5"
                    />
                  </div>

                  <div>
                    <Label htmlFor="dimensions">Dimensions</Label>
                    <Input
                      id="dimensions"
                      name="dimensions"
                      value={formData.dimensions}
                      onChange={handleChange}
                      placeholder="10x20x30 cm"
                    />
                  </div>
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

                <div>
                  <Label htmlFor="storageType">Storage Type *</Label>
                  <select
                    id="storageType"
                    name="storageType"
                    value={formData.storageType}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1c7430] bg-white dark:bg-gray-800"
                    required
                  >
                    {storageTypes.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Product Categories</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Select Categories (Multiple) *</Label>
                  <p className="text-xs text-gray-500 mb-3">
                    Choose one or more categories for this product
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-64 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                    {categories.map(category => (
                      <label key={category.id} className="flex items-start space-x-2 cursor-pointer p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded">
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(category.id)}
                          onChange={() => toggleCategory(category.id)}
                          className="mt-0.5 rounded border-gray-300 text-[#1c7430] focus:ring-[#1c7430]"
                        />
                        <span className="text-sm">{category.name}</span>
                      </label>
                    ))}
                  </div>
                  {selectedCategories.length === 0 && (
                    <p className="text-xs text-red-500 mt-2">
                      Please select at least one category
                    </p>
                  )}
                </div>

                {selectedCategories.length > 0 && (
                  <div>
                    <Label>Primary Category *</Label>
                    <p className="text-xs text-gray-500 mb-2">
                      The main category for this product
                    </p>
                    <select
                      value={primaryCategoryId}
                      onChange={(e) => setPrimaryCategoryId(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1c7430] bg-white dark:bg-gray-800"
                      required
                    >
                      <option value="">Select primary category</option>
                      {selectedCategories.map(catId => {
                        const category = categories.find(c => c.id === catId)
                        return category ? (
                          <option key={catId} value={catId}>
                            {category.name}
                          </option>
                        ) : null
                      })}
                    </select>
                  </div>
                )}

                <div>
                  <Label htmlFor="category">Legacy Category (for compatibility)</Label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1c7430] bg-white dark:bg-gray-800"
                  >
                    {legacyCategories.map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    Used for backward compatibility with existing features
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Nutritional Information</CardTitle>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={populateNutritionWithAI}
                    disabled={aiLoading || (!formData.description && !formData.ingredients)}
                    className="gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    {aiLoading ? 'Generating...' : 'AI Populate'}
                  </Button>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Click "AI Populate" to automatically fill nutrition data based on product description and ingredients
                </p>
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
