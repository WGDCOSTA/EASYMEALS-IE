
'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { useCartStore } from '@/lib/store'
import { useToast } from '@/hooks/use-toast'
import Image from 'next/image'

export default function CartPage() {
  const { items, updateQuantity, removeItem, clearCart, getTotalPrice } = useCartStore()
  const { toast } = useToast()

  useEffect(() => {
    useCartStore.persist.rehydrate()
  }, [])

  const deliveryFee = 4.99
  const subtotal = getTotalPrice()
  const total = subtotal + deliveryFee

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeItem(id)
      toast({
        title: "Item removed",
        description: "Item has been removed from your cart.",
      })
    } else {
      updateQuantity(id, newQuantity)
    }
  }

  const handleRemoveItem = (id: string, name: string) => {
    removeItem(id)
    toast({
      title: "Item removed",
      description: `${name} has been removed from your cart.`,
    })
  }

  if (!items?.length) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        
        <div className="container mx-auto max-w-4xl px-4 py-12">
          <div className="text-center">
            <ShoppingBag className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">
              Add some delicious meals to get started!
            </p>
            <Button asChild size="lg" className="bg-orange-500 hover:bg-orange-600">
              <Link href="/meals">
                Browse Meals
              </Link>
            </Button>
          </div>
        </div>
        
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <div className="flex items-center mb-8">
          <Button asChild variant="ghost" size="sm">
            <Link href="/meals">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Continue Shopping
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Shopping Cart</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearCart}
                  className="text-red-600 hover:text-red-700"
                >
                  Clear Cart
                </Button>
              </div>

              <div className="space-y-4">
                {items?.map((item) => (
                  <div key={item?.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                    <div className="relative w-20 h-20 bg-gray-100 rounded-md overflow-hidden">
                      <Image
                        src={item?.imageUrl || ''}
                        alt={item?.name || 'Product image'}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {item?.name || 'Product'}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {item?.storageType === 'FROZEN' ? 'Frozen' : 'Fresh'}
                      </p>
                      <p className="text-lg font-bold text-orange-600">
                        €{item?.price?.toFixed(2) || '0.00'}
                      </p>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuantityChange(item?.id || '', (item?.quantity || 0) - 1)}
                        className="h-8 w-8 p-0"
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="text-center w-8 font-semibold">
                        {item?.quantity || 0}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuantityChange(item?.id || '', (item?.quantity || 0) + 1)}
                        className="h-8 w-8 p-0"
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveItem(item?.id || '', item?.name || '')}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h3>
              
              <div className="space-y-3 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">€{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery</span>
                  <span className="font-semibold">€{deliveryFee.toFixed(2)}</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between">
                    <span className="text-lg font-bold">Total</span>
                    <span className="text-lg font-bold text-orange-600">€{total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Button asChild className="w-full bg-orange-500 hover:bg-orange-600">
                  <Link href="/checkout">
                    Proceed to Checkout
                  </Link>
                </Button>
                
                <p className="text-xs text-gray-500 text-center">
                  Delivery available to Cork City and surrounding areas
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}
