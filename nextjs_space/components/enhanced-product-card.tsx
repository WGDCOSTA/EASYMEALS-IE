
'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ShoppingCart, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CountdownTimer, StockAlert, DiscountBadge, BestOfferBadge, TopSaverBadge } from '@/components/sales-triggers'

interface EnhancedProductCardProps {
  product: {
    id: string
    name: string
    description: string
    price: number
    originalPrice?: number | null
    imageUrl: string
    category: string
    storageType: string
    discount?: number | null
    stockQuantity: number
    stockAlert?: number | null
    limitedTimeOffer?: Date | null
    isBestOffer?: boolean
    isTopSaver?: boolean
  }
}

export function EnhancedProductCard({ product }: EnhancedProductCardProps) {
  const hasDiscount = product.discount || (product.originalPrice && product.originalPrice > product.price)

  return (
    <div className="group relative bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100">
      <Link href={`/meals/${product.id}`}>
        <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
          {hasDiscount && (
            <DiscountBadge
              discount={product.discount}
              originalPrice={product.originalPrice}
              currentPrice={product.price}
            />
          )}
          {product.isBestOffer && <BestOfferBadge />}
          {product.isTopSaver && <TopSaverBadge />}
          
          <Image
            src={product.imageUrl || '/placeholder-meal.jpg'}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 340px"
          />
        </div>
      </Link>

      <div className="p-5">
        <Link href={`/meals/${product.id}`}>
          <h3 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-easymeals-orange transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>

        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>

        <div className="flex items-center gap-1 mb-3">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star key={star} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          ))}
          <span className="text-sm text-gray-500 ml-1">(4.5)</span>
        </div>

        <div className="flex items-center gap-2 mb-3">
          {product.limitedTimeOffer && (
            <CountdownTimer targetDate={product.limitedTimeOffer} />
          )}
        </div>

        <div className="mb-4">
          <StockAlert
            stockQuantity={product.stockQuantity}
            stockAlert={product.stockAlert}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-gray-900">€{product.price.toFixed(2)}</span>
            {hasDiscount && product.originalPrice && (
              <span className="text-sm text-gray-500 line-through">
                €{product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>
          
          <Button
            size="sm"
            className="bg-easymeals-orange hover:bg-easymeals-orange/90 text-white rounded-full"
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Add
          </Button>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Storage:</span>
            <span className="font-semibold text-gray-700">{product.storageType}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
