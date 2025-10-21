
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Wand2, Loader2, CheckCircle2, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'

interface NutritionData {
  calories: number
  energyKj: number
  protein: number
  carbs: number
  sugars: number
  fat: number
  saturatedFat: number
  fiber: number
  salt: number
  servingWeight: number
  servingSize: number
  preparationTime: number
}

interface AIGNutritionPopulatorProps {
  productId: string
  productName: string
  ingredients?: string
  onSuccess?: (data: NutritionData) => void
}

export function AIGNutritionPopulator({
  productId,
  productName,
  ingredients,
  onSuccess
}: AIGNutritionPopulatorProps) {
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<'idle' | 'processing' | 'completed' | 'error'>('idle')
  const [nutritionData, setNutritionData] = useState<NutritionData | null>(null)

  const generateNutritionData = async () => {
    setLoading(true)
    setStatus('processing')

    try {
      const response = await fetch('/api/ai/nutrition', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productName,
          ingredients,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate nutrition data')
      }

      const reader = response.body?.getReader()
      if (!reader) {
        throw new Error('No response stream')
      }

      const decoder = new TextDecoder()
      let partialRead = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        partialRead += decoder.decode(value, { stream: true })
        let lines = partialRead.split('\n')
        partialRead = lines.pop() || ''

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6)
            if (data === '[DONE]') {
              return
            }
            try {
              const parsed = JSON.parse(data)
              if (parsed.status === 'processing') {
                setStatus('processing')
              } else if (parsed.status === 'completed') {
                setNutritionData(parsed.result)
                setStatus('completed')
                toast.success('Nutrition data generated successfully!')
                if (onSuccess) {
                  onSuccess(parsed.result)
                }
                return
              } else if (parsed.status === 'error') {
                throw new Error(parsed.message || 'Generation failed')
              }
            } catch (e) {
              // Skip invalid JSON
            }
          }
        }
      }
    } catch (error) {
      console.error('Error generating nutrition data:', error)
      setStatus('error')
      toast.error('Failed to generate nutrition data')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="p-6 border-2 border-dashed border-gray-300">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <Wand2 className="w-5 h-5 text-purple-600" />
            <h3 className="font-semibold text-gray-900">AI Nutrition Analysis</h3>
          </div>
          <p className="text-sm text-gray-600">
            {status === 'idle' && 'Use AI to automatically calculate nutritional values based on ingredients'}
            {status === 'processing' && 'Analyzing ingredients and calculating nutritional values...'}
            {status === 'completed' && 'Nutrition data generated successfully!'}
            {status === 'error' && 'Failed to generate nutrition data. Please try again.'}
          </p>
          
          {nutritionData && status === 'completed' && (
            <div className="mt-4 grid grid-cols-3 gap-3">
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-xs text-gray-500">Calories</div>
                <div className="text-lg font-bold text-gray-900">{nutritionData.calories} kcal</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-xs text-gray-500">Protein</div>
                <div className="text-lg font-bold text-gray-900">{nutritionData.protein}g</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-xs text-gray-500">Carbs</div>
                <div className="text-lg font-bold text-gray-900">{nutritionData.carbs}g</div>
              </div>
            </div>
          )}
        </div>

        <Button
          onClick={generateNutritionData}
          disabled={loading || status === 'completed'}
          className={`ml-4 ${
            status === 'completed' 
              ? 'bg-green-600 hover:bg-green-700' 
              : 'bg-purple-600 hover:bg-purple-700'
          }`}
        >
          {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          {status === 'completed' && <CheckCircle2 className="w-4 h-4 mr-2" />}
          {status === 'error' && <AlertCircle className="w-4 h-4 mr-2" />}
          {status === 'idle' && 'Generate'}
          {status === 'processing' && 'Analyzing...'}
          {status === 'completed' && 'Generated'}
          {status === 'error' && 'Retry'}
        </Button>
      </div>
    </Card>
  )
}
