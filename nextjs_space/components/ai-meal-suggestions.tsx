
'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Sparkles, Loader2, Plus, RefreshCw } from 'lucide-react'
import Image from 'next/image'
import { toast } from 'sonner'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface AiMealSuggestionsProps {
  profile: any
  fullView?: boolean
}

export function AiMealSuggestions({ profile, fullView = false }: AiMealSuggestionsProps) {
  const [loading, setLoading] = useState(false)
  const [suggestions, setSuggestions] = useState<any[]>([])
  const [mealType, setMealType] = useState('BREAKFAST')
  const [nutritionalSummary, setNutritionalSummary] = useState('')

  const loadSuggestions = async () => {
    if (!profile?.useAiSuggestions) return

    setLoading(true)
    try {
      const response = await fetch('/api/nutrition/ai-suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mealType,
          servingsNeeded: fullView ? 5 : 3,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setSuggestions(data.suggestions)
        setNutritionalSummary(data.nutritionalSummary)
      } else {
        toast.error('Failed to load AI suggestions')
      }
    } catch (error) {
      console.error('Error loading AI suggestions:', error)
      toast.error('Failed to load AI suggestions')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (profile?.useAiSuggestions) {
      loadSuggestions()
    }
  }, [profile, mealType])

  const addToMealPlan = async (suggestion: any) => {
    try {
      const product = suggestion.product
      const calories = Math.round((product.calories || 0) * suggestion.servings)
      const protein = Math.round((product.protein || 0) * suggestion.servings * 10) / 10
      const carbs = Math.round((product.carbs || 0) * suggestion.servings * 10) / 10
      const fat = Math.round((product.fat || 0) * suggestion.servings * 10) / 10

      const response = await fetch('/api/nutrition/meal-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: new Date().toISOString(),
          meals: [{
            productId: product.id,
            mealType,
            servings: suggestion.servings,
            calories,
            protein,
            carbs,
            fat,
          }],
        }),
      })

      if (response.ok) {
        toast.success('Meal added to your plan!')
      } else {
        toast.error('Failed to add meal')
      }
    } catch (error) {
      console.error('Error adding meal:', error)
      toast.error('Failed to add meal')
    }
  }

  if (!profile?.useAiSuggestions) {
    return (
      <Card className="p-6 bg-gradient-to-r from-purple-50 to-blue-50">
        <div className="text-center py-8">
          <Sparkles className="w-12 h-12 mx-auto mb-4 text-purple-400" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Meal Suggestions</h3>
          <p className="text-sm text-gray-600 mb-4">
            Enable AI suggestions in settings to get personalized meal recommendations
          </p>
          <Button
            onClick={() => window.location.href = '/nutrition-dashboard/settings'}
            className="bg-purple-600 hover:bg-purple-700"
          >
            Enable AI
          </Button>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6 bg-white">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-purple-600" />
          <h3 className="text-lg font-bold text-gray-900">AI Suggestions</h3>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={loadSuggestions}
          disabled={loading}
          className="text-gray-400 hover:text-gray-600"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      <div className="mb-4">
        <Select value={mealType} onValueChange={setMealType}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="BREAKFAST">Breakfast</SelectItem>
            <SelectItem value="LUNCH">Lunch</SelectItem>
            <SelectItem value="DINNER">Dinner</SelectItem>
            <SelectItem value="MORNING_SNACK">Morning Snack</SelectItem>
            <SelectItem value="AFTERNOON_SNACK">Afternoon Snack</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {nutritionalSummary && (
        <div className="mb-4 p-3 bg-purple-50 rounded-lg text-sm text-gray-700">
          {nutritionalSummary}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
        </div>
      ) : suggestions.length > 0 ? (
        <div className="space-y-3">
          {suggestions.map((suggestion, index) => {
            const product = suggestion.product
            if (!product) return null

            const calories = Math.round((product.calories || 0) * suggestion.servings)
            const protein = Math.round((product.protein || 0) * suggestion.servings * 10) / 10
            const carbs = Math.round((product.carbs || 0) * suggestion.servings * 10) / 10
            const fat = Math.round((product.fat || 0) * suggestion.servings * 10) / 10

            return (
              <div
                key={index}
                className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-white flex-shrink-0">
                  <Image
                    src={product.imageUrl || '/images/placeholder.png'}
                    alt={product.name || 'Meal'}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 truncate">{product.name}</div>
                  <div className="text-xs text-gray-600 mt-1">
                    {calories} kcal • {protein}g protein • {carbs}g carbs • {fat}g fat
                  </div>
                  {suggestion.servings !== 1 && (
                    <div className="text-xs text-purple-600 mt-1">
                      {suggestion.servings}x serving
                    </div>
                  )}
                  {suggestion.reason && fullView && (
                    <div className="text-xs text-gray-500 mt-1 line-clamp-2">{suggestion.reason}</div>
                  )}
                </div>

                <Button
                  size="sm"
                  onClick={() => addToMealPlan(suggestion)}
                  className="bg-easymeals-green hover:bg-green-600 flex-shrink-0"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <p>No suggestions available</p>
        </div>
      )}
    </Card>
  )
}
