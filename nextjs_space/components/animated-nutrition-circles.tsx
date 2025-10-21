
'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Flame, Beef, Wheat, Droplet, Leaf } from 'lucide-react'

interface NutritionData {
  calories?: number | null
  protein?: number | null
  carbs?: number | null
  fat?: number | null
  fiber?: number | null
}

interface AnimatedNutritionCirclesProps {
  nutrition: NutritionData
  servingWeight?: number
}

interface NutritionItem {
  label: string
  value: number
  unit: string
  color: string
  icon: React.ComponentType<{ className?: string }>
  percentage: number
  dailyValue?: number
}

export function AnimatedNutritionCircles({ nutrition, servingWeight = 100 }: AnimatedNutritionCirclesProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  // Calculate percentages for circle animations (relative to typical daily values)
  const calculatePercentage = (value: number, dailyValue: number) => {
    return Math.min((value / dailyValue) * 100, 100)
  }

  const nutritionItems: NutritionItem[] = [
    {
      label: 'Calories',
      value: nutrition.calories || 0,
      unit: 'kcal',
      color: '#FF6B6B',
      icon: Flame,
      percentage: calculatePercentage(nutrition.calories || 0, 2000),
      dailyValue: 2000,
    },
    {
      label: 'Protein',
      value: nutrition.protein || 0,
      unit: 'g',
      color: '#4ECDC4',
      icon: Beef,
      percentage: calculatePercentage(nutrition.protein || 0, 50),
      dailyValue: 50,
    },
    {
      label: 'Carbs',
      value: nutrition.carbs || 0,
      unit: 'g',
      color: '#FFD93D',
      icon: Wheat,
      percentage: calculatePercentage(nutrition.carbs || 0, 300),
      dailyValue: 300,
    },
    {
      label: 'Fat',
      value: nutrition.fat || 0,
      unit: 'g',
      color: '#A78BFA',
      icon: Droplet,
      percentage: calculatePercentage(nutrition.fat || 0, 70),
      dailyValue: 70,
    },
    {
      label: 'Fiber',
      value: nutrition.fiber || 0,
      unit: 'g',
      color: '#10B981',
      icon: Leaf,
      percentage: calculatePercentage(nutrition.fiber || 0, 25),
      dailyValue: 25,
    },
  ]

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-8 shadow-lg border border-gray-100">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Nutritional Information</h2>
        <p className="text-sm text-gray-600">Per {servingWeight}g serving</p>
      </div>

      {/* Main Calorie Circle */}
      <div className="flex justify-center mb-12">
        <div className="relative">
          <svg width="200" height="200" className="transform -rotate-90">
            {/* Background circle */}
            <circle
              cx="100"
              cy="100"
              r="85"
              fill="none"
              stroke="#F3F4F6"
              strokeWidth="16"
            />
            {/* Animated circle */}
            <motion.circle
              cx="100"
              cy="100"
              r="85"
              fill="none"
              stroke={nutritionItems[0].color}
              strokeWidth="16"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 85}`}
              initial={{ strokeDashoffset: 2 * Math.PI * 85 }}
              animate={{
                strokeDashoffset: isVisible
                  ? 2 * Math.PI * 85 * (1 - nutritionItems[0].percentage / 100)
                  : 2 * Math.PI * 85,
              }}
              transition={{ duration: 1.5, ease: 'easeOut', delay: 0.2 }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="w-8 h-8 mb-2" style={{ color: nutritionItems[0].color }}>
              <Flame className="w-full h-full" />
            </div>
            <div className="text-4xl font-bold text-gray-900">
              {nutritionItems[0].value}
            </div>
            <div className="text-sm text-gray-600 font-medium mt-1">
              {nutritionItems[0].unit}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {nutritionItems[0].percentage.toFixed(0)}% DV
            </div>
          </div>
        </div>
      </div>

      {/* Macro Nutrients Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
        {nutritionItems.slice(1).map((item, index) => {
          const Icon = item.icon
          const circumference = 2 * Math.PI * 45

          return (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
              className="flex flex-col items-center"
            >
              <div className="relative mb-3">
                <svg width="100" height="100" className="transform -rotate-90">
                  {/* Background circle */}
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="#F3F4F6"
                    strokeWidth="8"
                  />
                  {/* Animated circle */}
                  <motion.circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke={item.color}
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${circumference}`}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{
                      strokeDashoffset: isVisible
                        ? circumference * (1 - item.percentage / 100)
                        : circumference,
                    }}
                    transition={{ duration: 1.5, ease: 'easeOut', delay: 0.4 + index * 0.1 }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="w-5 h-5 mb-1" style={{ color: item.color }}>
                    <Icon className="w-full h-full" />
                  </div>
                  <div className="text-lg font-bold text-gray-900">{item.value}</div>
                  <div className="text-xs text-gray-600">{item.unit}</div>
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm font-semibold text-gray-900">{item.label}</div>
                <div className="text-xs text-gray-500">{item.percentage.toFixed(0)}% DV</div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Daily Value Reference */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center">
          * DV = Daily Value based on a 2,000 calorie diet
        </p>
      </div>
    </div>
  )
}
