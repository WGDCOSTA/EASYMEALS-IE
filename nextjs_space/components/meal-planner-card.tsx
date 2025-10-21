
'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Clock, CheckCircle2, Plus } from 'lucide-react'
import Image from 'next/image'

interface MealSlot {
  id: string
  time: string
  name?: string
  image?: string
  calories?: number
  protein?: number
  carbs?: number
  fat?: number
}

const DEFAULT_MEALS: MealSlot[] = [
  { id: 'breakfast', time: '08:00', name: 'Breakfast' },
  { id: 'lunch', time: '13:00 - 15:00', name: 'Lunch' },
  { id: 'dinner', time: '18:00', name: 'Dinner' },
]

export function MealPlannerCard() {
  const [meals, setMeals] = useState<MealSlot[]>(DEFAULT_MEALS)
  const [totalCalories, setTotalCalories] = useState(0)

  return (
    <Card className="p-6 bg-white">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Today's Meal Planner</h3>
          <div className="flex items-center mt-2 text-sm text-gray-600">
            <span className="font-semibold text-green-600">{totalCalories}</span>
            <span className="mx-1">/</span>
            <span className="text-gray-400">1322</span>
            <span className="ml-2">Kcal</span>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="text-gray-400">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 3V17M17 10H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
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
          <div className="bg-orange-400" style={{ width: '29%' }}></div>
          <div className="bg-green-400" style={{ width: '20%' }}></div>
          <div className="bg-blue-400" style={{ width: '18%' }}></div>
        </div>
        <div className="flex justify-between text-xs font-medium mt-1">
          <span className="text-orange-600">95/171g</span>
          <span className="text-green-600">20/68g</span>
          <span className="text-blue-600">18/46g</span>
        </div>
      </div>

      {/* Meal Slots */}
      <div className="space-y-3">
        {meals.map((meal) => (
          <div 
            key={meal.id}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <div className="flex items-center space-x-3">
              {meal.image ? (
                <div className="relative w-12 h-12 rounded-full overflow-hidden bg-white">
                  <Image
                    src={meal.image}
                    alt={meal.name || ''}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
                  <Plus className="w-6 h-6 text-gray-400" />
                </div>
              )}
              
              <div>
                <div className="font-medium text-gray-900">{meal.name}</div>
                <div className="flex items-center text-xs text-gray-500 mt-1">
                  <Clock className="w-3 h-3 mr-1" />
                  <span>{meal.time}</span>
                </div>
                {meal.calories && (
                  <div className="text-xs text-gray-600 mt-1">
                    {meal.calories} Kcal • {meal.protein}g • {meal.carbs}g • {meal.fat}g
                  </div>
                )}
              </div>
            </div>

            {meal.calories ? (
              <CheckCircle2 className="w-5 h-5 text-green-500" />
            ) : (
              <Button 
                size="sm" 
                variant="ghost"
                className="text-easymeals-green hover:bg-green-50"
              >
                Add
              </Button>
            )}
          </div>
        ))}
      </div>

      <Button 
        className="w-full mt-6 bg-easymeals-green hover:bg-green-600 text-white"
        size="lg"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Custom Meal
      </Button>
    </Card>
  )
}
