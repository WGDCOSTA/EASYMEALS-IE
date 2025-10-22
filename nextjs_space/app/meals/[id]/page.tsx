
'use client'

import { useEffect, useState } from 'react'
import { notFound, useRouter } from 'next/navigation'
import Image from 'next/image'
import { Clock, Users, Flame, Snowflake, Refrigerator } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { AddToCartButton } from '@/components/add-to-cart-button'
import { ProductAccordion } from '@/components/product-accordion'
import { NutritionValues } from '@/lib/gda-calculator'
import { AIGNutritionPopulator } from '@/components/ai-nutrition-populator'
import { AnimatedNutritionCircles } from '@/components/animated-nutrition-circles'
import { MacroBreakdownBar } from '@/components/macro-breakdown-bar'
import { DetailedNutritionPanel } from '@/components/detailed-nutrition-panel'
import { RelatedMeals } from '@/components/related-meals'

interface Product {
  id: string
  name: string
  description: string
  shortDescription?: string | null
  price: number
  originalPrice?: number | null
  imageUrl: string
  category: string
  storageType: string
  allergens: string[]
  calories?: number | null
  energyKj?: number | null
  protein?: number | null
  carbs?: number | null
  sugars?: number | null
  fat?: number | null
  saturatedFat?: number | null
  fiber?: number | null
  salt?: number | null
  preparationTime?: number | null
  servingSize?: number | null
  servingWeight?: number | null
  ingredients?: string | null
  cookingInstructions?: string | null
  storageInstructions?: string | null
  recyclingInfo?: string | null
  safetyInfo?: string | null
  hasVariations: boolean
  variationType?: string | null
  variationValue?: string | null
  variations?: Product[]
}

interface MealPageProps {
  params: {
    id: string
  }
}

