
'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  DollarSign, 
  ShoppingCart, 
  Users, 
  Package,
  TrendingUp,
  TrendingDown,
  Clock
} from 'lucide-react'
import Link from 'next/link'

interface DashboardStats {
  revenue: {
    total: number
    change: number
  }
  orders: {
    total: number
    pending: number
    change: number
  }
  customers: {
    total: number
    new: number
  }
  products: {
    total: number
    lowStock: number
  }
  recentOrders: any[]
  topProducts: any[]
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/dashboard')
      .then(res => res.json())
      .then(data => {
        setStats(data)
        setLoading(false)
      })
      .catch(err => {
        console.error('Failed to load dashboard:', err)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-lg">Loading dashboard...</div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-lg text-red-600">Failed to load dashboard data</div>
      </div>
    )
  }

  const statCards = [
    {
      title: 'Total Revenue',
      value: `€${stats.revenue.total.toLocaleString('en-IE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      change: stats.revenue.change,
      icon: DollarSign,
      color: 'bg-green-500'
    },
    {
      title: 'Orders',
      value: stats.orders.total.toString(),
      subtitle: `${stats.orders.pending} pending`,
      change: stats.orders.change,
      icon: ShoppingCart,
      color: 'bg-blue-500'
    },
    {
      title: 'Customers',
      value: stats.customers.total.toString(),
      subtitle: `${stats.customers.new} new this month`,
      icon: Users,
      color: 'bg-purple-500'
    },
    {
      title: 'Products',
      value: stats.products.total.toString(),
      subtitle: `${stats.products.lowStock} low stock`,
      icon: Package,
      color: 'bg-orange-500'
    }
  ]

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <h3 className="text-2xl font-bold mt-2">{stat.value}</h3>
                  {stat.subtitle && (
                    <p className="text-xs text-gray-500 mt-1">{stat.subtitle}</p>
                  )}
                  {stat.change !== undefined && (
                    <div className="flex items-center mt-2">
                      {stat.change >= 0 ? (
                        <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                      )}
                      <span className={`text-sm font-medium ${stat.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {Math.abs(stat.change)}% from last month
                      </span>
                    </div>
                  )}
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Orders & Top Products */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentOrders.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">No orders yet</p>
              ) : (
                stats.recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-sm">#{order.orderNumber}</p>
                      <p className="text-xs text-gray-600">{order.user?.name || order.user?.email}</p>
                      <div className="flex items-center mt-1">
                        <Clock className="w-3 h-3 text-gray-400 mr-1" />
                        <p className="text-xs text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString('en-IE')}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">€{order.total.toFixed(2)}</p>
                      <span className={`
                        inline-block px-2 py-1 text-xs font-medium rounded-full mt-1
                        ${order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : ''}
                        ${order.status === 'CONFIRMED' ? 'bg-blue-100 text-blue-800' : ''}
                        ${order.status === 'PREPARING' ? 'bg-purple-100 text-purple-800' : ''}
                        ${order.status === 'OUT_FOR_DELIVERY' ? 'bg-orange-100 text-orange-800' : ''}
                        ${order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' : ''}
                        ${order.status === 'CANCELLED' ? 'bg-red-100 text-red-800' : ''}
                      `}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
            <Link 
              href="/admin/orders" 
              className="block mt-4 text-sm text-[#1c7430] hover:underline text-center"
            >
              View all orders →
            </Link>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle>Top Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.topProducts.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">No sales data yet</p>
              ) : (
                stats.topProducts.map((product, index) => (
                  <div key={product.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center flex-1">
                      <span className="flex items-center justify-center w-8 h-8 bg-[#1c7430] text-white rounded-full text-sm font-bold mr-3">
                        {index + 1}
                      </span>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{product.name}</p>
                        <p className="text-xs text-gray-600">{product.category}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{product._count?.orderItems || 0} sold</p>
                      <p className="text-xs text-gray-600">€{product.price.toFixed(2)}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
            <Link 
              href="/admin/products" 
              className="block mt-4 text-sm text-[#1c7430] hover:underline text-center"
            >
              View all products →
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
