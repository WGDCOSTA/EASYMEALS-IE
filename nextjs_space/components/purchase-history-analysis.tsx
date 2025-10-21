
'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { TrendingUp, Award, ShoppingBag, Calendar, Heart, ArrowRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

interface PurchaseStats {
  totalOrders: number
  totalSpent: number
  avgOrderValue: number
  favoriteProducts: Array<{
    product: {
      id: string
      name: string
      imageUrl: string
      price: number
      calories: number
      protein: number
    }
    purchaseCount: number
    totalQuantity: number
  }>
  nutritionTrends: {
    avgCaloriesPerOrder: number
    avgProteinPerOrder: number
    mostOrderedCategory: string
  }
  recentOrders: Array<{
    id: string
    orderNumber: string
    date: string
    total: number
    itemCount: number
  }>
}

export function PurchaseHistoryAnalysis() {
  const router = useRouter()
  const [stats, setStats] = useState<PurchaseStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPurchaseStats()
  }, [])

  const loadPurchaseStats = async () => {
    try {
      const response = await fetch('/api/orders/stats')
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Error loading purchase stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        </div>
      </Card>
    )
  }

  if (!stats || stats.totalOrders === 0) {
    return (
      <Card className="p-6 text-center">
        <ShoppingBag className="w-12 h-12 text-gray-400 mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Purchase History Yet</h3>
        <p className="text-gray-600 text-sm mb-4">
          Start ordering to see your personalized insights and favorite meals
        </p>
        <Button onClick={() => router.push('/meals')} className="bg-green-600 hover:bg-green-700">
          Browse Meals
        </Button>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <div className="flex items-center justify-between mb-2">
            <ShoppingBag className="w-5 h-5 text-green-600" />
            <Badge variant="outline" className="bg-white">All Time</Badge>
          </div>
          <div className="text-3xl font-bold text-gray-900">{stats.totalOrders}</div>
          <div className="text-sm text-gray-600">Total Orders</div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <Badge variant="outline" className="bg-white">Average</Badge>
          </div>
          <div className="text-3xl font-bold text-gray-900">€{stats.avgOrderValue.toFixed(2)}</div>
          <div className="text-sm text-gray-600">Per Order</div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <div className="flex items-center justify-between mb-2">
            <Award className="w-5 h-5 text-purple-600" />
            <Badge variant="outline" className="bg-white">Total</Badge>
          </div>
          <div className="text-3xl font-bold text-gray-900">€{stats.totalSpent.toFixed(2)}</div>
          <div className="text-sm text-gray-600">Spent</div>
        </Card>
      </div>

      {/* Favorite Products */}
      {stats.favoriteProducts.length > 0 && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Heart className="w-5 h-5 text-red-500 fill-red-500" />
              <h3 className="text-lg font-bold text-gray-900">Your Favorite Meals</h3>
            </div>
            <Badge className="bg-red-100 text-red-700">Most Ordered</Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {stats.favoriteProducts.slice(0, 3).map((item) => (
              <div
                key={item.product.id}
                onClick={() => router.push(`/meals/${item.product.id}`)}
                className="group cursor-pointer bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-all border border-gray-200 hover:border-green-300"
              >
                <div className="relative w-full aspect-video mb-3 rounded-lg overflow-hidden bg-white">
                  <Image
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute top-2 right-2 bg-white rounded-full px-2 py-1 text-xs font-semibold">
                    {item.purchaseCount}x ordered
                  </div>
                </div>

                <h4 className="font-semibold text-gray-900 mb-2 line-clamp-1">{item.product.name}</h4>
                
                <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
                  <span>{item.product.calories} kcal</span>
                  <span>{item.product.protein}g protein</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-green-600">€{item.product.price.toFixed(2)}</span>
                  <Button size="sm" variant="ghost" className="text-green-600 group-hover:text-green-700">
                    Order Again
                    <ArrowRight className="w-3 h-3 ml-1" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Nutrition Trends */}
      <Card className="p-6 bg-gradient-to-br from-yellow-50 to-orange-50 border-orange-200">
        <div className="flex items-center space-x-2 mb-4">
          <TrendingUp className="w-5 h-5 text-orange-600" />
          <h3 className="text-lg font-bold text-gray-900">Your Nutrition Patterns</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4">
            <div className="text-2xl font-bold text-orange-600">
              {Math.round(stats.nutritionTrends.avgCaloriesPerOrder)}
            </div>
            <div className="text-sm text-gray-600">Avg. Calories per Order</div>
            <p className="text-xs text-gray-500 mt-2">
              Perfect for maintaining a balanced diet
            </p>
          </div>

          <div className="bg-white rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-600">
              {Math.round(stats.nutritionTrends.avgProteinPerOrder)}g
            </div>
            <div className="text-sm text-gray-600">Avg. Protein per Order</div>
            <p className="text-xs text-gray-500 mt-2">
              Great for muscle maintenance
            </p>
          </div>

          <div className="bg-white rounded-lg p-4">
            <div className="text-2xl font-bold text-green-600">
              {stats.nutritionTrends.mostOrderedCategory}
            </div>
            <div className="text-sm text-gray-600">Most Ordered Category</div>
            <p className="text-xs text-gray-500 mt-2">
              Your go-to meal preference
            </p>
          </div>
        </div>
      </Card>

      {/* Recent Orders */}
      {stats.recentOrders.length > 0 && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-gray-600" />
              <h3 className="text-lg font-bold text-gray-900">Recent Orders</h3>
            </div>
            <Button variant="outline" size="sm" onClick={() => router.push('/orders')}>
              View All
            </Button>
          </div>

          <div className="space-y-3">
            {stats.recentOrders.slice(0, 3).map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex-1">
                  <div className="font-medium text-gray-900">Order #{order.orderNumber}</div>
                  <div className="flex items-center space-x-3 text-sm text-gray-600 mt-1">
                    <span>{new Date(order.date).toLocaleDateString()}</span>
                    <span>•</span>
                    <span>{order.itemCount} items</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-gray-900">€{order.total.toFixed(2)}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Insights */}
      <Card className="p-6 bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
        <div className="flex items-start space-x-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
            <Award className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900 mb-2">Smart Insights</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start">
                <span className="text-green-600 mr-2">✓</span>
                <span>You order an average of {Math.round(stats.totalOrders / 4)} times per month</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">✓</span>
                <span>
                  Your favorite meals provide an average of {Math.round(stats.nutritionTrends.avgCaloriesPerOrder)} calories, 
                  perfect for a balanced diet
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">💡</span>
                <span>
                  Based on your preferences, we recommend trying our {stats.nutritionTrends.mostOrderedCategory} meal plans
                </span>
              </li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  )
}
