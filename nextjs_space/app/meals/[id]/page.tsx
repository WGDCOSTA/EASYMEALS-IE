
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { Clock, Users, Flame, Snowflake, Refrigerator, AlertTriangle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { AddToCartButton } from '@/components/add-to-cart-button'
import { prisma } from '@/lib/db'

interface MealPageProps {
  params: {
    id: string
  }
}

export default async function MealPage({ params }: MealPageProps) {
  const product = await prisma.product.findUnique({
    where: { id: params.id }
  })

  if (!product) {
    notFound()
  }

  const StorageIcon = product.storageType === 'FROZEN' ? Snowflake : Refrigerator

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="relative">
            <div className="relative aspect-video bg-gray-100 rounded-xl overflow-hidden">
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
              <div className="absolute top-4 left-4">
                <Badge 
                  variant="secondary" 
                  className={`${
                    product.storageType === 'FROZEN' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-green-100 text-green-800'
                  }`}
                >
                  <StorageIcon className="w-3 h-3 mr-1" />
                  {product.storageType === 'FROZEN' ? 'Frozen' : 'Fresh Chilled'}
                </Badge>
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <Badge variant="outline" className="mb-2">
                {product.category.replace('_', ' ')}
              </Badge>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {product.name}
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            <div className="flex items-center space-x-6 text-sm text-gray-600">
              {product.calories && (
                <div className="flex items-center space-x-1">
                  <Flame className="w-4 h-4" />
                  <span>{product.calories} cal</span>
                </div>
              )}
              {product.preparationTime && (
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{product.preparationTime} min</span>
                </div>
              )}
              {product.servingSize && (
                <div className="flex items-center space-x-1">
                  <Users className="w-4 h-4" />
                  <span>{product.servingSize} serving{product.servingSize > 1 ? 's' : ''}</span>
                </div>
              )}
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <div className="text-3xl font-bold text-orange-600 mb-4">
                €{product.price.toFixed(2)}
              </div>
              
              <AddToCartButton 
                product={{
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  imageUrl: product.imageUrl,
                  storageType: product.storageType
                }} 
              />

              <p className="text-sm text-gray-500 mt-3">
                Free delivery on orders over €30 • Cork delivery area
              </p>
            </div>

            {/* Nutrition Info */}
            {(product.protein || product.carbs || product.fat) && (
              <div className="bg-white border rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Nutritional Information</h3>
                <div className="grid grid-cols-3 gap-4 text-center">
                  {product.protein && (
                    <div>
                      <div className="text-lg font-bold text-gray-900">{product.protein}g</div>
                      <div className="text-sm text-gray-600">Protein</div>
                    </div>
                  )}
                  {product.carbs && (
                    <div>
                      <div className="text-lg font-bold text-gray-900">{product.carbs}g</div>
                      <div className="text-sm text-gray-600">Carbs</div>
                    </div>
                  )}
                  {product.fat && (
                    <div>
                      <div className="text-lg font-bold text-gray-900">{product.fat}g</div>
                      <div className="text-sm text-gray-600">Fat</div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Ingredients */}
            {product.ingredients && (
              <div className="bg-white border rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-3">Ingredients</h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  {product.ingredients}
                </p>
              </div>
            )}

            {/* Allergens */}
            {product.allergens.length > 0 && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                <div className="flex items-center space-x-2 mb-2">
                  <AlertTriangle className="w-5 h-5 text-orange-600" />
                  <h3 className="font-semibold text-orange-900">Allergen Information</h3>
                </div>
                <p className="text-orange-800 text-sm">
                  <span className="font-medium">Contains:</span> {product.allergens.join(', ')}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}
