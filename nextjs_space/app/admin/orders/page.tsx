
'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, Eye, Package, Truck, CheckCircle, XCircle, Clock } from 'lucide-react'
import Link from 'next/link'

interface Order {
  id: string
  orderNumber: string
  status: string
  subtotal: number
  deliveryFee: number
  total: number
  deliveryAddress: string
  scheduledFor: string | null
  createdAt: string
  user: {
    name: string | null
    email: string
  }
  orderItems: {
    id: string
    quantity: number
    price: number
    product: {
      name: string
    }
  }[]
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    loadOrders()
  }, [])

  useEffect(() => {
    filterOrders()
  }, [searchQuery, statusFilter, orders])

  const loadOrders = async () => {
    try {
      const res = await fetch('/api/admin/orders')
      const data = await res.json()
      setOrders(data)
      setFilteredOrders(data)
      setLoading(false)
    } catch (error) {
      console.error('Failed to load orders:', error)
      setLoading(false)
    }
  }

  const filterOrders = () => {
    let filtered = orders

    if (searchQuery) {
      filtered = filtered.filter(o =>
        o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (o.user.name && o.user.name.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    if (statusFilter && statusFilter !== 'all') {
      filtered = filtered.filter(o => o.status === statusFilter)
    }

    setFilteredOrders(filtered)
  }

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })

      if (res.ok) {
        loadOrders()
      }
    } catch (error) {
      console.error('Failed to update order status:', error)
    }
  }

  const statuses = [
    { value: 'all', label: 'All Orders' },
    { value: 'PENDING', label: 'Pending', icon: Clock, color: 'bg-yellow-100 text-yellow-800' },
    { value: 'CONFIRMED', label: 'Confirmed', icon: CheckCircle, color: 'bg-blue-100 text-blue-800' },
    { value: 'PREPARING', label: 'Preparing', icon: Package, color: 'bg-purple-100 text-purple-800' },
    { value: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', icon: Truck, color: 'bg-orange-100 text-orange-800' },
    { value: 'DELIVERED', label: 'Delivered', icon: CheckCircle, color: 'bg-green-100 text-green-800' },
    { value: 'CANCELLED', label: 'Cancelled', icon: XCircle, color: 'bg-red-100 text-red-800' }
  ]

  const getStatusIcon = (status: string) => {
    const statusObj = statuses.find(s => s.value === status)
    if (!statusObj || !statusObj.icon) return null
    const Icon = statusObj.icon
    return <Icon className="w-4 h-4 mr-1" />
  }

  const getStatusColor = (status: string) => {
    const statusObj = statuses.find(s => s.value === status)
    return statusObj?.color || 'bg-gray-100 text-gray-800'
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-[400px]">Loading orders...</div>
  }

  // Calculate stats
  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'PENDING').length,
    confirmed: orders.filter(o => o.status === 'CONFIRMED').length,
    preparing: orders.filter(o => o.status === 'PREPARING').length,
    outForDelivery: orders.filter(o => o.status === 'OUT_FOR_DELIVERY').length,
    delivered: orders.filter(o => o.status === 'DELIVERED').length,
    cancelled: orders.filter(o => o.status === 'CANCELLED').length
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">Orders</h2>
        <p className="text-sm text-gray-600 mt-1">{orders.length} total orders</p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-7">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold">{stats.pending}</p>
              <p className="text-xs text-gray-600">Pending</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold">{stats.confirmed}</p>
              <p className="text-xs text-gray-600">Confirmed</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold">{stats.preparing}</p>
              <p className="text-xs text-gray-600">Preparing</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold">{stats.outForDelivery}</p>
              <p className="text-xs text-gray-600">Out</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold">{stats.delivered}</p>
              <p className="text-xs text-gray-600">Delivered</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold">{stats.cancelled}</p>
              <p className="text-xs text-gray-600">Cancelled</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold">{stats.total}</p>
              <p className="text-xs text-gray-600">Total</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search orders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1c7430]"
            >
              {statuses.map(status => (
                <option key={status.value} value={status.value}>{status.label}</option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                      No orders found
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            #{order.orderNumber}
                          </div>
                          <div className="text-sm text-gray-500">
                            {order.orderItems.length} item(s)
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {order.user.name || 'Guest'}
                          </div>
                          <div className="text-sm text-gray-500">{order.user.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {new Date(order.createdAt).toLocaleDateString('en-IE')}
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(order.createdAt).toLocaleTimeString('en-IE', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          €{order.total.toFixed(2)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                          className={`
                            inline-flex items-center px-2.5 py-1.5 rounded-full text-xs font-medium
                            focus:outline-none focus:ring-2 focus:ring-[#1c7430]
                            ${getStatusColor(order.status)}
                          `}
                        >
                          {statuses.filter(s => s.value !== 'all').map(status => (
                            <option key={status.value} value={status.value}>
                              {status.label}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="text-[#1c7430] hover:text-[#155225]"
                        >
                          <Eye className="w-4 h-4 inline" />
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
