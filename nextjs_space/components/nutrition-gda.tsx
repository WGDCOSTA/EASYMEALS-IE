
'use client'

import { NutritionValues, calculateGDAPercentages, EU_GDA_REFERENCE, formatGDAPercentage, getTrafficLightColor, getTrafficLightLabel } from '@/lib/gda-calculator'

interface NutritionGDAProps {
  nutrition: NutritionValues
  servingSize: number // in grams
}

export function NutritionGDA({ nutrition, servingSize }: NutritionGDAProps) {
  const gdaPercentages = calculateGDAPercentages(nutrition)

  // Calculate per 100g values for traffic light system
  const per100g = {
    fat: nutrition.fat ? (nutrition.fat / servingSize) * 100 : 0,
    saturates: nutrition.saturates ? (nutrition.saturates / servingSize) * 100 : 0,
    sugars: nutrition.sugars ? (nutrition.sugars / servingSize) * 100 : 0,
    salt: nutrition.salt ? (nutrition.salt / servingSize) * 100 : 0,
  }

  const trafficLights = {
    fat: nutrition.fat ? getTrafficLightColor('fat', per100g.fat) : null,
    saturates: nutrition.saturates ? getTrafficLightColor('saturates', per100g.saturates) : null,
    sugars: nutrition.sugars ? getTrafficLightColor('sugars', per100g.sugars) : null,
    salt: nutrition.salt ? getTrafficLightColor('salt', per100g.salt) : null,
  }

  const getColorClass = (color: string | null) => {
    switch (color) {
      case 'green':
        return 'bg-green-500'
      case 'amber':
        return 'bg-amber-500'
      case 'red':
        return 'bg-red-500'
      default:
        return 'bg-gray-300'
    }
  }

  return (
    <div className="space-y-6">
      {/* Traffic Light Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {nutrition.fat !== undefined && (
          <div className="text-center">
            <div className={`w-full h-2 rounded-full mb-2 ${getColorClass(trafficLights.fat)}`}></div>
            <div className="text-sm font-semibold text-gray-900">{nutrition.fat}g</div>
            <div className="text-xs text-gray-600">Fat</div>
            <div className="text-xs text-gray-500 mt-1">
              {trafficLights.fat ? getTrafficLightLabel(trafficLights.fat) : ''}
            </div>
          </div>
        )}
        {nutrition.saturates !== undefined && (
          <div className="text-center">
            <div className={`w-full h-2 rounded-full mb-2 ${getColorClass(trafficLights.saturates)}`}></div>
            <div className="text-sm font-semibold text-gray-900">{nutrition.saturates}g</div>
            <div className="text-xs text-gray-600">Saturates</div>
            <div className="text-xs text-gray-500 mt-1">
              {trafficLights.saturates ? getTrafficLightLabel(trafficLights.saturates) : ''}
            </div>
          </div>
        )}
        {nutrition.sugars !== undefined && (
          <div className="text-center">
            <div className={`w-full h-2 rounded-full mb-2 ${getColorClass(trafficLights.sugars)}`}></div>
            <div className="text-sm font-semibold text-gray-900">{nutrition.sugars}g</div>
            <div className="text-xs text-gray-600">Sugars</div>
            <div className="text-xs text-gray-500 mt-1">
              {trafficLights.sugars ? getTrafficLightLabel(trafficLights.sugars) : ''}
            </div>
          </div>
        )}
        {nutrition.salt !== undefined && (
          <div className="text-center">
            <div className={`w-full h-2 rounded-full mb-2 ${getColorClass(trafficLights.salt)}`}></div>
            <div className="text-sm font-semibold text-gray-900">{nutrition.salt}g</div>
            <div className="text-xs text-gray-600">Salt</div>
            <div className="text-xs text-gray-500 mt-1">
              {trafficLights.salt ? getTrafficLightLabel(trafficLights.salt) : ''}
            </div>
          </div>
        )}
      </div>

      {/* Detailed Nutrition Table */}
      <div className="border rounded-lg overflow-hidden">
        <div className="bg-gray-50 px-4 py-2 border-b">
          <div className="grid grid-cols-3 gap-2 text-xs font-semibold text-gray-700">
            <div>Nutrient</div>
            <div className="text-right">Per Serving</div>
            <div className="text-right">% GDA*</div>
          </div>
        </div>

        <div className="divide-y">
          {nutrition.energyKcal !== undefined && (
            <div className="px-4 py-3">
              <div className="grid grid-cols-3 gap-2 text-sm">
                <div className="font-medium text-gray-900">Energy (kcal)</div>
                <div className="text-right text-gray-700">{nutrition.energyKcal}</div>
                <div className="text-right font-semibold text-easymeals-green">
                  {gdaPercentages.energyKcal ? formatGDAPercentage(gdaPercentages.energyKcal) : '-'}
                </div>
              </div>
            </div>
          )}

          {nutrition.energy !== undefined && (
            <div className="px-4 py-3">
              <div className="grid grid-cols-3 gap-2 text-sm">
                <div className="font-medium text-gray-900">Energy (kJ)</div>
                <div className="text-right text-gray-700">{nutrition.energy}</div>
                <div className="text-right font-semibold text-easymeals-green">
                  {gdaPercentages.energy ? formatGDAPercentage(gdaPercentages.energy) : '-'}
                </div>
              </div>
            </div>
          )}

          {nutrition.fat !== undefined && (
            <>
              <div className="px-4 py-3 bg-gray-50">
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div className="font-medium text-gray-900">Fat</div>
                  <div className="text-right text-gray-700">{nutrition.fat}g</div>
                  <div className="text-right font-semibold text-easymeals-green">
                    {gdaPercentages.fat ? formatGDAPercentage(gdaPercentages.fat) : '-'}
                  </div>
                </div>
              </div>
              {nutrition.saturates !== undefined && (
                <div className="px-4 py-3 pl-8">
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div className="text-gray-700">of which saturates</div>
                    <div className="text-right text-gray-700">{nutrition.saturates}g</div>
                    <div className="text-right font-semibold text-easymeals-green">
                      {gdaPercentages.saturates ? formatGDAPercentage(gdaPercentages.saturates) : '-'}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {nutrition.carbohydrates !== undefined && (
            <>
              <div className="px-4 py-3 bg-gray-50">
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div className="font-medium text-gray-900">Carbohydrates</div>
                  <div className="text-right text-gray-700">{nutrition.carbohydrates}g</div>
                  <div className="text-right text-gray-700">-</div>
                </div>
              </div>
              {nutrition.sugars !== undefined && (
                <div className="px-4 py-3 pl-8">
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div className="text-gray-700">of which sugars</div>
                    <div className="text-right text-gray-700">{nutrition.sugars}g</div>
                    <div className="text-right font-semibold text-easymeals-green">
                      {gdaPercentages.sugars ? formatGDAPercentage(gdaPercentages.sugars) : '-'}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {nutrition.fiber !== undefined && (
            <div className="px-4 py-3">
              <div className="grid grid-cols-3 gap-2 text-sm">
                <div className="font-medium text-gray-900">Fibre</div>
                <div className="text-right text-gray-700">{nutrition.fiber}g</div>
                <div className="text-right text-gray-700">-</div>
              </div>
            </div>
          )}

          {nutrition.protein !== undefined && (
            <div className="px-4 py-3 bg-gray-50">
              <div className="grid grid-cols-3 gap-2 text-sm">
                <div className="font-medium text-gray-900">Protein</div>
                <div className="text-right text-gray-700">{nutrition.protein}g</div>
                <div className="text-right text-gray-700">-</div>
              </div>
            </div>
          )}

          {nutrition.salt !== undefined && (
            <div className="px-4 py-3">
              <div className="grid grid-cols-3 gap-2 text-sm">
                <div className="font-medium text-gray-900">Salt</div>
                <div className="text-right text-gray-700">{nutrition.salt}g</div>
                <div className="text-right font-semibold text-easymeals-green">
                  {gdaPercentages.salt ? formatGDAPercentage(gdaPercentages.salt) : '-'}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* GDA Reference Note */}
      <div className="text-xs text-gray-500 space-y-1">
        <p>
          <strong>*Reference intake of an average adult</strong> (8400 kJ / 2000 kcal)
        </p>
        <p className="text-[10px]">
          Reference intakes are guidelines for an average adult. Your daily values may be higher or lower depending on your energy needs.
        </p>
        <p className="text-[10px]">
          Traffic light coding: <span className="text-green-600">Green = Low</span>, <span className="text-amber-600">Amber = Medium</span>, <span className="text-red-600">Red = High</span> (per 100g)
        </p>
      </div>
    </div>
  )
}