export default function MealPage({ params }: MealPageProps) {
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedVariation, setSelectedVariation] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    async function fetchProduct() {
      try {
        const response = await fetch(`/api/products/${params.id}`)
        if (!response.ok) {
          notFound()
        }
        const data = await response.json()
        setProduct(data)
        if (data.hasVariations && data.variations && data.variations.length > 0) {
          setSelectedVariation(data.variations[0].id)
        }
      } catch (error) {
        console.error('Error fetching product:', error)
        notFound()
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="container mx-auto max-w-6xl px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-96 bg-gray-200 rounded-xl"></div>
            <div className="h-10 bg-gray-200 rounded w-3/4"></div>
            <div className="h-6 bg-gray-200 rounded w-full"></div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!product) {
    notFound()
  }

  const currentProduct = selectedVariation && product.variations
    ? product.variations.find(v => v.id === selectedVariation) || product
    : product

  const StorageIcon = currentProduct.storageType === 'FROZEN' ? Snowflake : Refrigerator

  const nutrition: NutritionValues | undefined = currentProduct.calories || currentProduct.protein || currentProduct.carbs || currentProduct.fat
    ? {
        energyKcal: currentProduct.calories || undefined,
        energy: currentProduct.energyKj || undefined,
        protein: currentProduct.protein || undefined,
        carbohydrates: currentProduct.carbs || undefined,
        sugars: currentProduct.sugars || undefined,
        fat: currentProduct.fat || undefined,
        saturates: currentProduct.saturatedFat || undefined,
        fiber: currentProduct.fiber || undefined,
        salt: currentProduct.salt || undefined,
      }
    : undefined

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto max-w-7xl px-4 py-8">
        <div className="grid grid-cols-1 gap-8">
          {/* Main Content - Full Width */}
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Product Image */}
              <div className="relative">
            <div className="relative aspect-video bg-gray-100 rounded-xl overflow-hidden">
              <Image
                src={currentProduct.imageUrl}
                alt={currentProduct.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
              <div className="absolute top-4 left-4 flex flex-col space-y-2">
                <Badge 
                  variant="secondary" 
                  className={`${
                    currentProduct.storageType === 'FROZEN' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-green-100 text-green-800'
                  }`}
                >
                  <StorageIcon className="w-3 h-3 mr-1" />
                  {currentProduct.storageType === 'FROZEN' ? 'Frozen' : 'Fresh Chilled'}
                </Badge>
                {currentProduct.originalPrice && currentProduct.originalPrice > currentProduct.price && (
                  <Badge variant="destructive" className="bg-red-500 text-white">
                    Save €{(currentProduct.originalPrice - currentProduct.price).toFixed(2)}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <Badge variant="outline" className="mb-2">
                {product.category.replace(/_/g, ' ')}
              </Badge>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {currentProduct.name}
              </h1>
              {/* Short Description - right below the product name */}
              {currentProduct.shortDescription && (
                <div 
                  className="text-lg text-gray-600 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: currentProduct.shortDescription }}
                />
              )}
            </div>

            <div className="flex items-center space-x-6 text-sm text-gray-600">
              {currentProduct.calories && (
                <div className="flex items-center space-x-1">
                  <Flame className="w-4 h-4" />
                  <span>{currentProduct.calories} cal</span>
                </div>
              )}
              {currentProduct.preparationTime && (
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{currentProduct.preparationTime} min</span>
                </div>
              )}
              {currentProduct.servingSize && (
                <div className="flex items-center space-x-1">
                  <Users className="w-4 h-4" />
                  <span>{currentProduct.servingSize} serving{currentProduct.servingSize > 1 ? 's' : ''}</span>
                </div>
              )}
            </div>

            {/* Product Variations */}
            {product.hasVariations && product.variations && product.variations.length > 0 && (
              <div className="bg-gray-50 rounded-lg p-4">
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  {product.variations[0].variationType 
                    ? product.variations[0].variationType.charAt(0).toUpperCase() + product.variations[0].variationType.slice(1)
                    : 'Select Option'}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {product.variations.map((variation) => (
                    <Button
                      key={variation.id}
                      variant={selectedVariation === variation.id ? 'default' : 'outline'}
                      className={`${
                        selectedVariation === variation.id
                          ? 'bg-easymeals-green hover:bg-easymeals-green/90 text-white'
                          : 'hover:border-easymeals-green'
                      }`}
                      onClick={() => setSelectedVariation(variation.id)}
                    >
                      <div className="text-left">
                        <div className="font-medium">{variation.variationValue}</div>
                        {variation.price !== currentProduct.price && (
                          <div className="text-xs">€{variation.price.toFixed(2)}</div>
                        )}
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center space-x-3 mb-4">
                {currentProduct.originalPrice && currentProduct.originalPrice > currentProduct.price && (
                  <div className="text-xl text-gray-400 line-through">
                    €{currentProduct.originalPrice.toFixed(2)}
                  </div>
                )}
                <div className="text-3xl font-bold text-orange-600">
                  €{currentProduct.price.toFixed(2)}
                </div>
              </div>
              
              <AddToCartButton 
                product={{
                  id: currentProduct.id,
                  name: currentProduct.name,
                  price: currentProduct.price,
                  imageUrl: currentProduct.imageUrl,
                  storageType: currentProduct.storageType
                }} 
              />

              <p className="text-sm text-gray-500 mt-3">
                Free delivery on orders over €30 • Cork delivery area
              </p>
            </div>

            {/* Ingredients Quick View */}
            {currentProduct.ingredients && (
              <div className="bg-white border rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-3">Ingredients</h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  {currentProduct.ingredients}
                </p>
              </div>
            )}
          </div>
        </div>

            {/* Product Full Description Section */}
            {currentProduct.description && (
              <div className="bg-white border rounded-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Description</h2>
                <div 
                  className="text-gray-700 leading-relaxed space-y-4"
                  style={{
                    fontSize: '1rem',
                    lineHeight: '1.75'
                  }}
                >
                  <style jsx>{`
                    div :global(h1), div :global(h2), div :global(h3) {
                      font-weight: 700;
                      color: #111827;
                      margin-bottom: 1rem;
                      margin-top: 1.5rem;
                    }
                    div :global(h1) { font-size: 1.875rem; }
                    div :global(h2) { font-size: 1.5rem; }
                    div :global(h3) { font-size: 1.25rem; }
                    div :global(h4) { font-size: 1.125rem; font-weight: 600; }
                    div :global(p) {
                      margin-bottom: 1rem;
                      color: #374151;
                      line-height: 1.75;
                    }
                    div :global(strong) {
                      font-weight: 600;
                      color: #111827;
                    }
                    div :global(ul), div :global(ol) {
                      margin-left: 1.5rem;
                      margin-bottom: 1rem;
                      list-style-position: outside;
                    }
                    div :global(ul) { list-style-type: disc; }
                    div :global(ol) { list-style-type: decimal; }
                    div :global(li) {
                      margin-bottom: 0.5rem;
                      color: #374151;
                    }
                    div :global(a) {
                      color: #059669;
                      text-decoration: underline;
                    }
                    div :global(a:hover) {
                      color: #047857;
                    }
                  `}</style>
                  <div dangerouslySetInnerHTML={{ __html: currentProduct.description }} />
                </div>
              </div>
            )}

            {/* AI Nutrition Populator */}
            {!currentProduct.calories && (
              <AIGNutritionPopulator
                productId={currentProduct.id}
                productName={currentProduct.name}
                ingredients={currentProduct.ingredients || undefined}
              />
            )}

            {/* Animated Nutrition Circles - Main Display */}
            {(currentProduct.calories || currentProduct.protein || currentProduct.carbs || currentProduct.fat) && (
              <div className="space-y-6">
                <AnimatedNutritionCircles
                  nutrition={{
                    calories: currentProduct.calories,
                    protein: currentProduct.protein,
                    carbs: currentProduct.carbs,
                    fat: currentProduct.fat,
                    fiber: currentProduct.fiber,
                  }}
                  servingWeight={currentProduct.servingWeight || 100}
                />

                {/* Macro Breakdown Bar */}
                <MacroBreakdownBar
                  protein={currentProduct.protein}
                  carbs={currentProduct.carbs}
                  fat={currentProduct.fat}
                />

                {/* Detailed Nutrition Panel */}
                <DetailedNutritionPanel
                  energyKj={currentProduct.energyKj}
                  sugars={currentProduct.sugars}
                  saturatedFat={currentProduct.saturatedFat}
                  salt={currentProduct.salt}
                  servingWeight={currentProduct.servingWeight || 100}
                />
              </div>
            )}

            {/* Product Information Accordion */}
            <div className="mt-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Additional Information</h2>
              <ProductAccordion
                nutrition={nutrition}
                servingSize={currentProduct.servingSize || 1}
                servingWeight={currentProduct.servingWeight || 300}
                storageType={currentProduct.storageType}
                cookingInstructions={currentProduct.cookingInstructions || undefined}
                storageInstructions={currentProduct.storageInstructions || undefined}
                recyclingInfo={currentProduct.recyclingInfo || undefined}
                safetyInfo={currentProduct.safetyInfo || undefined}
                allergens={currentProduct.allergens}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Related Meals Section */}
      <RelatedMeals
        currentProductId={currentProduct.id}
        category={product.category}
        storageType={currentProduct.storageType}
        limit={6}
      />
      
      <Footer />
    </div>
  )
}
