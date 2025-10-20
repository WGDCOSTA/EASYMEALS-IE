
'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, MapPin, User, Package, CreditCard } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

interface OrderDetail {
  id: string
  orderNumber: string
  status: string
  subtotal: number
  deliveryFee: number
  total: number
  deliveryAddress: string
  scheduledFor: string | null
  notes: string | null
  paymentIntentId: string | null
  createdAt: string
  updatedAt: string
  user: {
    name: string | null
    email: string
    phone: string | null
  }
  orderItems: {
    id: string
    quantity: number
    price: number
    product: {
      id: string
      name: string
      imageUrl: string
      storageType: string
    }
  }[]
  deliveryZone: {
    name: string
  }
}

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  const [order, setOrder] = useState<OrderDetail | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadOrder()
  }, [])

  const loadOrder = async () => {
    try {
      const res = await fetch(`/api/admin/orders/${params.id}`)
      const data = await res.json()
      setOrder(data)
      setLoading(false)
    } catch (error) {
      console.error('Failed to load order:', error)
      setLoading(false)
    }
  }

  const updateOrderStatus = async (newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/orders/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })

      if (res.ok) {
        loadOrder()
      }
    } catch (error) {
      console.error('Failed to update order status:', error)
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-[400px]">Loading order...</div>
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <p className="text-lg text-red-600 mb-4">Order not found</p>
        <Link href="/admin/orders">
          <Button>Back to Orders</Button>
        </Link>
      </div>
    )
  }

  const statuses = [
    { value: 'PENDING', label: 'Pending' },
    { value: 'CONFIRMED', label: 'Confirmed' },
    { value: 'PREPARING', label: 'Preparing' },
    { value: 'OUT_FOR_DELIVERY', label: 'Out for Delivery' },
    { value: 'DELIVERED', label: 'Delivered' },
    { value: 'CANCELLED', label: 'Cancelled' }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/admin/orders">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h2 className="text-2xl font-bold">Order #{order.orderNumber}</h2>
            <p className="text-sm text-gray-600">
              {new Date(order.createdAt).toLocaleString('en-IE')}
            </p>
          </div>
        </div>

        {/* Status Update */}
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">Status:</span>
          <select
            value={order.status}
            onChange={(e) => updateOrderStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1c7430]"
          >
            {statuses.map(status => (
              <option key={status.value} value={status.value}>{status.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Order Items */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="w-5 h-5 mr-2" />
                Order Items
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.orderItems.map((item) => (
                  <div key={item.id} className="flex items-center p-4 bg-gray-50 rounded-lg">
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                      <Image
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 ml-4">
                      <h4 className="font-medium">{item.product.name}</h4>
                      <p className="text-sm text-gray-600">
                        {item.product.storageType.replace('_', ' & ')}
                      </p>
                      <p className="text-sm font-medium mt-1">
                        Quantity: {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">€{(item.price * item.quantity).toFixed(2)}</p>
                      <p className="text-sm text-gray-600">€{item.price.toFixed(2)} each</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Total */}
              <div className="mt-6 pt-6 border-t space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">€{order.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Delivery Fee</span>
                  <span className="font-medium">€{order.deliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t">
                  <span>Total</span>
                  <span>€{order.total.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {order.notes && (
            <Card>
              <CardHeader>
                <CardTitle>Order Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{order.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Customer & Delivery Info */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="w-5 h-5 mr-2" />
                Customer Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Name</p>
                <p className="font-medium">{order.user.name || 'Guest'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium">{order.user.email}</p>
              </div>
              {order.user.phone && (
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="font-medium">{order.user.phone}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                Delivery Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Address</p>
                <p className="font-medium">{order.deliveryAddress}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Delivery Zone</p>
                <p className="font-medium">{order.deliveryZone.name}</p>
              </div>
              {order.scheduledFor && (
                <div>
                  <p className="text-sm text-gray-600">Scheduled For</p>
                  <p className="font-medium">
                    {new Date(order.scheduledFor).toLocaleString('en-IE')}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {order.paymentIntentId && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="w-5 h-5 mr-2" />
                  Payment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <p className="text-sm text-gray-600">Payment ID</p>
                  <p className="font-mono text-xs mt-1 break-all">{order.paymentIntentId}</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
