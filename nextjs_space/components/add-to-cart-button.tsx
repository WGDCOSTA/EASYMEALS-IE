
'use client'

import { Plus, ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCartStore } from '@/lib/store'
import { useToast } from '@/hooks/use-toast'

interface Product {
  id: string
  name: string
  price: number
  imageUrl: string
  storageType: string
}

interface AddToCartButtonProps {
  product: Product
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const { addItem } = useCartStore()
  const { toast } = useToast()

  const handleAddToCart = () => {
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

  return (
    <Button 
      onClick={handleAddToCart}
      size="lg"
      className="w-full bg-orange-500 hover:bg-orange-600"
    >
      <Plus className="w-5 h-5 mr-2" />
      Add to Cart
    </Button>
  )
}
