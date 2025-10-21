
'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Target, TrendingUp, Edit } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface NutritionGoalsCardProps {
  profile: any
  onUpdate?: (profile: any) => void
}

export function NutritionGoalsCard({ profile, onUpdate }: NutritionGoalsCardProps) {
  const router = useRouter()
  
  const goals = profile ? {
    calories: profile.dailyCalories || 2000,
    protein: profile.dailyProtein || 60,
    carbs: profile.dailyCarbs || 225,
    fat: profile.dailyFat || 77,
  } : {
    calories: 2000,
    protein: 60,
    carbs: 225,
    fat: 77,
  }

  const getGoalText = (goal: string) => {
    const goalMap: any = {
      'LOSE_WEIGHT': 'Lose Weight',
      'MAINTAIN': 'Maintain Weight',
      'GAIN_MUSCLE': 'Gain Muscle',
      'IMPROVE_HEALTH': 'Improve Health',
    }
    return goalMap[goal] || 'Maintain Weight'
  }

  const getActivityText = (level: string) => {
    const levelMap: any = {
      'SEDENTARY': 'Sedentary',
      'LIGHT': 'Light Activity',
      'MODERATE': 'Moderate Activity',
      'ACTIVE': 'Active',
      'VERY_ACTIVE': 'Very Active',
    }
    return levelMap[level] || 'Moderate Activity'
  }

  return (
    <Card className="p-6 bg-white">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Target className="w-5 h-5 text-easymeals-green" />
          <h3 className="text-lg font-bold text-gray-900">Your Goals</h3>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push('/nutrition-dashboard/settings')}
          className="text-gray-400 hover:text-gray-600"
        >
          <Edit className="w-4 h-4" />
        </Button>
      </div>

      {profile ? (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4">
            <div className="text-sm text-gray-600 mb-1">Current Goal</div>
            <div className="text-xl font-bold text-gray-900">{getGoalText(profile.goal)}</div>
            <div className="text-xs text-gray-500 mt-1">{getActivityText(profile.activityLevel)}</div>
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Daily Calories</span>
                <span className="font-semibold text-gray-900">{goals.calories} kcal</span>
              </div>
              <Progress value={100} className="h-2" />
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Protein</span>
                <span className="font-semibold text-gray-900">{goals.protein}g</span>
              </div>
              <Progress value={100} className="h-2" />
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Carbohydrates</span>
                <span className="font-semibold text-gray-900">{goals.carbs}g</span>
              </div>
              <Progress value={100} className="h-2" />
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Fat</span>
                <span className="font-semibold text-gray-900">{goals.fat}g</span>
              </div>
              <Progress value={100} className="h-2" />
            </div>
          </div>

          {profile.useAiSuggestions && (
            <div className="mt-4 p-3 bg-purple-50 rounded-lg border border-purple-200">
              <div className="flex items-center space-x-2 text-purple-700">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm font-medium">AI Suggestions Enabled</span>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">Set up your nutrition goals to get started</p>
          <Button
            onClick={() => router.push('/nutrition-dashboard/settings')}
            className="bg-easymeals-green hover:bg-green-600"
          >
            Set Goals
          </Button>
        </div>
      )}
    </Card>
  )
}
