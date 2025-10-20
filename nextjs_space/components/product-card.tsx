
'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Plus, ShoppingCart, Snowflake, Refrigerator } from 'lucide-react'
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

  return (
    <Link href={`/meals/${product?.id || ''}`}>
      <div className="group bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 h-full">
        <div className="relative aspect-video bg-gray-100">
          {product?.imageUrl && (
            <Image
              src={product.imageUrl}
              alt={product?.name || 'Product image'}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          )}
          <div className="absolute top-2 left-2">
            <Badge 
              variant="secondary" 
              className={`${
                product?.storageType === 'FROZEN' 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'bg-green-100 text-green-800'
              }`}
            >
              <StorageIcon className="w-3 h-3 mr-1" />
              {product?.storageType === 'FROZEN' ? 'Frozen' : 'Fresh'}
            </Badge>
          </div>
          <Button
            onClick={handleAddToCart}
            size="sm"
            className="absolute bottom-2 right-2 bg-orange-500 hover:bg-orange-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        <div className="p-4">
          <div className="mb-2">
            <Badge variant="outline" className="text-xs">
              {product?.category?.replace('_', ' ') || 'Category'}
            </Badge>
          </div>
          
          <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors">
            {product?.name || 'Product Name'}
          </h3>
          
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {product?.description || 'No description available'}
          </p>

          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center space-x-4 text-xs text-gray-500">
              {product?.calories && (
                <span>{product.calories} cal</span>
              )}
              {product?.preparationTime && (
                <span>{product.preparationTime} min</span>
              )}
            </div>
            <div className="text-xl font-bold text-orange-600">
              €{product?.price?.toFixed(2) || '0.00'}
            </div>
          </div>

          {product?.allergens?.length > 0 && (
            <div className="text-xs text-gray-500">
              <span className="font-medium">Contains:</span> {product.allergens.join(', ')}
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
