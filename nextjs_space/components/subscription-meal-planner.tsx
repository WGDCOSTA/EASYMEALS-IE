
'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Calendar, Sparkles, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

interface Subscription {
  id: string
  frequency: string
  nextDeliveryDate: string
  subscriptionItems: Array<{
    product: {
      id: string
      name: string
      imageUrl: string
      calories: number
      protein: number
      carbs: number
      fat: number
    }
    quantity: number
  }>
}

interface MealPlanPreview {
  totalCalories: number
  totalProtein: number
  totalCarbs: number
  totalFat: number
  meetsGoals: boolean
  suggestions: string[]
}

export function SubscriptionMealPlanner() {
  const router = useRouter()
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null)
  const [mealPlanPreview, setMealPlanPreview] = useState<MealPlanPreview | null>(null)
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [userGoals, setUserGoals] = useState<any>(null)

  useEffect(() => {
    loadSubscriptions()
    loadUserGoals()
  }, [])

  useEffect(() => {
    if (selectedSubscription && userGoals) {
      analyzeMealPlan()
    }
  }, [selectedSubscription, userGoals])

  const loadSubscriptions = async () => {
    try {
      const response = await fetch('/api/subscriptions/my-subscriptions')
      if (response.ok) {
        const data = await response.json()
        setSubscriptions(data)
        if (data.length > 0) {
          setSelectedSubscription(data[0])
        }
      }
    } catch (error) {
      console.error('Error loading subscriptions:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadUserGoals = async () => {
    try {
      const response = await fetch('/api/nutrition/profile')
      if (response.ok) {
        const data = await response.json()
        setUserGoals(data)
      }
    } catch (error) {
      console.error('Error loading user goals:', error)
    }
  }

  const analyzeMealPlan = () => {
    if (!selectedSubscription || !userGoals) return

    const totals = selectedSubscription.subscriptionItems.reduce(
      (acc, item) => ({
        totalCalories: acc.totalCalories + (item.product.calories || 0) * item.quantity,
        totalProtein: acc.totalProtein + (item.product.protein || 0) * item.quantity,
        totalCarbs: acc.totalCarbs + (item.product.carbs || 0) * item.quantity,
        totalFat: acc.totalFat + (item.product.fat || 0) * item.quantity,
      }),
      { totalCalories: 0, totalProtein: 0, totalCarbs: 0, totalFat: 0 }
    )

    const caloriesDiff = totals.totalCalories - userGoals.dailyCalories
    const proteinDiff = totals.totalProtein - userGoals.dailyProtein
    const carbsDiff = totals.totalCarbs - userGoals.dailyCarbs

    const suggestions = []
    const meetsGoals = 
      Math.abs(caloriesDiff) < userGoals.dailyCalories * 0.15 &&
      Math.abs(proteinDiff) < userGoals.dailyProtein * 0.15 &&
      Math.abs(carbsDiff) < userGoals.dailyCarbs * 0.15

    if (caloriesDiff > userGoals.dailyCalories * 0.15) {
      suggestions.push(`Your subscription provides ${Math.abs(Math.round(caloriesDiff))} extra calories. Consider reducing portions or meal frequency.`)
    } else if (caloriesDiff < -userGoals.dailyCalories * 0.15) {
      suggestions.push(`You're ${Math.abs(Math.round(caloriesDiff))} calories short of your daily goal. Add more meals or snacks.`)
    }

    if (proteinDiff < -userGoals.dailyProtein * 0.15) {
      suggestions.push(`Add ${Math.abs(Math.round(proteinDiff))}g more protein. Try our high-protein meals like Grilled Chicken or Salmon.`)
    }

    if (carbsDiff > userGoals.dailyCarbs * 0.15) {
      suggestions.push(`Your subscription has ${Math.abs(Math.round(carbsDiff))}g excess carbs. Consider low-carb alternatives.`)
    }

    if (suggestions.length === 0) {
      suggestions.push('Perfect! Your subscription aligns well with your nutrition goals.')
    }

    setMealPlanPreview({
      ...totals,
      meetsGoals,
      suggestions,
    })
  }

  const handleGenerateWeeklyPlan = async () => {
    if (!selectedSubscription) return

    setGenerating(true)
    try {
      // Generate meal plan for the week starting from next delivery
      const startDate = new Date(selectedSubscription.nextDeliveryDate)
      const weekDates = []
      
      for (let i = 0; i < 7; i++) {
        const date = new Date(startDate)
        date.setDate(startDate.getDate() + i)
        weekDates.push(date)
      }

      // Distribute subscription items across the week
      const itemsPerDay = Math.ceil(selectedSubscription.subscriptionItems.length / 7)
      
      for (let dayIndex = 0; dayIndex < weekDates.length; dayIndex++) {
        const dayItems = selectedSubscription.subscriptionItems.slice(
          dayIndex * itemsPerDay,
          (dayIndex + 1) * itemsPerDay
        )

        if (dayItems.length === 0) continue

        const meals = dayItems.map((item, index) => ({
          productId: item.product.id,
          mealType: ['BREAKFAST', 'LUNCH', 'DINNER'][index % 3],
          servings: item.quantity,
          calories: item.product.calories * item.quantity,
          protein: item.product.protein * item.quantity,
          carbs: item.product.carbs * item.quantity,
          fat: item.product.fat * item.quantity,
        }))

        // Create meal plan for this day
        await fetch('/api/nutrition/meal-plan', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            date: weekDates[dayIndex].toISOString(),
            meals,
            isAiGenerated: false,
          }),
        })
      }

      toast.success('Weekly meal plan generated from your subscription!')
      router.push('/nutrition-dashboard?tab=planner')
    } catch (error) {
      console.error('Error generating meal plan:', error)
      toast.error('Failed to generate meal plan')
    } finally {
      setGenerating(false)
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

  if (subscriptions.length === 0) {
    return (
      <Card className="p-6 text-center">
        <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Active Subscriptions</h3>
        <p className="text-gray-600 text-sm mb-4">
          Subscribe to meal plans and get automatic meal planning based on your deliveries
        </p>
        <Button onClick={() => router.push('/subscriptions')} className="bg-green-600 hover:bg-green-700">
          Browse Subscriptions
        </Button>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Subscription Intelligence</h3>
            <p className="text-sm text-gray-600">Auto-generate meal plans from your subscription</p>
          </div>
          <Badge className="bg-purple-100 text-purple-700">
            <Sparkles className="w-3 h-3 mr-1" />
            Smart Planning
          </Badge>
        </div>

        {/* Subscription Selector */}
        <div className="mb-6">
          <label className="text-sm font-medium text-gray-700 mb-2 block">Select Subscription</label>
          <select
            value={selectedSubscription?.id || ''}
            onChange={(e) => {
              const sub = subscriptions.find((s) => s.id === e.target.value)
              setSelectedSubscription(sub || null)
            }}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            {subscriptions.map((sub) => (
              <option key={sub.id} value={sub.id}>
                {sub.frequency} Subscription - Next delivery: {new Date(sub.nextDeliveryDate).toLocaleDateString()}
              </option>
            ))}
          </select>
        </div>

        {/* Subscription Items */}
        {selectedSubscription && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h4 className="font-semibold text-gray-900 mb-3">Your Subscription Meals</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {selectedSubscription.subscriptionItems.map((item, index) => (
                <div key={index} className="flex items-center space-x-3 bg-white rounded-lg p-3">
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                    <Image
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm text-gray-900 truncate">{item.product.name}</div>
                    <div className="text-xs text-gray-600">
                      {item.product.calories}kcal • {item.product.protein}g protein
                    </div>
                  </div>
                  <Badge variant="outline">{item.quantity}x</Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Nutrition Analysis */}
        {mealPlanPreview && (
          <Card className={`p-4 mb-6 ${mealPlanPreview.meetsGoals ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'}`}>
            <div className="flex items-start space-x-3">
              {mealPlanPreview.meetsGoals ? (
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 mb-2">Nutrition Analysis</h4>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
                  <div className="bg-white rounded p-2">
                    <div className="text-lg font-bold text-gray-900">{mealPlanPreview.totalCalories}</div>
                    <div className="text-xs text-gray-600">Calories</div>
                  </div>
                  <div className="bg-white rounded p-2">
                    <div className="text-lg font-bold text-gray-900">{Math.round(mealPlanPreview.totalProtein)}g</div>
                    <div className="text-xs text-gray-600">Protein</div>
                  </div>
                  <div className="bg-white rounded p-2">
                    <div className="text-lg font-bold text-gray-900">{Math.round(mealPlanPreview.totalCarbs)}g</div>
                    <div className="text-xs text-gray-600">Carbs</div>
                  </div>
                  <div className="bg-white rounded p-2">
                    <div className="text-lg font-bold text-gray-900">{Math.round(mealPlanPreview.totalFat)}g</div>
                    <div className="text-xs text-gray-600">Fat</div>
                  </div>
                </div>

                <div className="space-y-2">
                  {mealPlanPreview.suggestions.map((suggestion, index) => (
                    <p key={index} className="text-sm text-gray-700">
                      {suggestion}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Generate Button */}
        <Button
          onClick={handleGenerateWeeklyPlan}
          disabled={generating || !selectedSubscription}
          className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white"
          size="lg"
        >
          {generating ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Generating Meal Plan...
            </>
          ) : (
            <>
              <Calendar className="w-4 h-4 mr-2" />
              Generate Weekly Meal Plan
            </>
          )}
        </Button>

        <p className="text-xs text-gray-500 text-center mt-3">
          This will create a 7-day meal plan starting from your next delivery date
        </p>
      </Card>
    </div>
  )
}
