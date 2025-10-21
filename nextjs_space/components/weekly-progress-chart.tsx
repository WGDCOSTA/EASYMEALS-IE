
'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { TrendingUp } from 'lucide-react'

export function WeeklyProgressChart() {
  const [weekData, setWeekData] = useState<any[]>([])

  useEffect(() => {
    // Mock data for now - in production, fetch from API
    const mockData = [
      { day: 'Mon', calories: 1850, target: 2000 },
      { day: 'Tue', calories: 1920, target: 2000 },
      { day: 'Wed', calories: 1780, target: 2000 },
      { day: 'Thu', calories: 2100, target: 2000 },
      { day: 'Fri', calories: 1890, target: 2000 },
      { day: 'Sat', calories: 2050, target: 2000 },
      { day: 'Sun', calories: 1940, target: 2000 },
    ]
    setWeekData(mockData)
  }, [])

  const maxCalories = Math.max(...weekData.map(d => Math.max(d.calories, d.target)))

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Weekly Progress</h3>
          <p className="text-sm text-gray-600 mt-1">Your calorie intake over the past week</p>
        </div>
        <TrendingUp className="w-6 h-6 text-easymeals-green" />
      </div>

      <div className="space-y-4">
        {weekData.map((data, index) => (
          <div key={index} className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-gray-700 w-12">{data.day}</span>
              <span className="text-gray-600">
                {data.calories} / {data.target} kcal
              </span>
            </div>
            <div className="relative h-8 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  data.calories > data.target
                    ? 'bg-orange-400'
                    : data.calories >= data.target * 0.9
                    ? 'bg-easymeals-green'
                    : 'bg-yellow-400'
                }`}
                style={{ width: `${(data.calories / maxCalories) * 100}%` }}
              />
              <div
                className="absolute top-0 h-full border-r-2 border-dashed border-gray-400"
                style={{ left: `${(data.target / maxCalories) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-center space-x-6 text-xs">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-easymeals-green"></div>
          <span className="text-gray-600">On Target</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
          <span className="text-gray-600">Below Target</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-orange-400"></div>
          <span className="text-gray-600">Above Target</span>
        </div>
      </div>
    </Card>
  )
}
