
'use client'

import { useEffect, useState, useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ProductCard } from '@/components/product-card'

interface Product {
  id: string
  name: string
  description: string
  price: number
  originalPrice?: number | null
  imageUrl: string
  category: string
  storageType: string
  allergens: string[]
  calories?: number | null
  preparationTime?: number | null
  servingSize?: number | null
  discount?: number | null
  stockQuantity: number
  stockAlert?: number | null
  limitedTimeOffer?: Date | null
}

interface ProductCarouselProps {
  title: string
  description?: string
  products: Product[]
  className?: string
}

export function ProductCarousel({ title, description, products, className = '' }: ProductCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const checkScroll = () => {
    if (!scrollContainerRef.current) return
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
    setCanScrollLeft(scrollLeft > 0)
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
  }

  useEffect(() => {
    checkScroll()
    window.addEventListener('resize', checkScroll)
    return () => window.removeEventListener('resize', checkScroll)
  }, [])

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return
    const scrollAmount = 400
    const newScrollPosition =
      scrollContainerRef.current.scrollLeft +
      (direction === 'left' ? -scrollAmount : scrollAmount)
    scrollContainerRef.current.scrollTo({
      left: newScrollPosition,
      behavior: 'smooth'
    })
    setTimeout(checkScroll, 400)
  }

  if (!products || products.length === 0) return null

  return (
    <div className={`relative ${className}`}>
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-4xl font-bold text-gray-900 mb-2">{title}</h2>
          {description && <p className="text-lg text-gray-600">{description}</p>}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            className="rounded-full"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            className="rounded-full"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div
        ref={scrollContainerRef}
        onScroll={checkScroll}
        className="flex gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {products.map((product) => (
          <div key={product.id} className="snap-start flex-shrink-0 w-[340px]">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  )
}
