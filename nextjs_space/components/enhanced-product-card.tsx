
'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ShoppingCart, Star } from 'lucide-react'
import { AddToCartButton } from '@/components/add-to-cart-button'
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
    <div className="group relative bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover-lift">
      <Link href={`/meals/${product.id}`}>
        <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
          {hasDiscount && (
            <div className="transform transition-transform duration-300 group-hover:scale-110">
              <DiscountBadge
                discount={product.discount}
                originalPrice={product.originalPrice}
                currentPrice={product.price}
              />
            </div>
          )}
          {product.isBestOffer && (
            <div className="transform transition-transform duration-300 group-hover:scale-110">
              <BestOfferBadge />
            </div>
          )}
          {product.isTopSaver && (
            <div className="transform transition-transform duration-300 group-hover:scale-110">
              <TopSaverBadge />
            </div>
          )}
          
          <Image
            src={product.imageUrl || '/placeholder-meal.jpg'}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-110 group-hover:rotate-1 transition-all duration-700"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 340px"
          />
          
          {/* Gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        </div>
      </Link>

      <div className="p-5">
        <Link href={`/meals/${product.id}`}>
          <h3 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-easymeals-orange transition-all duration-300 transform group-hover:translate-x-1 line-clamp-2">
            {product.name}
          </h3>
        </Link>

        <p className="text-gray-600 text-sm mb-3 line-clamp-2 transition-colors duration-300 group-hover:text-gray-700">{product.description}</p>

        <div className="flex items-center gap-1 mb-3">
          {[1, 2, 3, 4, 5].map((star, index) => (
            <Star 
              key={star} 
              className="w-4 h-4 fill-yellow-400 text-yellow-400 transition-transform duration-300 hover:scale-125" 
              style={{transitionDelay: `${index * 50}ms`}}
            />
          ))}
          <span className="text-sm text-gray-500 ml-1">(4.5)</span>
        </div>

        <div className="flex items-center gap-2 mb-3">
          {product.limitedTimeOffer && (
            <div className="animate-pulse">
              <CountdownTimer targetDate={product.limitedTimeOffer} />
            </div>
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
            <span className="text-2xl font-bold text-gray-900 transition-all duration-300 group-hover:text-easymeals-orange group-hover:scale-110 inline-block">
              €{product.price.toFixed(2)}
            </span>
            {hasDiscount && product.originalPrice && (
              <span className="text-sm text-gray-500 line-through">
                €{product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>
          
          <AddToCartButton product={product} />
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100 transition-colors duration-300 group-hover:border-easymeals-green/30">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Storage:</span>
            <span className="font-semibold text-gray-700 transition-colors duration-300 group-hover:text-easymeals-green">{product.storageType}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
