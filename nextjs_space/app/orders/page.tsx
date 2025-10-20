
'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Package, Calendar, MapPin, CreditCard, ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import Link from 'next/link'

export default function OrdersPage() {
  const { data: session } = useSession() || {}
  const router = useRouter()

  useEffect(() => {
    if (!session?.user) {
      router.push('/auth/signin')
    }
  }, [session, router])

  if (!session?.user) {
    return null
  }

  // Mock orders data - in a real app, this would be fetched from the API
  const orders = [
    {
      id: 'EM-123456',
      date: '2025-10-18',
      status: 'delivered',
      total: 29.98,
      items: 3,
      deliveryAddress: '123 Patrick Street, Cork'
    },
    {
      id: 'EM-123455',
      date: '2025-10-15',
      status: 'preparing',
      total: 45.97,
      items: 4,
      deliveryAddress: '123 Patrick Street, Cork'
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800'
      case 'preparing':
        return 'bg-orange-100 text-orange-800'
      case 'out_for_delivery':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'Delivered'
      case 'preparing':
        return 'Preparing'
      case 'out_for_delivery':
        return 'Out for Delivery'
      default:
        return 'Pending'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto max-w-4xl px-4 py-12">
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
            <Package className="w-5 h-5 text-orange-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Order History</h1>
            <p className="text-gray-600">Track your meal deliveries</p>
          </div>
        </div>

        {orders.length > 0 ? (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Order #{order.id}
                      </h3>
                      <Badge className={getStatusColor(order.status)}>
                        {getStatusText(order.status)}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(order.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <ShoppingBag className="w-4 h-4" />
                        <span>{order.items} items</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-orange-600">
                      €{order.total.toFixed(2)}
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-2 mb-4">
                  <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-600">Delivery Address</p>
                    <p className="text-sm font-medium text-gray-900">{order.deliveryAddress}</p>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t">
                  <div className="flex items-center space-x-2">
                    <CreditCard className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">Paid with card</span>
                  </div>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <Package className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No orders yet</h2>
            <p className="text-gray-600 mb-6">
              You haven't placed any orders yet. Start browsing our delicious meals!
            </p>
            <Button asChild className="bg-orange-500 hover:bg-orange-600">
              <Link href="/meals">
                Browse Meals
              </Link>
            </Button>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  )
}
