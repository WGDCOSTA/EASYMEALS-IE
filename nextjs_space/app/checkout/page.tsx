
'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { CreditCard, MapPin, Truck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { useCartStore } from '@/lib/store'
import { useToast } from '@/hooks/use-toast'
import Image from 'next/image'

export default function CheckoutPage() {
  const { data: session } = useSession() || {}
  const router = useRouter()
  const { items, getTotalPrice, clearCart } = useCartStore()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [deliveryAddress, setDeliveryAddress] = useState('')

  useEffect(() => {
    useCartStore.persist.rehydrate()
  }, [])

  useEffect(() => {
    if (!session?.user) {
      router.push('/auth/signin')
    }
  }, [session, router])

  const deliveryFee = 4.99
  const subtotal = getTotalPrice()
  const total = subtotal + deliveryFee

  if (!items?.length) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto max-w-4xl px-4 py-12 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
          <Button asChild className="bg-orange-500 hover:bg-orange-600">
            <a href="/meals">Browse Meals</a>
          </Button>
        </div>
        <Footer />
      </div>
    )
  }

  const handleCheckout = async () => {
    if (!deliveryAddress.trim()) {
      toast({
        title: "Address required",
        description: "Please enter your delivery address.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          deliveryFee,
          deliveryAddress
        })
      })

      const { sessionId } = await response.json()

      if (!sessionId) {
        throw new Error('Failed to create checkout session')
      }

      // Redirect to Stripe Checkout URL manually
      window.location.href = `https://checkout.stripe.com/pay/${sessionId}`
    } catch (error) {
      console.error('Checkout error:', error)
      toast({
        title: "Checkout failed",
        description: "Please ensure Stripe credentials are configured properly.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Address */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center space-x-2 mb-4">
                <MapPin className="w-5 h-5 text-orange-500" />
                <h2 className="text-xl font-semibold text-gray-900">Delivery Address</h2>
              </div>
              
              <div>
                <Label htmlFor="address">Full Address *</Label>
                <Input
                  id="address"
                  type="text"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  placeholder="123 Patrick Street, Cork, Ireland"
                  className="mt-1"
                  required
                />
                <p className="text-sm text-gray-500 mt-2">
                  We currently deliver to Cork City and surrounding areas
                </p>
              </div>
            </div>

            {/* Delivery Info */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Truck className="w-5 h-5 text-green-500" />
                <h2 className="text-xl font-semibold text-gray-900">Delivery Information</h2>
              </div>
              
              <div className="space-y-3 text-sm text-gray-600">
                <p>• Fresh chilled meals stored at 0-5°C</p>
                <p>• Frozen meals maintained at ≤-18°C</p>
                <p>• Delivery available 4-6 days per week</p>
                <p>• Free delivery on orders over €30</p>
              </div>
            </div>

            {/* Payment */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center space-x-2 mb-4">
                <CreditCard className="w-5 h-5 text-blue-500" />
                <h2 className="text-xl font-semibold text-gray-900">Payment</h2>
              </div>
              
              <p className="text-gray-600 mb-4">
                You'll be redirected to Stripe's secure payment page to complete your order.
              </p>

              <Button
                onClick={handleCheckout}
                disabled={loading}
                className="w-full bg-orange-500 hover:bg-orange-600"
                size="lg"
              >
                {loading ? 'Processing...' : `Pay €${total.toFixed(2)} with Stripe`}
              </Button>

              <p className="text-xs text-gray-500 mt-3 text-center">
                Secure payment processing powered by Stripe
              </p>
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h3>
              
              {/* Items */}
              <div className="space-y-3 mb-4">
                {items?.map((item) => (
                  <div key={item?.id} className="flex items-center space-x-3">
                    <div className="relative w-12 h-12 bg-gray-100 rounded overflow-hidden">
                      <Image
                        src={item?.imageUrl || ''}
                        alt={item?.name || 'Product'}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate text-sm">
                        {item?.name || 'Product'}
                      </p>
                      <p className="text-xs text-gray-500">
                        Qty: {item?.quantity || 0}
                      </p>
                    </div>
                    <p className="font-semibold text-sm">
                      €{((item?.price || 0) * (item?.quantity || 0)).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
              
              <div className="border-t pt-4">
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-semibold">€{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Delivery</span>
                    <span className="font-semibold">€{deliveryFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-orange-600">€{total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}
