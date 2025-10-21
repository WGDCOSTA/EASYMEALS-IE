
'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Flame, TrendingUp, Target, Sparkles, ArrowRight } from 'lucide-react'
import { useCartStore } from '@/lib/store'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

interface CartNutrition {
  totalCalories: number
  totalProtein: number
  totalCarbs: number
  totalFat: number
}

interface UserGoals {
  dailyCalories: number
  dailyProtein: number
  dailyCarbs: number
  dailyFat: number
}

export function CartNutritionPreview() {
  const { items } = useCartStore()
  const { data: session } = useSession() || {}
  const router = useRouter()
  const [cartNutrition, setCartNutrition] = useState<CartNutrition>({
    totalCalories: 0,
    totalProtein: 0,
    totalCarbs: 0,
    totalFat: 0,
  })
  const [userGoals, setUserGoals] = useState<UserGoals | null>(null)
  const [productDetails, setProductDetails] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [complementaryProducts, setComplementaryProducts] = useState<any[]>([])

  useEffect(() => {
    loadProductDetails()
    if (session?.user) {
      loadUserGoals()
    } else {
      setLoading(false)
    }
  }, [items, session])

  useEffect(() => {
    if (productDetails.length > 0) {
      calculateNutrition()
      if (userGoals) {
        findComplementaryProducts()
      }
    }
  }, [productDetails, userGoals])

  const loadProductDetails = async () => {
    if (!items || items.length === 0) {
      setProductDetails([])
      setLoading(false)
      return
    }

    try {
      const details = await Promise.all(
        items.map(async (item) => {
          const response = await fetch(`/api/products/${item.id}`)
          if (response.ok) {
            const product = await response.json()
            return { ...product, cartQuantity: item.quantity }
          }
          return null
        })
      )
      setProductDetails(details.filter((d) => d !== null))
    } catch (error) {
      console.error('Error loading product details:', error)
    }
  }

  const loadUserGoals = async () => {
    try {
      const response = await fetch('/api/nutrition/profile')
      if (response.ok) {
        const data = await response.json()
        if (data) {
          setUserGoals({
            dailyCalories: data.dailyCalories || 2000,
            dailyProtein: data.dailyProtein || 60,
            dailyCarbs: data.dailyCarbs || 225,
            dailyFat: data.dailyFat || 77,
          })
        }
      }
    } catch (error) {
      console.error('Error loading user goals:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateNutrition = () => {
    const totals = productDetails.reduce(
      (acc, product) => {
        const quantity = product.cartQuantity || 1
        return {
          totalCalories: acc.totalCalories + (product.calories || 0) * quantity,
          totalProtein: acc.totalProtein + (product.protein || 0) * quantity,
          totalCarbs: acc.totalCarbs + (product.carbs || 0) * quantity,
          totalFat: acc.totalFat + (product.fat || 0) * quantity,
        }
      },
      { totalCalories: 0, totalProtein: 0, totalCarbs: 0, totalFat: 0 }
    )
    setCartNutrition(totals)
  }

  const findComplementaryProducts = async () => {
    if (!userGoals || !cartNutrition) return

    const proteinNeeded = Math.max(0, userGoals.dailyProtein - cartNutrition.totalProtein)
    const carbsNeeded = Math.max(0, userGoals.dailyCarbs - cartNutrition.totalCarbs)
    const caloriesNeeded = Math.max(0, userGoals.dailyCalories - cartNutrition.totalCalories)

    if (proteinNeeded < 10 && carbsNeeded < 20 && caloriesNeeded < 200) {
      setComplementaryProducts([])
      return
    }

    try {
      const response = await fetch('/api/products')
      if (response.ok) {
        const allProducts = await response.json()
        
        // Filter products not in cart and have nutrition info
        const availableProducts = allProducts.filter(
          (p: any) => !items.some((item) => item.id === p.id) && p.calories
        )

        // Score products based on how well they fill nutrition gaps
        const scoredProducts = availableProducts.map((product: any) => {
          let score = 0
          
          // Prioritize protein if needed
          if (proteinNeeded > 0 && product.protein) {
            score += (product.protein / proteinNeeded) * 100
          }
          
          // Prioritize carbs if needed
          if (carbsNeeded > 0 && product.carbs) {
            score += (product.carbs / carbsNeeded) * 50
          }
          
          // Consider calories
          if (caloriesNeeded > 0 && product.calories) {
            score += (product.calories / caloriesNeeded) * 30
          }

          return { ...product, score }
        })

        // Get top 3 complementary products
        const topProducts = scoredProducts
          .sort((a: any, b: any) => b.score - a.score)
          .slice(0, 3)
        
        setComplementaryProducts(topProducts)
      }
    } catch (error) {
      console.error('Error finding complementary products:', error)
    }
  }

  const getPercentage = (current: number, goal: number) => {
    if (!goal) return 0
    return Math.round((current / goal) * 100)
  }

  const getProgressColor = (percentage: number) => {
    if (percentage < 70) return 'text-green-600'
    if (percentage < 90) return 'text-yellow-600'
    if (percentage < 110) return 'text-orange-600'
    return 'text-red-600'
  }

  if (!items || items.length === 0) return null

  if (loading) {
    return (
      <Card className="p-6 bg-gradient-to-br from-green-50 to-blue-50">
        <div className="flex items-center justify-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6 bg-gradient-to-br from-green-50 to-blue-50 border-green-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
            <Flame className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900">Cart Nutrition</h3>
            <p className="text-xs text-gray-600">Total nutritional value</p>
          </div>
        </div>
        <Badge variant="outline" className="bg-white">
          {items.length} {items.length === 1 ? 'item' : 'items'}
        </Badge>
      </div>

      {/* Nutrition Summary */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-white rounded-lg p-3 border border-green-100">
          <div className="text-2xl font-bold text-green-600">{cartNutrition.totalCalories}</div>
          <div className="text-xs text-gray-600">Total Calories</div>
          {userGoals && (
            <div className="text-xs text-gray-500 mt-1">
              {getPercentage(cartNutrition.totalCalories, userGoals.dailyCalories)}% of daily goal
            </div>
          )}
        </div>
        
        <div className="bg-white rounded-lg p-3 border border-yellow-100">
          <div className="text-2xl font-bold text-yellow-600">{Math.round(cartNutrition.totalProtein)}g</div>
          <div className="text-xs text-gray-600">Total Protein</div>
          {userGoals && (
            <div className="text-xs text-gray-500 mt-1">
              {getPercentage(cartNutrition.totalProtein, userGoals.dailyProtein)}% of daily goal
            </div>
          )}
        </div>
        
        <div className="bg-white rounded-lg p-3 border border-orange-100">
          <div className="text-2xl font-bold text-orange-600">{Math.round(cartNutrition.totalCarbs)}g</div>
          <div className="text-xs text-gray-600">Total Carbs</div>
          {userGoals && (
            <div className="text-xs text-gray-500 mt-1">
              {getPercentage(cartNutrition.totalCarbs, userGoals.dailyCarbs)}% of daily goal
            </div>
          )}
        </div>
        
        <div className="bg-white rounded-lg p-3 border border-blue-100">
          <div className="text-2xl font-bold text-blue-600">{Math.round(cartNutrition.totalFat)}g</div>
          <div className="text-xs text-gray-600">Total Fat</div>
          {userGoals && (
            <div className="text-xs text-gray-500 mt-1">
              {getPercentage(cartNutrition.totalFat, userGoals.dailyFat)}% of daily goal
            </div>
          )}
        </div>
      </div>

      {/* User Goals Comparison */}
      {userGoals && (
        <div className="bg-white rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-gray-900">Progress Towards Daily Goals</span>
            <Target className="w-4 h-4 text-green-600" />
          </div>
          
          <div className="space-y-2">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className={getProgressColor(getPercentage(cartNutrition.totalCalories, userGoals.dailyCalories))}>
                  Calories: {getPercentage(cartNutrition.totalCalories, userGoals.dailyCalories)}%
                </span>
                <span className="text-gray-500">{userGoals.dailyCalories} kcal goal</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-600 transition-all duration-500"
                  style={{ width: `${Math.min(getPercentage(cartNutrition.totalCalories, userGoals.dailyCalories), 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Complementary Products Suggestion */}
      {complementaryProducts.length > 0 && (
        <div className="bg-white rounded-lg p-4 border-2 border-dashed border-green-200">
          <div className="flex items-center space-x-2 mb-3">
            <Sparkles className="w-4 h-4 text-green-600" />
            <h4 className="font-semibold text-sm text-gray-900">Recommended to Complete Your Day</h4>
          </div>
          <p className="text-xs text-gray-600 mb-3">
            Based on your goals, you need {Math.round(userGoals!.dailyProtein - cartNutrition.totalProtein)}g more protein 
            and {Math.round(userGoals!.dailyCalories - cartNutrition.totalCalories)} more calories
          </p>
          <div className="space-y-2">
            {complementaryProducts.map((product) => (
              <div
                key={product.id}
                onClick={() => router.push(`/meals/${product.id}`)}
                className="flex items-center justify-between p-2 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
              >
                <div className="flex-1">
                  <div className="font-medium text-xs text-gray-900">{product.name}</div>
                  <div className="text-xs text-gray-600">
                    {product.calories}kcal • {product.protein}g protein
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400" />
              </div>
            ))}
          </div>
        </div>
      )}

      {!session?.user && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-xs text-yellow-800 text-center">
            <Button
              variant="link"
              size="sm"
              onClick={() => router.push('/auth/signin')}
              className="text-yellow-800 underline p-0 h-auto"
            >
              Sign in
            </Button>
            {' '}to track your nutrition goals and get personalized recommendations
          </p>
        </div>
      )}
    </Card>
  )
}
