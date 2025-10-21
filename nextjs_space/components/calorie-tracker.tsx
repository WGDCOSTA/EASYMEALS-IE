
'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Flame, TrendingUp, Target, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface NutritionGoals {
  calories: number
  protein: number
  carbs: number
  fat: number
}

interface DailyIntake {
  calories: number
  protein: number
  carbs: number
  fat: number
}

const DEFAULT_GOALS: NutritionGoals = {
  calories: 2000,
  protein: 60,
  carbs: 225,
  fat: 77
}

export function CalorieTracker() {
  const [goals] = useState<NutritionGoals>(DEFAULT_GOALS)
  const [dailyIntake, setDailyIntake] = useState<DailyIntake>({
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0
  })
  const [selectedDate, setSelectedDate] = useState(new Date())

  useEffect(() => {
    // Load daily intake from localStorage
    const savedIntake = localStorage.getItem(`intake-${selectedDate.toDateString()}`)
    if (savedIntake) {
      setDailyIntake(JSON.parse(savedIntake))
    } else {
      setDailyIntake({ calories: 0, protein: 0, carbs: 0, fat: 0 })
    }
  }, [selectedDate])

  const getProgressColor = (current: number, goal: number) => {
    const percentage = (current / goal) * 100
    if (percentage < 70) return 'bg-green-500'
    if (percentage < 90) return 'bg-yellow-500'
    if (percentage < 110) return 'bg-orange-500'
    return 'bg-red-500'
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-IE', { weekday: 'short', day: 'numeric' })
  }

  const getWeekDates = () => {
    const dates = []
    for (let i = -2; i <= 2; i++) {
      const date = new Date()
      date.setDate(date.getDate() + i)
      dates.push(date)
    }
    return dates
  }

  return (
    <Card className="p-6 bg-gradient-to-br from-easymeals-green to-green-600 text-white">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Calendar className="w-5 h-5" />
          <h3 className="text-lg font-bold">CALORIE TRACKER</h3>
        </div>
        <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
          <Target className="w-5 h-5" />
        </Button>
      </div>

      {/* Date Selector */}
      <div className="flex justify-between mb-6">
        {getWeekDates().map((date, index) => {
          const isSelected = date.toDateString() === selectedDate.toDateString()
          const isToday = date.toDateString() === new Date().toDateString()
          return (
            <button
              key={index}
              onClick={() => setSelectedDate(date)}
              className={`flex flex-col items-center px-3 py-2 rounded-lg transition-colors ${
                isSelected 
                  ? 'bg-white text-easymeals-green' 
                  : 'text-white hover:bg-white/20'
              }`}
            >
              <div className={`text-xs ${isSelected ? 'text-gray-600' : 'text-white'}`}>
                {formatDate(date).split(' ')[0]}
              </div>
              <div className={`text-lg font-bold ${isToday ? 'relative' : ''}`}>
                {formatDate(date).split(' ')[1]}
                {isToday && (
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-orange-400 rounded-full"></div>
                )}
              </div>
            </button>
          )
        })}
      </div>

      {/* Calorie Circle */}
      <div className="flex justify-center mb-6">
        <div className="relative w-48 h-48">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="96"
              cy="96"
              r="80"
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="12"
              fill="none"
            />
            <circle
              cx="96"
              cy="96"
              r="80"
              stroke="white"
              strokeWidth="12"
              fill="none"
              strokeDasharray={`${(dailyIntake.calories / goals.calories) * 502} 502`}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <Flame className="w-8 h-8 mb-2" />
            <div className="text-4xl font-bold">{dailyIntake.calories}</div>
            <div className="text-sm opacity-80">Calories</div>
            <div className="text-xs opacity-60">Goal {goals.calories}</div>
          </div>
        </div>
      </div>

      {/* Macronutrients */}
      <div className="space-y-4">
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium flex items-center">
              <TrendingUp className="w-4 h-4 mr-1" />
              Protein
            </span>
            <span className="text-sm font-bold">{dailyIntake.protein}g / {goals.protein}g</span>
          </div>
          <div className="h-2 bg-white/20 rounded-full overflow-hidden">
            <div 
              className="h-full bg-yellow-400 transition-all duration-500"
              style={{ width: `${Math.min((dailyIntake.protein / goals.protein) * 100, 100)}%` }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Carb</span>
            <span className="text-sm font-bold">{dailyIntake.carbs}g / {goals.carbs}g</span>
          </div>
          <div className="h-2 bg-white/20 rounded-full overflow-hidden">
            <div 
              className="h-full bg-green-400 transition-all duration-500"
              style={{ width: `${Math.min((dailyIntake.carbs / goals.carbs) * 100, 100)}%` }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Fat</span>
            <span className="text-sm font-bold">{dailyIntake.fat}g / {goals.fat}g</span>
          </div>
          <div className="h-2 bg-white/20 rounded-full overflow-hidden">
            <div 
              className="h-full bg-pink-400 transition-all duration-500"
              style={{ width: `${Math.min((dailyIntake.fat / goals.fat) * 100, 100)}%` }}
            />
          </div>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-white/20 text-center text-xs text-white">
        Add meals to your cart to track your daily nutrition
      </div>
    </Card>
  )
}
