
'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, Users, ShoppingBag, DollarSign } from 'lucide-react'

interface AnalyticsData {
  salesByDay: { date: string; total: number }[]
  salesByCategory: { category: string; total: number; count: number }[]
  topCustomers: { name: string; email: string; total: number; orderCount: number }[]
  revenueStats: {
    today: number
    thisWeek: number
    thisMonth: number
    lastMonth: number
  }
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAnalytics()
  }, [])

  const loadAnalytics = async () => {
    try {
      const res = await fetch('/api/admin/analytics')
      const analyticsData = await res.json()
      setData(analyticsData)
      setLoading(false)
    } catch (error) {
      console.error('Failed to load analytics:', error)
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-[400px]">Loading analytics...</div>
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-lg text-red-600">Failed to load analytics</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Revenue Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Today</p>
                <h3 className="text-2xl font-bold mt-1">
                  €{data.revenueStats.today.toFixed(2)}
                </h3>
              </div>
              <div className="bg-green-500 p-3 rounded-lg">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">This Week</p>
                <h3 className="text-2xl font-bold mt-1">
                  €{data.revenueStats.thisWeek.toFixed(2)}
                </h3>
              </div>
              <div className="bg-blue-500 p-3 rounded-lg">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">This Month</p>
                <h3 className="text-2xl font-bold mt-1">
                  €{data.revenueStats.thisMonth.toFixed(2)}
                </h3>
              </div>
              <div className="bg-purple-500 p-3 rounded-lg">
                <ShoppingBag className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Last Month</p>
                <h3 className="text-2xl font-bold mt-1">
                  €{data.revenueStats.lastMonth.toFixed(2)}
                </h3>
              </div>
              <div className="bg-orange-500 p-3 rounded-lg">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Sales by Category */}
        <Card>
          <CardHeader>
            <CardTitle>Sales by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.salesByCategory.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-8">No data available</p>
              ) : (
                data.salesByCategory.map((cat) => {
                  const maxTotal = Math.max(...data.salesByCategory.map(c => c.total))
                  const percentage = (cat.total / maxTotal) * 100

                  return (
                    <div key={cat.category}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">
                          {cat.category.replace(/_/g, ' ')}
                        </span>
                        <span className="text-sm text-gray-600">
                          €{cat.total.toFixed(2)} ({cat.count} orders)
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-[#1c7430] h-2 rounded-full"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </CardContent>
        </Card>

        {/* Top Customers */}
        <Card>
          <CardHeader>
            <CardTitle>Top Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.topCustomers.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-8">No data available</p>
              ) : (
                data.topCustomers.map((customer, index) => (
                  <div key={customer.email} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center flex-1">
                      <span className="flex items-center justify-center w-8 h-8 bg-[#1c7430] text-white rounded-full text-sm font-bold mr-3">
                        {index + 1}
                      </span>
                      <div>
                        <p className="font-medium text-sm">{customer.name || 'Guest'}</p>
                        <p className="text-xs text-gray-600">{customer.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">€{customer.total.toFixed(2)}</p>
                      <p className="text-xs text-gray-600">{customer.orderCount} orders</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sales Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Sales Over Time (Last 30 Days)</CardTitle>
        </CardHeader>
        <CardContent>
          {data.salesByDay.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-8">No data available</p>
          ) : (
            <div className="space-y-2">
              {data.salesByDay.map((day) => {
                const maxTotal = Math.max(...data.salesByDay.map(d => d.total))
                const percentage = maxTotal > 0 ? (day.total / maxTotal) * 100 : 0

                return (
                  <div key={day.date} className="flex items-center space-x-4">
                    <span className="text-sm text-gray-600 w-24">
                      {new Date(day.date).toLocaleDateString('en-IE', { month: 'short', day: 'numeric' })}
                    </span>
                    <div className="flex-1">
                      <div className="w-full bg-gray-200 rounded-full h-6 relative">
                        <div
                          className="bg-[#1c7430] h-6 rounded-full flex items-center justify-end pr-2"
                          style={{ width: `${Math.max(percentage, 5)}%` }}
                        >
                          {day.total > 0 && (
                            <span className="text-xs text-white font-medium">
                              €{day.total.toFixed(2)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
