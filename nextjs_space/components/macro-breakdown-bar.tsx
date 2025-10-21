
'use client'

import { motion } from 'framer-motion'
import { Beef, Wheat, Droplet } from 'lucide-react'

interface MacroBreakdownBarProps {
  protein?: number | null
  carbs?: number | null
  fat?: number | null
}

export function MacroBreakdownBar({ protein = 0, carbs = 0, fat = 0 }: MacroBreakdownBarProps) {
  const total = (protein || 0) + (carbs || 0) + (fat || 0)
  
  if (total === 0) {
    return null
  }

  const proteinPercentage = ((protein || 0) / total) * 100
  const carbsPercentage = ((carbs || 0) / total) * 100
  const fatPercentage = ((fat || 0) / total) * 100

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Macronutrient Breakdown</h3>
      
      {/* Animated Bar */}
      <div className="relative h-12 bg-gray-100 rounded-full overflow-hidden mb-6">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${proteinPercentage}%` }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
          className="absolute left-0 top-0 h-full bg-gradient-to-r from-teal-400 to-teal-500"
        />
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${carbsPercentage}%` }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.4 }}
          className="absolute top-0 h-full bg-gradient-to-r from-amber-400 to-amber-500"
          style={{ left: `${proteinPercentage}%` }}
        />
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${fatPercentage}%` }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.6 }}
          className="absolute top-0 h-full bg-gradient-to-r from-purple-400 to-purple-500"
          style={{ left: `${proteinPercentage + carbsPercentage}%` }}
        />
      </div>

      {/* Legend */}
      <div className="grid grid-cols-3 gap-4">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-teal-500" />
          <div className="flex-1">
            <div className="flex items-center space-x-1">
              <Beef className="w-3 h-3 text-teal-600" />
              <span className="text-xs font-medium text-gray-700">Protein</span>
            </div>
            <div className="text-sm font-bold text-gray-900">{protein}g</div>
            <div className="text-xs text-gray-500">{proteinPercentage.toFixed(0)}%</div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-amber-500" />
          <div className="flex-1">
            <div className="flex items-center space-x-1">
              <Wheat className="w-3 h-3 text-amber-600" />
              <span className="text-xs font-medium text-gray-700">Carbs</span>
            </div>
            <div className="text-sm font-bold text-gray-900">{carbs}g</div>
            <div className="text-xs text-gray-500">{carbsPercentage.toFixed(0)}%</div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-purple-500" />
          <div className="flex-1">
            <div className="flex items-center space-x-1">
              <Droplet className="w-3 h-3 text-purple-600" />
              <span className="text-xs font-medium text-gray-700">Fat</span>
            </div>
            <div className="text-sm font-bold text-gray-900">{fat}g</div>
            <div className="text-xs text-gray-500">{fatPercentage.toFixed(0)}%</div>
          </div>
        </div>
      </div>
    </div>
  )
}
