
'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Clock, CheckCircle2, Plus, Sparkles, Loader2, X } from 'lucide-react'
import Image from 'next/image'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useRouter } from 'next/navigation'

interface Meal {
  id: string
  mealType: string
  time: string
  product?: any
  servings?: number
  calories?: number
  protein?: number
  carbs?: number
  fat?: number
  completed: boolean
}

interface MealPlannerCardProps {
  expanded?: boolean
}

const MEAL_TYPES = [
  { type: 'BREAKFAST', time: '08:00', label: 'Breakfast' },
  { type: 'MORNING_SNACK', time: '10:30', label: 'Morning Snack' },
  { type: 'LUNCH', time: '13:00', label: 'Lunch' },
  { type: 'AFTERNOON_SNACK', time: '16:00', label: 'Afternoon Snack' },
  { type: 'DINNER', time: '19:00', label: 'Dinner' },
]

export function MealPlannerCard({ expanded = false }: MealPlannerCardProps) {
  const router = useRouter()
  const [meals, setMeals] = useState<Meal[]>([])
  const [loading, setLoading] = useState(true)
  const [aiLoading, setAiLoading] = useState(false)
  const [showMealSelector, setShowMealSelector] = useState(false)
  const [selectedMealType, setSelectedMealType] = useState<string | null>(null)
  const [availableProducts, setAvailableProducts] = useState<any[]>([])

  const totalNutrition = meals.reduce(
    (acc, meal) => ({
      calories: acc.calories + (meal.calories || 0),
      protein: acc.protein + (meal.protein || 0),
      carbs: acc.carbs + (meal.carbs || 0),
      fat: acc.fat + (meal.fat || 0),
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  )

  const goals = { calories: 2000, protein: 60, carbs: 225, fat: 77 }

  useEffect(() => {
    loadMealPlan()
    loadProducts()
  }, [])

  const loadMealPlan = async () => {
    try {
      const response = await fetch(`/api/nutrition/meal-plan?date=${new Date().toISOString()}`)
      if (response.ok) {
        const data = await response.json()
        if (data?.meals) {
          const formattedMeals = data.meals.map((meal: any) => ({
            id: meal.id,
            mealType: meal.mealType,
            time: meal.scheduledTime || MEAL_TYPES.find(t => t.type === meal.mealType)?.time || '',
            product: meal.product,
            servings: meal.servings,
            calories: meal.calories,
            protein: meal.protein,
            carbs: meal.carbs,
            fat: meal.fat,
            completed: meal.completed,
          }))
          setMeals(formattedMeals)
        } else {
          // Initialize with empty meal slots
          setMeals(
            MEAL_TYPES.map((mt) => ({
              id: mt.type,
              mealType: mt.type,
              time: mt.time,
              completed: false,
            }))
          )
        }
      }
    } catch (error) {
      console.error('Error loading meal plan:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadProducts = async () => {
    try {
      const response = await fetch('/api/products')
      if (response.ok) {
        const data = await response.json()
        setAvailableProducts(data.filter((p: any) => p.calories))
      }
    } catch (error) {
      console.error('Error loading products:', error)
    }
  }

  const handleAiAutoFill = async () => {
    setAiLoading(true)
    try {
      const emptyMealTypes = MEAL_TYPES.filter(
        (mt) => !meals.find((m) => m.mealType === mt.type && m.product)
      )

      for (const mealType of emptyMealTypes) {
        const response = await fetch('/api/nutrition/ai-suggestions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ mealType: mealType.type, servingsNeeded: 1 }),
        })

        if (response.ok) {
          const data = await response.json()
          if (data.suggestions && data.suggestions.length > 0) {
            const suggestion = data.suggestions[0]
            await addMealToPlan(mealType.type, suggestion.product, suggestion.servings)
          }
        }
      }

      toast.success('AI has filled your meal plan!')
      loadMealPlan()
    } catch (error) {
      console.error('Error auto-filling:', error)
      toast.error('Failed to auto-fill meal plan')
    } finally {
      setAiLoading(false)
    }
  }

  const addMealToPlan = async (mealType: string, product: any, servings: number = 1) => {
    try {
      const calories = Math.round((product.calories || 0) * servings)
      const protein = Math.round((product.protein || 0) * servings * 10) / 10
      const carbs = Math.round((product.carbs || 0) * servings * 10) / 10
      const fat = Math.round((product.fat || 0) * servings * 10) / 10

      const response = await fetch('/api/nutrition/meal-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: new Date().toISOString(),
          meals: [{ productId: product.id, mealType, servings, calories, protein, carbs, fat }],
        }),
      })

      if (response.ok) {
        return true
      }
      return false
    } catch (error) {
      console.error('Error adding meal:', error)
      return false
    }
  }

  const handleAddMeal = (mealType: string) => {
    setSelectedMealType(mealType)
    setShowMealSelector(true)
  }

  const handleProductSelect = async (product: any) => {
    if (selectedMealType) {
      const success = await addMealToPlan(selectedMealType, product)
      if (success) {
        toast.success('Meal added successfully!')
        loadMealPlan()
        setShowMealSelector(false)
      } else {
        toast.error('Failed to add meal')
      }
    }
  }

  const getMealLabel = (mealType: string) => {
    return MEAL_TYPES.find((mt) => mt.type === mealType)?.label || mealType
  }

  if (loading) {
    return (
      <Card className="p-6 bg-white">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-easymeals-green" />
        </div>
      </Card>
    )
  }

  return (
    <>
      <Card className="p-6 bg-white">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Today's Meal Planner</h3>
            <div className="flex items-center mt-2 text-sm text-gray-600">
              <span className="font-semibold text-green-600">{totalNutrition.calories}</span>
              <span className="mx-1">/</span>
              <span className="text-gray-400">{goals.calories}</span>
              <span className="ml-2">Kcal</span>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleAiAutoFill}
            disabled={aiLoading}
            className="flex items-center space-x-2"
          >
            {aiLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            <span>AI Auto-Fill</span>
          </Button>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-xs text-gray-500 mb-2">
            <span>Carbs</span>
            <span>Protein</span>
            <span>Fat</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full flex overflow-hidden">
            <div
              className="bg-orange-400"
              style={{ width: `${(totalNutrition.carbs / goals.carbs) * 100}%` }}
            ></div>
            <div
              className="bg-green-400"
              style={{ width: `${(totalNutrition.protein / goals.protein) * 100}%` }}
            ></div>
            <div
              className="bg-blue-400"
              style={{ width: `${(totalNutrition.fat / goals.fat) * 100}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs font-medium mt-1">
            <span className="text-orange-600">
              {Math.round(totalNutrition.carbs)}/{goals.carbs}g
            </span>
            <span className="text-green-600">
              {Math.round(totalNutrition.protein)}/{goals.protein}g
            </span>
            <span className="text-blue-600">
              {Math.round(totalNutrition.fat)}/{goals.fat}g
            </span>
          </div>
        </div>

        {/* Meal Slots */}
        <div className="space-y-3">
          {(expanded ? MEAL_TYPES : MEAL_TYPES.slice(0, 3)).map((mealType) => {
            const meal = meals.find((m) => m.mealType === mealType.type)
            const hasProduct = meal?.product

            return (
              <div
                key={mealType.type}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center space-x-3 flex-1">
                  {hasProduct ? (
                    <div className="relative w-12 h-12 rounded-full overflow-hidden bg-white flex-shrink-0">
                      <Image
                        src={meal.product.imageUrl || '/images/placeholder.png'}
                        alt={meal.product.name || ''}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                      <Plus className="w-6 h-6 text-gray-400" />
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900">
                      {hasProduct ? meal.product.name : mealType.label}
                    </div>
                    <div className="flex items-center text-xs text-gray-500 mt-1">
                      <Clock className="w-3 h-3 mr-1" />
                      <span>{mealType.time}</span>
                    </div>
                    {hasProduct && (
                      <div className="text-xs text-gray-600 mt-1">
                        {meal.calories} Kcal • {Math.round(meal.protein || 0)}g • {Math.round(meal.carbs || 0)}g •{' '}
                        {Math.round(meal.fat || 0)}g
                      </div>
                    )}
                  </div>
                </div>

                {hasProduct ? (
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                ) : (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleAddMeal(mealType.type)}
                    className="text-easymeals-green hover:bg-green-50 flex-shrink-0"
                  >
                    Add
                  </Button>
                )}
              </div>
            )
          })}
        </div>

        <Button
          onClick={() => router.push('/meals')}
          className="w-full mt-6 bg-easymeals-green hover:bg-green-600 text-white"
          size="lg"
        >
          <Plus className="w-4 h-4 mr-2" />
          Browse All Meals
        </Button>
      </Card>

      {/* Meal Selector Dialog */}
      <Dialog open={showMealSelector} onOpenChange={setShowMealSelector}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add {selectedMealType ? getMealLabel(selectedMealType) : 'Meal'}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-3 mt-4">
            {availableProducts.map((product) => (
              <div
                key={product.id}
                onClick={() => handleProductSelect(product)}
                className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
              >
                <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-white flex-shrink-0">
                  <Image
                    src={product.imageUrl || '/images/placeholder.png'}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{product.name}</div>
                  <div className="text-sm text-gray-600 mt-1">
                    {product.calories} kcal • {product.protein}g protein • {product.carbs}g carbs
                  </div>
                  <div className="text-sm font-semibold text-easymeals-green mt-1">€{product.price.toFixed(2)}</div>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
