
'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { CheckCircle, ArrowRight, ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import Link from 'next/link'
import { useCartStore } from '@/lib/store'

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams()
  const sessionId = searchParams?.get('session_id')
  const { clearCart } = useCartStore()
  const [orderNumber, setOrderNumber] = useState<string | null>(null)

  useEffect(() => {
    if (sessionId) {
      // Clear the cart after successful payment
      clearCart()
      // Generate a mock order number for display
      setOrderNumber(`EM-${Date.now().toString().slice(-6)}`)
    }
  }, [sessionId, clearCart])

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto max-w-2xl px-4 py-16">
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Order Confirmed!
          </h1>
          
          <p className="text-lg text-gray-600 mb-6">
            Thank you for your order. Your delicious meals are being prepared and will be delivered soon.
          </p>

          {orderNumber && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600">Order Number</p>
              <p className="text-xl font-bold text-gray-900">{orderNumber}</p>
            </div>
          )}

          <div className="space-y-4 mb-8">
            <div className="flex items-center space-x-3 text-left">
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-orange-600 font-bold text-sm">1</span>
              </div>
              <div>
                <p className="font-semibold text-gray-900">Order Confirmed</p>
                <p className="text-sm text-gray-600">Your payment has been processed successfully</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 text-left">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-gray-600 font-bold text-sm">2</span>
              </div>
              <div>
                <p className="font-semibold text-gray-600">Preparing Your Meals</p>
                <p className="text-sm text-gray-600">Our chefs are preparing your order</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 text-left">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-gray-600 font-bold text-sm">3</span>
              </div>
              <div>
                <p className="font-semibold text-gray-600">Out for Delivery</p>
                <p className="text-sm text-gray-600">Fresh delivery to your door in Cork</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="bg-orange-500 hover:bg-orange-600">
              <Link href="/meals">
                <ShoppingBag className="w-4 h-4 mr-2" />
                Continue Shopping
              </Link>
            </Button>
            
            <Button asChild variant="outline">
              <Link href="/orders">
                View Order History
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>

          <div className="mt-8 pt-6 border-t">
            <p className="text-sm text-gray-500">
              You'll receive an email confirmation shortly with your order details and tracking information.
            </p>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}
