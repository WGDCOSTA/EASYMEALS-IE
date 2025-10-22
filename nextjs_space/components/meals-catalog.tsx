
'use client'

import { useState, useEffect } from 'react'
import { Search, Filter, Flame, Pizza, Salad, Fish, UtensilsCrossed, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ProductCard } from '@/components/product-card'

interface Product {
  id: string
  name: string
  description: string
  price: number
  imageUrl: string
  category: string
  storageType: string
  allergens: string[]
  calories?: number
  preparationTime?: number
  servingSize?: number
}

const categories = [
  { value: 'all', label: 'All Meals', icon: Flame },
  { value: 'TRADITIONAL_IRISH', label: 'Irish', icon: UtensilsCrossed },
  { value: 'INTERNATIONAL', label: 'International', icon: Pizza },
  { value: 'HEALTHY', label: 'Healthy', icon: Salad },
  { value: 'VEGETARIAN', label: 'Vegetarian', icon: Sparkles },
  { value: 'SEAFOOD', label: 'Seafood', icon: Fish },
  { value: 'COMFORT_FOOD', label: 'Comfort', icon: Pizza },
]

export function MealsCatalog() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [storageFilter, setStorageFilter] = useState('all')

  useEffect(() => {
    fetchProducts()
  }, [categoryFilter, storageFilter, searchTerm])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (categoryFilter !== 'all') params.append('category', categoryFilter)
      if (storageFilter !== 'all') params.append('storage', storageFilter)
      if (searchTerm) params.append('search', searchTerm)

      const response = await fetch(`/api/products?${params}`)
      if (response.ok) {
        const data = await response.json()
        setProducts(data || [])
      }
    } catch (error) {
      console.error('Failed to fetch products:', error)
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      {/* Search Bar - Modern rounded style like in references */}
      <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            placeholder="Search any recipe or meal..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 pr-12 h-14 text-lg rounded-full border-2 border-gray-200 focus:border-yellow-400 transition-colors"
          />
          <Button
            size="icon"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-orange-500 hover:bg-orange-600 rounded-full h-10 w-10"
          >
            <Filter className="h-5 w-5" />
          </Button>
        </div>

        {/* Category Pills - Horizontal scroll like in references */}
        <div className="relative">
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((category) => {
              const Icon = category.icon
              const isActive = categoryFilter === category.value
              return (
                <button
                  key={category.value}
                  onClick={() => setCategoryFilter(category.value)}
                  className={`flex flex-col items-center justify-center min-w-[90px] px-4 py-3 rounded-2xl transition-all duration-200 ${
                    isActive
                      ? 'bg-yellow-400 text-gray-900 shadow-md scale-105'
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <div className={`${isActive ? 'bg-gray-900' : 'bg-white'} rounded-full p-2.5 mb-2 shadow-sm`}>
                    <Icon className={`h-5 w-5 ${isActive ? 'text-yellow-400' : 'text-gray-600'}`} />
                  </div>
                  <span className="text-xs font-semibold">{category.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Storage Type Filter */}
        <div className="mt-4 flex gap-3">
          <button
            onClick={() => setStorageFilter('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              storageFilter === 'all'
                ? 'bg-orange-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            All Types
          </button>
          <button
            onClick={() => setStorageFilter('FRESH_CHILLED')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              storageFilter === 'FRESH_CHILLED'
                ? 'bg-green-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Fresh Chilled
          </button>
          <button
            onClick={() => setStorageFilter('FROZEN')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              storageFilter === 'FROZEN'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Frozen
          </button>
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 aspect-[4/3] rounded-t-2xl"></div>
              <div className="bg-white p-5 rounded-b-2xl">
                <div className="h-5 bg-gray-200 rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      ) : products?.length > 0 ? (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {categoryFilter === 'all' ? 'Popular Meals' : `${categories.find(c => c.value === categoryFilter)?.label || ''} Meals`}
            </h2>
            <p className="text-gray-600 font-medium">
              {products.length} meal{products.length !== 1 ? 's' : ''}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard key={product?.id} product={product} />
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Filter className="h-10 w-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No meals found</h3>
          <p className="text-gray-600 mb-6">
            Try adjusting your search criteria or browse all meals.
          </p>
          <Button
            onClick={() => {
              setSearchTerm('')
              setCategoryFilter('all')
              setStorageFilter('all')
            }}
            className="bg-orange-500 hover:bg-orange-600 rounded-full px-6"
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  )
}
