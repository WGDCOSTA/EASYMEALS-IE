
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Mail, Phone, MapPin, ShoppingCart, DollarSign, Package, TrendingUp } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import Image from 'next/image'

interface CustomerDetail {
  customer: any
  stats: any
  recentOrders: any[]
  subscriptions: any[]
  favoriteProducts: any[]
}

export default function CustomerDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [data, setData] = useState<CustomerDetail | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadCustomerData()
  }, [params.id])

  const loadCustomerData = async () => {
    try {
      const res = await fetch(`/api/admin/customers/${params.id}`)
      if (!res.ok) throw new Error('Failed to fetch')
      const customerData = await res.json()
      setData(customerData)
      setLoading(false)
    } catch (error) {
      console.error('Error loading customer:', error)
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      PROCESSING: 'bg-blue-100 text-blue-800',
      SHIPPED: 'bg-purple-100 text-purple-800',
      DELIVERED: 'bg-green-100 text-green-800',
      CANCELLED: 'bg-red-100 text-red-800'
    }
    return styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-800'
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-[400px]">Loading customer data...</div>
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold mb-2">Customer not found</h2>
        <Link href="/admin/customers">
          <Button variant="outline">Back to Customers</Button>
        </Link>
      </div>
    )
  }

  const { customer, stats, recentOrders, subscriptions, favoriteProducts } = data

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/customers">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </Link>
        <div>
          <h2 className="text-2xl font-bold">Customer Details</h2>
          <p className="text-sm text-gray-600">Complete customer profile and purchase history</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Customer Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-center">
              <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center">
                <span className="text-3xl font-bold text-orange-600">
                  {customer.firstName?.[0] || customer.name?.[0] || customer.email[0].toUpperCase()}
                </span>
              </div>
            </div>

            <div className="text-center">
              <h3 className="text-xl font-bold text-gray-900">
                {customer.firstName && customer.lastName 
                  ? `${customer.firstName} ${customer.lastName}` 
                  : customer.name || 'Guest User'}
              </h3>
              <Badge className="mt-2">{customer.role}</Badge>
            </div>

            <div className="space-y-3 pt-4 border-t">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="w-4 h-4 text-gray-400" />
                <span className="text-gray-700">{customer.email}</span>
              </div>

              {customer.phone && (
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-700">{customer.phone}</span>
                </div>
              )}

              {customer.address && (
                <div className="flex items-start gap-3 text-sm">
                  <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                  <span className="text-gray-700">{customer.address}</span>
                </div>
              )}

              <div className="flex items-center gap-3 text-sm">
                <ShoppingCart className="w-4 h-4 text-gray-400" />
                <span className="text-gray-700">
                  Member since {new Date(customer.createdAt).toLocaleDateString('en-IE')}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-2 space-y-6">
          <div className="grid md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <ShoppingCart className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
                  <p className="text-xs text-gray-600">Total Orders</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <DollarSign className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">€{stats.totalSpent.toFixed(2)}</p>
                  <p className="text-xs text-gray-600">Total Spent</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <TrendingUp className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">€{stats.avgOrderValue.toFixed(2)}</p>
                  <p className="text-xs text-gray-600">Avg Order Value</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <Package className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">{subscriptions.length}</p>
                  <p className="text-xs text-gray-600">Subscriptions</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Order Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {Object.entries(stats.ordersByStatus).map(([status, count]) => (
                  <div key={status} className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-lg font-bold text-gray-900">{count as number}</p>
                    <p className="text-xs text-gray-600">{status}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Favorite Products</CardTitle>
            </CardHeader>
            <CardContent>
              {favoriteProducts.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No purchase history yet</p>
              ) : (
                <div className="space-y-3">
                  {favoriteProducts.map((item: any, idx: number) => (
                    <div key={idx} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                      {item.product?.imageUrl && (
                        <div className="relative w-16 h-16 bg-gray-200 rounded flex-shrink-0">
                          <Image src={item.product.imageUrl} alt={item.product.name} fill className="object-cover rounded" />
                        </div>
                      )}
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{item.product?.name}</h4>
                        <p className="text-sm text-gray-600">Ordered {item.orderCount} times</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900">€{item.product?.price.toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
            </CardHeader>
            <CardContent>
              {recentOrders.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No orders yet</p>
              ) : (
                <div className="space-y-3">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="font-medium text-gray-900">Order #{order.id.slice(0, 8)}</span>
                          <Badge className={getStatusBadge(order.status)}>{order.status}</Badge>
                        </div>
                        <div className="text-sm text-gray-600">
                          {new Date(order.createdAt).toLocaleDateString('en-IE')} • {order.orderItems?.length || 0} items
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900">€{order.total.toFixed(2)}</p>
                        <Link href={`/admin/orders/${order.id}`}>
                          <Button variant="link" size="sm" className="text-orange-600 hover:text-orange-700">
                            View →
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
