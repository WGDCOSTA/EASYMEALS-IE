
'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Flame, TrendingUp, Lock, Sparkles, Calendar, Award } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export function GuestNutritionDashboard() {
  const router = useRouter()

  // Demo data for guests
  const demoGoals = {
    calories: 2000,
    protein: 60,
    carbs: 225,
    fat: 77,
  }

  const demoIntake = {
    calories: 1450,
    protein: 52,
    carbs: 180,
    fat: 48,
  }

  const demoProducts = [
    {
      id: '1',
      name: 'Grilled Chicken & Vegetables',
      imageUrl: '/images/meals/chicken-meal.jpg',
      calories: 450,
      protein: 35,
      category: 'HEALTHY',
    },
    {
      id: '2',
      name: 'Salmon with Quinoa',
      imageUrl: '/images/meals/salmon-meal.jpg',
      calories: 520,
      protein: 40,
      category: 'SEAFOOD',
    },
    {
      id: '3',
      name: 'Vegetarian Buddha Bowl',
      imageUrl: '/images/meals/buddha-bowl.jpg',
      calories: 380,
      protein: 18,
      category: 'VEGETARIAN',
    },
  ]

  return (
    <div className="relative">
      {/* Overlay with blur effect */}
      <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-10 rounded-lg" />

      {/* Sign in prompt - centered over the blurred content */}
      <div className="absolute inset-0 z-20 flex items-center justify-center p-6">
        <Card className="max-w-md w-full p-8 text-center shadow-xl">
          <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-white" />
          </div>
          
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Unlock Your Nutrition Dashboard</h3>
          <p className="text-gray-600 mb-6">
            Sign in to access personalized meal planning, AI-powered recommendations, and track your nutrition goals
          </p>

          <div className="space-y-3 mb-6">
            <div className="flex items-center space-x-3 text-sm text-gray-700">
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-3 h-3 text-green-600" />
              </div>
              <span>AI-powered meal suggestions tailored to your goals</span>
            </div>
            <div className="flex items-center space-x-3 text-sm text-gray-700">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-3 h-3 text-blue-600" />
              </div>
              <span>Track calories, macros, and nutrition progress</span>
            </div>
            <div className="flex items-center space-x-3 text-sm text-gray-700">
              <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Calendar className="w-3 h-3 text-purple-600" />
              </div>
              <span>Weekly meal planning and shopping insights</span>
            </div>
            <div className="flex items-center space-x-3 text-sm text-gray-700">
              <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Award className="w-3 h-3 text-yellow-600" />
              </div>
              <span>Purchase history analysis and favorite meals</span>
            </div>
          </div>

          <div className="flex flex-col space-y-3">
            <Button
              onClick={() => router.push('/auth/signin')}
              size="lg"
              className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white"
            >
              Sign In to Continue
            </Button>
            
            <Button
              onClick={() => router.push('/auth/signup')}
              size="lg"
              variant="outline"
              className="w-full"
            >
              Create Free Account
            </Button>
          </div>

          <p className="text-xs text-gray-500 mt-4">
            Already browsing meals? You can still{' '}
            <Link href="/meals" className="text-green-600 hover:underline">
              shop without an account
            </Link>
          </p>
        </Card>
      </div>

      {/* Demo dashboard content (blurred in background) */}
      <div className="space-y-6 p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calorie Tracker */}
          <Card className="p-6 bg-gradient-to-br from-green-500 to-green-600 text-white">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold">CALORIE TRACKER</h3>
              <Badge className="bg-white text-green-600">Demo</Badge>
            </div>

            <div className="flex justify-center mb-6">
              <div className="relative w-40 h-40">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="80" cy="80" r="70" stroke="rgba(255,255,255,0.2)" strokeWidth="10" fill="none" />
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    stroke="white"
                    strokeWidth="10"
                    fill="none"
                    strokeDasharray={`${(demoIntake.calories / demoGoals.calories) * 440} 440`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <Flame className="w-6 h-6 mb-1" />
                  <div className="text-3xl font-bold">{demoIntake.calories}</div>
                  <div className="text-xs opacity-80">Calories</div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Protein</span>
                  <span>{demoIntake.protein}g / {demoGoals.protein}g</span>
                </div>
                <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-yellow-400" style={{ width: `${(demoIntake.protein / demoGoals.protein) * 100}%` }} />
                </div>
              </div>
            </div>
          </Card>

          {/* Meal Planner */}
          <Card className="p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Today's Meals</h3>
            <div className="space-y-3">
              {['Breakfast', 'Lunch', 'Dinner'].map((meal) => (
                <div key={meal} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-900">{meal}</div>
                    <div className="text-xs text-gray-500">08:00</div>
                  </div>
                  <Badge variant="outline" className="opacity-50 pointer-events-none">Empty</Badge>
                </div>
              ))}
            </div>
          </Card>

          {/* AI Suggestions */}
          <Card className="p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Sparkles className="w-5 h-5 text-green-600" />
              <h3 className="text-xl font-bold text-gray-900">AI Suggestions</h3>
            </div>
            <div className="space-y-3">
              {demoProducts.map((product) => (
                <div key={product.id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="font-medium text-gray-900 text-sm">{product.name}</div>
                  <div className="text-xs text-gray-600 mt-1">{product.calories} kcal • {product.protein}g protein</div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
