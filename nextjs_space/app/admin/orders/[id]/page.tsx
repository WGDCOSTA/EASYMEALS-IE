
'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  ArrowLeft, MapPin, User, Package, CreditCard, Printer, FileText, 
  Truck, Clock, MessageSquare, History, Save, ExternalLink 
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { toast } from 'sonner'

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
  internalNotes: string | null
  paymentIntentId: string | null
  trackingNumber: string | null
  trackingUrl: string | null
  courierName: string | null
  estimatedDeliveryDate: string | null
  actualDeliveryDate: string | null
  createdAt: string
  updatedAt: string
  user: {
    name: string | null
    email: string
    phone: string | null
    address: string | null
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
      sku: string | null
    }
  }[]
  deliveryZone: {
    name: string
  }
  orderHistory: {
    id: string
    status: string
    notes: string | null
    createdAt: string
  }[]
  orderNotes: {
    id: string
    note: string
    isInternal: boolean
    createdAt: string
  }[]
}

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  const [order, setOrder] = useState<OrderDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  
  // Tracking form state
  const [trackingForm, setTrackingForm] = useState({
    trackingNumber: '',
    trackingUrl: '',
    courierName: '',
    estimatedDeliveryDate: ''
  })
  
  // Note form state
  const [newNote, setNewNote] = useState('')
  const [isInternalNote, setIsInternalNote] = useState(false)

  useEffect(() => {
    loadOrder()
  }, [])

  useEffect(() => {
    if (order) {
      setTrackingForm({
        trackingNumber: order.trackingNumber || '',
        trackingUrl: order.trackingUrl || '',
        courierName: order.courierName || '',
        estimatedDeliveryDate: order.estimatedDeliveryDate ? new Date(order.estimatedDeliveryDate).toISOString().slice(0, 16) : ''
      })
    }
  }, [order])

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
        toast.success('Order status updated')
        loadOrder()
      } else {
        toast.error('Failed to update status')
      }
    } catch (error) {
      console.error('Failed to update order status:', error)
      toast.error('Failed to update status')
    }
  }

  const updateTracking = async () => {
    try {
      const res = await fetch(`/api/admin/orders/${params.id}/tracking`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...trackingForm,
          estimatedDeliveryDate: trackingForm.estimatedDeliveryDate || null
        })
      })

      if (res.ok) {
        toast.success('Tracking information updated')
        loadOrder()
      } else {
        toast.error('Failed to update tracking')
      }
    } catch (error) {
      console.error('Failed to update tracking:', error)
      toast.error('Failed to update tracking')
    }
  }

  const addNote = async () => {
    if (!newNote.trim()) return

    try {
      const res = await fetch(`/api/admin/orders/${params.id}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          note: newNote,
          isInternal: isInternalNote
        })
      })

      if (res.ok) {
        toast.success('Note added')
        setNewNote('')
        setIsInternalNote(false)
        loadOrder()
      } else {
        toast.error('Failed to add note')
      }
    } catch (error) {
      console.error('Failed to add note:', error)
      toast.error('Failed to add note')
    }
  }

  const openInvoice = () => {
    window.open(`/api/admin/orders/${params.id}/invoice`, '_blank')
  }

  const openDeliverySlip = () => {
    window.open(`/api/admin/orders/${params.id}/delivery-slip`, '_blank')
  }

  const printInvoice = () => {
    const win = window.open(`/api/admin/orders/${params.id}/invoice`, '_blank')
    if (win) {
      win.onload = () => {
        win.print()
      }
    }
  }

  const printDeliverySlip = () => {
    const win = window.open(`/api/admin/orders/${params.id}/delivery-slip`, '_blank')
    if (win) {
      win.onload = () => {
        win.print()
      }
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
      <div className="flex items-center justify-between flex-wrap gap-4">
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

        {/* Quick Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={openInvoice}
          >
            <FileText className="w-4 h-4 mr-2" />
            View Invoice
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={printInvoice}
          >
            <Printer className="w-4 h-4 mr-2" />
            Print Invoice
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={openDeliverySlip}
          >
            <Package className="w-4 h-4 mr-2" />
            Delivery Slip
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={printDeliverySlip}
          >
            <Printer className="w-4 h-4 mr-2" />
            Print Slip
          </Button>
        </div>
      </div>

      {/* Status Update Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium">Order Status:</span>
              <select
                value={order.status}
                onChange={(e) => updateOrderStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1c7430] bg-white dark:bg-gray-800"
              >
                {statuses.map(status => (
                  <option key={status.value} value={status.value}>{status.label}</option>
                ))}
              </select>
            </div>
            {order.trackingNumber && (
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-gray-500" />
                <span className="text-sm">Tracking: <strong>{order.trackingNumber}</strong></span>
                {order.trackingUrl && (
                  <a href={order.trackingUrl} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm">
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </a>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="tracking">Tracking</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
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
                      <div key={item.id} className="flex items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
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
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            SKU: {item.product.sku || 'N/A'} | {item.product.storageType.replace('_', ' & ')}
                          </p>
                          <p className="text-sm font-medium mt-1">
                            Quantity: {item.quantity}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">€{(item.price * item.quantity).toFixed(2)}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">€{item.price.toFixed(2)} each</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Total */}
                  <div className="mt-6 pt-6 border-t space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                      <span className="font-medium">€{order.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Delivery Fee</span>
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
                    <CardTitle>Customer Notes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 dark:text-gray-300">{order.notes}</p>
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
                    <p className="text-sm text-gray-600 dark:text-gray-400">Name</p>
                    <p className="font-medium">{order.user.name || 'Guest'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
                    <p className="font-medium break-all">{order.user.email}</p>
                  </div>
                  {order.user.phone && (
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Phone</p>
                      <p className="font-medium">{order.user.phone}</p>
                    </div>
                  )}
                  {order.user.address && (
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Billing Address</p>
                      <p className="font-medium">{order.user.address}</p>
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
                    <p className="text-sm text-gray-600 dark:text-gray-400">Address</p>
                    <p className="font-medium">{order.deliveryAddress}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Delivery Zone</p>
                    <p className="font-medium">{order.deliveryZone.name}</p>
                  </div>
                  {order.scheduledFor && (
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Scheduled For</p>
                      <p className="font-medium">
                        {new Date(order.scheduledFor).toLocaleString('en-IE')}
                      </p>
                    </div>
                  )}
                  {order.estimatedDeliveryDate && (
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Estimated Delivery</p>
                      <p className="font-medium">
                        {new Date(order.estimatedDeliveryDate).toLocaleString('en-IE')}
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
                      <p className="text-sm text-gray-600 dark:text-gray-400">Payment ID</p>
                      <p className="font-mono text-xs mt-1 break-all">{order.paymentIntentId}</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        {/* Tracking Tab */}
        <TabsContent value="tracking" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Truck className="w-5 h-5 mr-2" />
                Package Tracking
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="courierName">Courier Name</Label>
                  <Input
                    id="courierName"
                    value={trackingForm.courierName}
                    onChange={(e) => setTrackingForm(prev => ({ ...prev, courierName: e.target.value }))}
                    placeholder="e.g., DPD, An Post, Fastway"
                  />
                </div>
                <div>
                  <Label htmlFor="trackingNumber">Tracking Number</Label>
                  <Input
                    id="trackingNumber"
                    value={trackingForm.trackingNumber}
                    onChange={(e) => setTrackingForm(prev => ({ ...prev, trackingNumber: e.target.value }))}
                    placeholder="Enter tracking number"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="trackingUrl">Tracking URL</Label>
                <Input
                  id="trackingUrl"
                  value={trackingForm.trackingUrl}
                  onChange={(e) => setTrackingForm(prev => ({ ...prev, trackingUrl: e.target.value }))}
                  placeholder="https://tracking.courier.com/..."
                />
              </div>

              <div>
                <Label htmlFor="estimatedDeliveryDate">Estimated Delivery Date</Label>
                <Input
                  id="estimatedDeliveryDate"
                  type="datetime-local"
                  value={trackingForm.estimatedDeliveryDate}
                  onChange={(e) => setTrackingForm(prev => ({ ...prev, estimatedDeliveryDate: e.target.value }))}
                />
              </div>

              <Button onClick={updateTracking} className="w-full bg-[#1c7430] hover:bg-[#155225]">
                <Save className="w-4 h-4 mr-2" />
                Update Tracking Information
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notes Tab */}
        <TabsContent value="notes" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageSquare className="w-5 h-5 mr-2" />
                Add Note
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="newNote">Note</Label>
                <Textarea
                  id="newNote"
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  rows={4}
                  placeholder="Add a note about this order..."
                />
              </div>
              
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isInternalNote}
                  onChange={(e) => setIsInternalNote(e.target.checked)}
                  className="rounded border-gray-300 text-[#1c7430] focus:ring-[#1c7430]"
                />
                <span className="text-sm">Internal note (not visible to customer)</span>
              </label>

              <Button onClick={addNote} className="w-full bg-[#1c7430] hover:bg-[#155225]">
                <Save className="w-4 h-4 mr-2" />
                Add Note
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Order Notes ({order.orderNotes.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {order.orderNotes.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No notes yet</p>
              ) : (
                <div className="space-y-4">
                  {order.orderNotes.map((note) => (
                    <div key={note.id} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {note.isInternal && (
                            <span className="text-xs bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200 px-2 py-1 rounded">
                              Internal
                            </span>
                          )}
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(note.createdAt).toLocaleString('en-IE')}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm">{note.note}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <History className="w-5 h-5 mr-2" />
                Order History
              </CardTitle>
            </CardHeader>
            <CardContent>
              {order.orderHistory.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No history yet</p>
              ) : (
                <div className="space-y-4">
                  {order.orderHistory.map((entry) => (
                    <div key={entry.id} className="flex items-start p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <Clock className="w-5 h-5 text-gray-400 mt-0.5 mr-3 flex-shrink-0" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{entry.status.replace(/_/g, ' ')}</span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(entry.createdAt).toLocaleString('en-IE')}
                          </span>
                        </div>
                        {entry.notes && (
                          <p className="text-sm text-gray-600 dark:text-gray-400">{entry.notes}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
