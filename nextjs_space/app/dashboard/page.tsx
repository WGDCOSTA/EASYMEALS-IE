
'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { 
  ShoppingBag, Package, TrendingUp, Gift, Calendar,
  User, Heart, Star, Clock, CheckCircle2, XCircle, Truck, DollarSign
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import Image from 'next/image'
import { CalorieTracker } from '@/components/calorie-tracker'

interface Order {
  id: string
  totalAmount?: number
  total?: number
  status: string
  createdAt: string
  items?: any[]
  orderItems?: any[]
}

interface Subscription {
  id: string
  status: string
  currentPeriodEnd: string
  plan: string
}

interface Promotion {
  id: string
  title: string
  description: string
  code: string | null
  discountType: string
  discountValue: number
  endDate: string
  imageUrl: string | null
}

export default function DashboardPage() {
  const { data: session, status } = useSession() || {}
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [promotions, setPromotions] = useState<Promotion[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalSpent: 0,
    activeSubscriptions: 0,
    availablePromotions: 0
  })

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    } else if (status === 'authenticated') {
      loadDashboardData()
    }
  }, [status, router])

  const loadDashboardData = async () => {
    try {
      const [ordersRes, subsRes, promoRes] = await Promise.all([
        fetch('/api/orders'),
        fetch('/api/subscriptions'),
        fetch('/api/promotions/active')
      ])

      const ordersData = await ordersRes.json()
      const subsData = await subsRes.json()
      const promoData = await promoRes.json()

      setOrders(ordersData)
      setSubscriptions(subsData)
      setPromotions(promoData)

      const totalSpent = ordersData.reduce((sum: number, order: any) => sum + (order.total || order.totalAmount || 0), 0)
      
      setStats({
        totalOrders: ordersData.length,
        totalSpent,
        activeSubscriptions: subsData.length,
        availablePromotions: promoData.length
      })

      setLoading(false)
    } catch (error) {
      console.error('Failed to load dashboard data:', error)
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      PROCESSING: 'bg-blue-100 text-blue-800',
      SHIPPED: 'bg-purple-100 text-purple-800',
      DELIVERED: 'bg-green-100 text-green-800',
      CANCELLED: 'bg-red-100 text-red-800',
      ACTIVE: 'bg-green-100 text-green-800',
      INACTIVE: 'bg-gray-100 text-gray-800'
    }
    return styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-800'
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'DELIVERED':
        return <CheckCircle2 className="w-4 h-4" />
      case 'CANCELLED':
        return <XCircle className="w-4 h-4" />
      case 'SHIPPED':
        return <Truck className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading your dashboard...</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!session?.user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {session.user.firstName || session.user.name || 'there'}! 👋
          </h1>
          <p className="text-gray-600 mt-2">Here's what's happening with your account</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-l-4 border-l-orange-500">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Orders</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <ShoppingBag className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Spent</p>
                  <p className="text-2xl font-bold text-gray-900">€{stats.totalSpent.toFixed(2)}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Subscriptions</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.activeSubscriptions}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Package className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Available Offers</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.availablePromotions}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <Gift className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="orders" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
            <TabsTrigger value="orders" className="gap-2">
              <ShoppingBag className="w-4 h-4" />
              Orders
            </TabsTrigger>
            <TabsTrigger value="subscriptions" className="gap-2">
              <Package className="w-4 h-4" />
              Subscriptions
            </TabsTrigger>
            <TabsTrigger value="nutrition" className="gap-2">
              <TrendingUp className="w-4 h-4" />
              Nutrition
            </TabsTrigger>
            <TabsTrigger value="promotions" className="gap-2">
              <Gift className="w-4 h-4" />
              Offers
            </TabsTrigger>
          </TabsList>

          <TabsContent value="orders" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Recent Orders</span>
                  <Link href="/orders">
                    <Button variant="outline" size="sm">View All</Button>
                  </Link>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {orders.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders yet</h3>
                    <p className="text-gray-600 mb-6">Start shopping to see your orders here</p>
                    <Link href="/meals">
                      <Button className="bg-orange-500 hover:bg-orange-600">
                        Browse Meals
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.slice(0, 5).map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="font-medium text-gray-900">Order #{order.id.slice(0, 8)}</span>
                            <Badge className={getStatusBadge(order.status)}>
                              {getStatusIcon(order.status)}
                              <span className="ml-1">{order.status}</span>
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {new Date(order.createdAt).toLocaleDateString('en-IE')}
                            </span>
                            <span className="flex items-center gap-1">
                              <Package className="w-4 h-4" />
                              {order.items?.length || order.orderItems?.length || 0} items
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-gray-900">€{(order.total || order.totalAmount || 0).toFixed(2)}</p>
                          <Link href={`/orders`}>
                            <Button variant="link" size="sm" className="text-orange-600 hover:text-orange-700">
                              View Details →
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="subscriptions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Your Subscriptions</span>
                  <Link href="/subscriptions">
                    <Button variant="outline" size="sm">Manage All</Button>
                  </Link>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {subscriptions.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No active subscriptions</h3>
                    <p className="text-gray-600 mb-6">Subscribe to save time and money on your favorite meals</p>
                    <Link href="/subscriptions">
                      <Button className="bg-orange-500 hover:bg-orange-600">
                        View Subscription Plans
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {subscriptions.map((sub) => (
                      <div key={sub.id} className="p-6 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg border border-orange-200">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
                              <Star className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900">{sub.plan} Plan</h4>
                              <Badge className={getStatusBadge(sub.status)}>{sub.status}</Badge>
                            </div>
                          </div>
                          <Link href="/subscriptions">
                            <Button variant="outline" size="sm">Manage</Button>
                          </Link>
                        </div>
                        <div className="text-sm text-gray-700">
                          <p>Next billing: {new Date(sub.currentPeriodEnd).toLocaleDateString('en-IE')}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="nutrition" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Today's Nutrition</span>
                  <Link href="/nutrition-dashboard">
                    <Button variant="outline" size="sm">Full Dashboard</Button>
                  </Link>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CalorieTracker />
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Link href="/nutrition-dashboard" className="block">
                    <Button variant="outline" className="w-full justify-start" size="lg">
                      <TrendingUp className="w-5 h-5 mr-3" />
                      View Progress Charts
                    </Button>
                  </Link>
                  <Link href="/nutrition-dashboard/settings" className="block">
                    <Button variant="outline" className="w-full justify-start" size="lg">
                      <User className="w-5 h-5 mr-3" />
                      Update Nutrition Goals
                    </Button>
                  </Link>
                  <Link href="/meals" className="block">
                    <Button variant="outline" className="w-full justify-start" size="lg">
                      <ShoppingBag className="w-5 h-5 mr-3" />
                      Browse Healthy Meals
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                <CardHeader>
                  <CardTitle className="text-green-900">Nutrition Tips</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Heart className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-green-900">
                      Aim for balanced meals with protein, carbs, and healthy fats
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-green-900">
                      Eat at regular intervals to maintain energy levels
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <TrendingUp className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-green-900">
                      Track your progress to stay motivated and reach your goals
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="promotions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Exclusive Offers For You</CardTitle>
              </CardHeader>
              <CardContent>
                {promotions.length === 0 ? (
                  <div className="text-center py-12">
                    <Gift className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No active promotions</h3>
                    <p className="text-gray-600">Check back soon for exclusive offers!</p>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-6">
                    {promotions.map((promo) => (
                      <div key={promo.id} className="relative overflow-hidden rounded-lg border border-gray-200 hover:border-orange-500 transition group">
                        {promo.imageUrl && (
                          <div className="relative h-48 bg-gray-100">
                            <Image src={promo.imageUrl} alt={promo.title} fill className="object-cover" />
                          </div>
                        )}
                        <div className="p-6">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <h3 className="font-bold text-lg text-gray-900 mb-2">{promo.title}</h3>
                              <p className="text-sm text-gray-600 mb-3">{promo.description}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div>
                              {promo.code && (
                                <div className="inline-flex items-center bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-mono font-bold">
                                  {promo.code}
                                </div>
                              )}
                            </div>
                            <div className="text-right text-sm text-gray-500">
                              Valid until {new Date(promo.endDate).toLocaleDateString('en-IE')}
                            </div>
                          </div>

                          <div className="mt-4">
                            <Link href="/meals">
                              <Button className="w-full bg-orange-500 hover:bg-orange-600">
                                Shop Now
                              </Button>
                            </Link>
                          </div>
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
      
      <Footer />
    </div>
  )
}
