
'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp, Thermometer, Snowflake, Refrigerator, Trash2, AlertTriangle, Info } from 'lucide-react'
import { NutritionGDA } from './nutrition-gda'
import { NutritionValues } from '@/lib/gda-calculator'

interface AccordionSection {
  id: string
  title: string
  icon: React.ReactNode
  content: React.ReactNode
}

interface ProductAccordionProps {
  nutrition?: NutritionValues
  servingSize?: number
  servingWeight?: number
  storageType: string
  cookingInstructions?: string
  storageInstructions?: string
  recyclingInfo?: string
  safetyInfo?: string
  allergens?: string[]
}

export function ProductAccordion({
  nutrition,
  servingSize = 1,
  servingWeight = 300,
  storageType,
  cookingInstructions,
  storageInstructions,
  recyclingInfo,
  safetyInfo,
  allergens = []
}: ProductAccordionProps) {
  const [openSections, setOpenSections] = useState<string[]>(['nutrition'])

  const toggleSection = (sectionId: string) => {
    setOpenSections(prev =>
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    )
  }

  const sections: AccordionSection[] = [
    {
      id: 'nutrition',
      title: 'Nutrition Information',
      icon: <Info className="w-5 h-5 text-easymeals-green" />,
      content: nutrition ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
            <span>Serving size: {servingWeight}g ({servingSize} serving{servingSize > 1 ? 's' : ''})</span>
          </div>
          <NutritionGDA nutrition={nutrition} servingSize={servingWeight} />
        </div>
      ) : (
        <p className="text-gray-600 text-sm">Nutritional information not available.</p>
      )
    },
    {
      id: 'storage',
      title: 'Storage Instructions',
      icon: storageType === 'FROZEN' ? (
        <Snowflake className="w-5 h-5 text-blue-500" />
      ) : (
        <Refrigerator className="w-5 h-5 text-green-500" />
      ),
      content: (
        <div className="space-y-3 text-sm text-gray-700">
          {storageInstructions ? (
            <p className="leading-relaxed">{storageInstructions}</p>
          ) : (
            <>
              {storageType === 'FROZEN' ? (
                <>
                  <p className="leading-relaxed">
                    <strong>Frozen Storage:</strong> Keep frozen at -18°C or below until ready to use.
                  </p>
                  <p className="leading-relaxed">
                    <strong>Defrosting:</strong> Defrost thoroughly in the refrigerator overnight before cooking. Do not refreeze once defrosted.
                  </p>
                  <p className="leading-relaxed">
                    <strong>Once Defrosted:</strong> Use within 24 hours. Keep refrigerated and consume within the use-by date.
                  </p>
                </>
              ) : (
                <>
                  <p className="leading-relaxed">
                    <strong>Fresh Chilled:</strong> Keep refrigerated at 0-5°C. Store on the bottom shelf of your refrigerator.
                  </p>
                  <p className="leading-relaxed">
                    <strong>Shelf Life:</strong> Consume within the use-by date shown on packaging. Once opened, consume within 2 days.
                  </p>
                  <p className="leading-relaxed">
                    <strong>Not Suitable for Freezing:</strong> This product is best enjoyed fresh and should not be frozen.
                  </p>
                </>
              )}
            </>
          )}
        </div>
      )
    },
    {
      id: 'cooking',
      title: 'Cooking Instructions',
      icon: <Thermometer className="w-5 h-5 text-orange-500" />,
      content: (
        <div className="space-y-4 text-sm text-gray-700">
          {cookingInstructions ? (
            <p className="leading-relaxed whitespace-pre-line">{cookingInstructions}</p>
          ) : (
            <>
              <div className="space-y-2">
                <p className="font-semibold text-gray-900">Microwave (700W):</p>
                <ol className="list-decimal list-inside space-y-1 ml-2">
                  <li>Pierce film lid several times</li>
                  <li>Heat on full power for 4-5 minutes</li>
                  <li>Stir halfway through cooking</li>
                  <li>Allow to stand for 1 minute before serving</li>
                </ol>
              </div>

              <div className="space-y-2">
                <p className="font-semibold text-gray-900">Oven:</p>
                <ol className="list-decimal list-inside space-y-1 ml-2">
                  <li>Preheat oven to 180°C (160°C fan) / Gas Mark 4</li>
                  <li>Remove film lid and cover with foil</li>
                  <li>Place on a baking tray in the centre of the oven</li>
                  <li>Heat for 25-30 minutes until piping hot throughout</li>
                </ol>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mt-4">
                <p className="text-amber-900 text-xs">
                  <strong>Important:</strong> Ensure food is piping hot throughout before serving. These are guidelines only as appliances vary. Do not reheat once cooled.
                </p>
              </div>
            </>
          )}
        </div>
      )
    },
    {
      id: 'recycling',
      title: 'Recycling Information',
      icon: <Trash2 className="w-5 h-5 text-green-600" />,
      content: (
        <div className="space-y-3 text-sm text-gray-700">
          {recyclingInfo ? (
            <p className="leading-relaxed">{recyclingInfo}</p>
          ) : (
            <>
              <p className="leading-relaxed">
                We're committed to reducing our environmental impact. Please recycle where facilities exist.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="font-semibold text-gray-900 mb-1">Film Lid</p>
                  <p className="text-xs text-gray-600">Not currently recyclable - General waste</p>
                </div>
                <div className="bg-green-50 rounded-lg p-3">
                  <p className="font-semibold text-gray-900 mb-1">Tray</p>
                  <p className="text-xs text-gray-600">Widely recycled - Rinse & recycle with plastics</p>
                </div>
                <div className="bg-green-50 rounded-lg p-3">
                  <p className="font-semibold text-gray-900 mb-1">Sleeve</p>
                  <p className="text-xs text-gray-600">Widely recycled - Recycle with paper/card</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="font-semibold text-gray-900 mb-1">Label</p>
                  <p className="text-xs text-gray-600">Not currently recyclable - Remove before recycling tray</p>
                </div>
              </div>
            </>
          )}
        </div>
      )
    }
  ]

  // Add safety information section if there are allergens or custom safety info
  if (allergens.length > 0 || safetyInfo) {
    sections.push({
      id: 'safety',
      title: 'Safety & Allergen Information',
      icon: <AlertTriangle className="w-5 h-5 text-red-500" />,
      content: (
        <div className="space-y-4 text-sm">
          {allergens.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="font-semibold text-red-900 mb-2">Allergen Warning:</p>
              <p className="text-red-800">
                <strong>Contains:</strong> {allergens.join(', ')}
              </p>
              <p className="text-red-700 text-xs mt-2">
                For allergens, see ingredients in <strong>bold</strong>. May also contain traces of other allergens due to cross-contamination in our kitchen.
              </p>
            </div>
          )}
          
          {safetyInfo ? (
            <div className="text-gray-700 leading-relaxed">
              <p>{safetyInfo}</p>
            </div>
          ) : (
            <div className="space-y-2 text-gray-700">
              <p className="leading-relaxed">
                <strong>Keep refrigerated/frozen</strong> at the appropriate temperature until ready to cook.
              </p>
              <p className="leading-relaxed">
                <strong>Cook thoroughly</strong> before consumption. Ensure food is piping hot throughout before serving.
              </p>
              <p className="leading-relaxed">
                <strong>Do not reheat</strong> once cooled. Consume immediately after heating.
              </p>
              <p className="leading-relaxed">
                <strong>Suitable for home freezing.</strong> Freeze on day of purchase and use within 1 month. Defrost thoroughly before use.
              </p>
            </div>
          )}
        </div>
      )
    })
  }

  return (
    <div className="space-y-3">
      {sections.map(section => (
        <div
          key={section.id}
          className="border rounded-lg overflow-hidden bg-white"
        >
          <button
            onClick={() => toggleSection(section.id)}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center space-x-3">
              {section.icon}
              <span className="font-semibold text-gray-900">{section.title}</span>
            </div>
            {openSections.includes(section.id) ? (
              <ChevronUp className="w-5 h-5 text-gray-500" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-500" />
            )}
          </button>
          
          {openSections.includes(section.id) && (
            <div className="p-4 pt-0 border-t bg-gray-50">
              {section.content}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
