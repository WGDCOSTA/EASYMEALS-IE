
'use client'

import { useState, useEffect } from 'react'
import { ProductCard } from '@/components/product-card'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Product {
  id: string
  name: string
  description: string
  price: number
  salePrice?: number
  originalPrice?: number
  imageUrl: string
  category: string
  storageType: string
  allergens: string[]
  calories?: number
  preparationTime?: number
  servingSize?: number
}

interface RelatedMealsProps {
  currentProductId: string
  category: string
  storageType?: string
  limit?: number
}

export function RelatedMeals({ 
  currentProductId, 
  category, 
  storageType,
  limit = 6 
}: RelatedMealsProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [startIndex, setStartIndex] = useState(0)

  useEffect(() => {
    fetchRelatedProducts()
  }, [currentProductId, category])

  const fetchRelatedProducts = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      params.append('category', category)
      if (storageType) {
        params.append('storage', storageType)
      }

      const response = await fetch(`/api/products?${params}`)
      if (response.ok) {
        const data = await response.json()
        // Filter out current product and limit results
        const filtered = data
          ?.filter((p: Product) => p?.id !== currentProductId)
          ?.slice(0, limit * 2) || [] // Get more for scrolling
        setProducts(filtered)
      }
    } catch (error) {
      console.error('Failed to fetch related products:', error)
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  const visibleProducts = products?.slice(startIndex, startIndex + 3) || []

  const handlePrev = () => {
    setStartIndex(Math.max(0, startIndex - 1))
  }

  const handleNext = () => {
    setStartIndex(Math.min((products?.length || 0) - 3, startIndex + 1))
  }

  if (loading) {
    return (
      <div className="py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">You May Also Like</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
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
      </div>
    )
  }

  if (!products || products.length === 0) {
    return null
  }

  return (
    <div className="py-12 bg-white">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            You May Also Like
          </h2>
          {products.length > 3 && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={handlePrev}
                disabled={startIndex === 0}
                className="rounded-full"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={handleNext}
                disabled={startIndex >= (products?.length || 0) - 3}
                className="rounded-full"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visibleProducts.map((product) => (
            <ProductCard key={product?.id} product={product} />
          ))}
        </div>

        {/* Show all button on mobile */}
        {products.length > 3 && (
          <div className="mt-6 text-center lg:hidden">
            <p className="text-sm text-gray-600">
              Showing {startIndex + 1}-{Math.min(startIndex + 3, products.length)} of {products.length} similar meals
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
