
'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Plus, ShoppingCart, Snowflake, Refrigerator, Clock, Flame, Users, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useCartStore } from '@/lib/store'
import { useToast } from '@/hooks/use-toast'

interface Product {
  id: string
  name: string
  description: string
  price: number
  imageUrl: string
  category: string
  storageType: string
  allergens: string[]
  calories?: number | null
  preparationTime?: number | null
  servingSize?: number | null
}

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCartStore()
  const { toast } = useToast()

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    addItem({
      id: product?.id || '',
      name: product?.name || '',
      price: product?.price || 0,
      imageUrl: product?.imageUrl || '',
      storageType: product?.storageType || ''
    })

    toast({
      title: "Added to cart",
      description: `${product?.name || 'Item'} has been added to your cart.`,
      duration: 2000,
    })
  }

  const StorageIcon = product?.storageType === 'FROZEN' ? Snowflake : Refrigerator
  
  // Generate a consistent rating between 4.0-5.0 based on product ID
  const rating = 4.0 + (parseInt(product?.id?.slice(-2) || '50', 16) % 11) / 10

  return (
    <Link href={`/meals/${product?.id || ''}`}>
      <div className="group bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 h-full">
        <div className="relative aspect-[4/3] bg-gradient-to-br from-yellow-50 to-orange-50">
          {product?.imageUrl && (
            <Image
              src={product.imageUrl}
              alt={product?.name || 'Product image'}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          )}
          <div className="absolute top-3 left-3 flex gap-2">
            <Badge 
              className={`${
                product?.storageType === 'FROZEN' 
                  ? 'bg-blue-500 text-white hover:bg-blue-600' 
                  : 'bg-green-500 text-white hover:bg-green-600'
              } shadow-md`}
            >
              <StorageIcon className="w-3 h-3 mr-1" />
              {product?.storageType === 'FROZEN' ? 'Frozen' : 'Fresh'}
            </Badge>
          </div>
          
          {/* Star Rating Badge */}
          <div className="absolute top-3 right-3 bg-yellow-400 text-gray-900 px-2 py-1 rounded-full flex items-center gap-1 shadow-md font-semibold text-sm">
            <Star className="w-3.5 h-3.5 fill-gray-900" />
            {rating.toFixed(1)}
          </div>
          
          <Button
            onClick={handleAddToCart}
            size="sm"
            className="absolute bottom-3 right-3 bg-yellow-400 hover:bg-yellow-500 text-gray-900 opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg rounded-full h-10 w-10 p-0"
          >
            <Plus className="w-5 h-5" />
          </Button>
        </div>

        <div className="p-5">
          <div className="mb-3">
            <h3 className="font-bold text-xl text-gray-900 mb-1 line-clamp-2 group-hover:text-orange-600 transition-colors">
              {product?.name || 'Product Name'}
            </h3>
            <p className="text-gray-500 text-xs font-medium">
              {product?.category?.replace('_', ' ') || 'Category'}
            </p>
          </div>
          
          {/* Circular stat badges - matching the design references */}
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            {product?.preparationTime && (
              <div className="flex flex-col items-center justify-center bg-yellow-50 rounded-full h-14 w-14 border-2 border-yellow-200">
                <Clock className="w-4 h-4 text-yellow-600 mb-0.5" />
                <span className="text-xs font-bold text-gray-900">{product.preparationTime}m</span>
              </div>
            )}
            {product?.servingSize && (
              <div className="flex flex-col items-center justify-center bg-orange-50 rounded-full h-14 w-14 border-2 border-orange-200">
                <Users className="w-4 h-4 text-orange-600 mb-0.5" />
                <span className="text-xs font-bold text-gray-900">{product.servingSize}</span>
              </div>
            )}
            {product?.calories && (
              <div className="flex flex-col items-center justify-center bg-red-50 rounded-full h-14 w-14 border-2 border-red-200">
                <Flame className="w-4 h-4 text-red-600 mb-0.5" />
                <span className="text-xs font-bold text-gray-900">{product.calories}</span>
              </div>
            )}
          </div>

          <div className="flex justify-between items-center pt-3 border-t border-gray-100">
            <div className="text-2xl font-bold text-orange-500">
              €{product?.price?.toFixed(2) || '0.00'}
            </div>
            <Button
              onClick={handleAddToCart}
              size="sm"
              className="bg-orange-500 hover:bg-orange-600 text-white rounded-full px-4"
            >
              Add to Cart
            </Button>
          </div>
        </div>
      </div>
    </Link>
  )
}
