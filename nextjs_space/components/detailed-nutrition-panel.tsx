
'use client'

import { motion } from 'framer-motion'
import { CheckCircle, AlertTriangle, Info } from 'lucide-react'

interface NutritionPanelProps {
  energyKj?: number | null
  sugars?: number | null
  saturatedFat?: number | null
  salt?: number | null
  servingWeight?: number
}

export function DetailedNutritionPanel({
  energyKj,
  sugars,
  saturatedFat,
  salt,
  servingWeight = 100,
}: NutritionPanelProps) {
  const nutritionDetails = [
    {
      label: 'Energy (kJ)',
      value: energyKj,
      unit: 'kJ',
      status: null,
    },
    {
      label: 'Sugars',
      value: sugars,
      unit: 'g',
      status: (sugars || 0) < 5 ? 'low' : (sugars || 0) > 15 ? 'high' : 'medium',
    },
    {
      label: 'Saturated Fat',
      value: saturatedFat,
      unit: 'g',
      status: (saturatedFat || 0) < 1.5 ? 'low' : (saturatedFat || 0) > 5 ? 'high' : 'medium',
    },
    {
      label: 'Salt',
      value: salt,
      unit: 'g',
      status: (salt || 0) < 0.3 ? 'low' : (salt || 0) > 1.5 ? 'high' : 'medium',
    },
  ]

  const getStatusIcon = (status: string | null) => {
    switch (status) {
      case 'low':
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'high':
        return <AlertTriangle className="w-4 h-4 text-amber-600" />
      case 'medium':
        return <Info className="w-4 h-4 text-blue-600" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case 'low':
        return 'bg-green-50 border-green-200'
      case 'high':
        return 'bg-amber-50 border-amber-200'
      case 'medium':
        return 'bg-blue-50 border-blue-200'
      default:
        return 'bg-gray-50 border-gray-200'
    }
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Nutrition Facts</h3>
      <p className="text-sm text-gray-600 mb-6">Per {servingWeight}g serving</p>

      <div className="space-y-3">
        {nutritionDetails.map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className={`flex items-center justify-between p-4 rounded-lg border ${getStatusColor(item.status)}`}
          >
            <div className="flex items-center space-x-3">
              {getStatusIcon(item.status)}
              <span className="text-sm font-medium text-gray-900">{item.label}</span>
            </div>
            <div className="flex items-baseline space-x-1">
              <span className="text-lg font-bold text-gray-900">{item.value || 0}</span>
              <span className="text-sm text-gray-600">{item.unit}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Traffic Light System Legend */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h4 className="text-xs font-semibold text-gray-700 mb-3">Nutritional Quality Indicators</h4>
        <div className="grid grid-cols-3 gap-3 text-xs">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-3 h-3 text-green-600" />
            <span className="text-gray-600">Low</span>
          </div>
          <div className="flex items-center space-x-2">
            <Info className="w-3 h-3 text-blue-600" />
            <span className="text-gray-600">Medium</span>
          </div>
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-3 h-3 text-amber-600" />
            <span className="text-gray-600">High</span>
          </div>
        </div>
      </div>
    </div>
  )
}
