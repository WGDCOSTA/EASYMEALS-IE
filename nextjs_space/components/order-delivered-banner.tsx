
'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Package, Plus, X, CheckCircle } from 'lucide-react'
import { toast } from 'sonner'
import Image from 'next/image'

interface DeliveredOrder {
  id: string
  orderNumber: string
  deliveredAt: string
  items: Array<{
    id: string
    productId: string
    quantity: number
    product: {
      id: string
      name: string
      imageUrl: string
      calories: number
      protein: number
      carbs: number
      fat: number
    }
  }>
}

export function OrderDeliveredBanner() {
  const { data: session } = useSession() || {}
  const [deliveredOrders, setDeliveredOrders] = useState<DeliveredOrder[]>([])
  const [dismissed, setDismissed] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (session?.user) {
      loadDeliveredOrders()
      
      // Load dismissed orders from localStorage
      const stored = localStorage.getItem('dismissed-order-banners')
      if (stored) {
        setDismissed(JSON.parse(stored))
      }
    }
  }, [session])

  const loadDeliveredOrders = async () => {
    try {
      const response = await fetch('/api/orders/delivered-untracked')
      if (response.ok) {
        const data = await response.json()
        setDeliveredOrders(data)
      }
    } catch (error) {
      console.error('Error loading delivered orders:', error)
    }
  }

  const handleAddToMealPlan = async (order: DeliveredOrder) => {
    setLoading(true)
    try {
      const todayISO = new Date().toISOString()
      
      // Get current meal plan for today
      const mealPlanResponse = await fetch(`/api/nutrition/meal-plan?date=${todayISO}`)
      let existingMealPlan: any = null
      if (mealPlanResponse.ok) {
        existingMealPlan = await mealPlanResponse.json()
      }

      // Prepare meals to add
      const mealsToAdd = order.items.map((item, index) => ({
        productId: item.product.id,
        mealType: getMealTypeForIndex(index, existingMealPlan),
        servings: item.quantity,
        calories: item.product.calories * item.quantity,
        protein: item.product.protein * item.quantity,
        carbs: item.product.carbs * item.quantity,
        fat: item.product.fat * item.quantity,
      }))

      // Add to meal plan
      const response = await fetch('/api/nutrition/meal-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: todayISO,
          meals: mealsToAdd,
        }),
      })

      if (response.ok) {
        // Update daily intake
        const totalNutrition = mealsToAdd.reduce(
          (acc, meal) => ({
            totalCalories: acc.totalCalories + meal.calories,
            totalProtein: acc.totalProtein + meal.protein,
            totalCarbs: acc.totalCarbs + meal.carbs,
            totalFat: acc.totalFat + meal.fat,
          }),
          { totalCalories: 0, totalProtein: 0, totalCarbs: 0, totalFat: 0 }
        )

        await fetch('/api/nutrition/daily-intake', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            date: todayISO,
            ...totalNutrition,
          }),
        })

        toast.success('Order added to your meal plan!')
        handleDismiss(order.id)
      } else {
        toast.error('Failed to add order to meal plan')
      }
    } catch (error) {
      console.error('Error adding to meal plan:', error)
      toast.error('Failed to add order to meal plan')
    } finally {
      setLoading(false)
    }
  }

  const getMealTypeForIndex = (index: number, existingMealPlan: any) => {
    const mealTypes = ['BREAKFAST', 'LUNCH', 'DINNER', 'MORNING_SNACK', 'AFTERNOON_SNACK']
    
    // Check which meal types are already filled
    const usedTypes = existingMealPlan?.meals?.map((m: any) => m.mealType) || []
    
    // Find first available meal type
    for (const type of mealTypes) {
      if (!usedTypes.includes(type)) {
        usedTypes.push(type) // Mark as used for next iteration
        return type
      }
    }
    
    // Fallback to index-based assignment
    return mealTypes[index % mealTypes.length]
  }

  const handleDismiss = (orderId: string) => {
    const newDismissed = [...dismissed, orderId]
    setDismissed(newDismissed)
    localStorage.setItem('dismissed-order-banners', JSON.stringify(newDismissed))
  }

  const visibleOrders = deliveredOrders.filter((order) => !dismissed.includes(order.id))

  if (!session?.user || visibleOrders.length === 0) return null

  return (
    <div className="space-y-3">
      {visibleOrders.map((order) => (
        <Card key={order.id} className="p-4 bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
              <Package className="w-5 h-5 text-white" />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h4 className="font-semibold text-gray-900">Order Delivered!</h4>
                  <p className="text-sm text-gray-600">Order #{order.orderNumber}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDismiss(order.id)}
                  className="h-8 w-8 flex-shrink-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex flex-wrap gap-2 mb-3">
                {order.items.slice(0, 3).map((item) => (
                  <Badge key={item.id} variant="outline" className="bg-white">
                    {item.product.name}
                    {item.quantity > 1 && ` x${item.quantity}`}
                  </Badge>
                ))}
                {order.items.length > 3 && (
                  <Badge variant="outline" className="bg-white">
                    +{order.items.length - 3} more
                  </Badge>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  onClick={() => handleAddToMealPlan(order)}
                  disabled={loading}
                  size="sm"
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add to Today's Meal Plan
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDismiss(order.id)}
                >
                  Dismiss
                </Button>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
