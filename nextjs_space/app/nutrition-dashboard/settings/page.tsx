
'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ArrowLeft, Save, Sparkles } from 'lucide-react'
import { toast } from 'sonner'

export default function NutritionSettings() {
  const { data: session, status } = useSession() || {}
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [profile, setProfile] = useState<any>({
    dailyCalories: 2000,
    dailyProtein: 60,
    dailyCarbs: 225,
    dailyFat: 77,
    dietaryPreferences: [],
    allergies: [],
    activityLevel: 'MODERATE',
    goal: 'MAINTAIN',
    age: null,
    weight: null,
    height: null,
    gender: null,
    useAiSuggestions: false,
  })

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
      return
    }

    if (status === 'authenticated') {
      fetchProfile()
    }
  }, [status, router])

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/nutrition/profile')
      if (response.ok) {
        const data = await response.json()
        setProfile(data || profile)
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const response = await fetch('/api/nutrition/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      })

      if (response.ok) {
        toast.success('Nutrition profile saved successfully!')
        router.push('/nutrition-dashboard')
      } else {
        toast.error('Failed to save nutrition profile')
      }
    } catch (error) {
      console.error('Error saving profile:', error)
      toast.error('Failed to save nutrition profile')
    } finally {
      setSaving(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-easymeals-green"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.push('/nutrition-dashboard')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Nutrition Settings</h1>
          <p className="text-gray-600 mt-1">Customize your nutrition goals and preferences</p>
        </div>

        <div className="space-y-6">
          {/* AI Integration */}
          <Card className="p-6 bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-200">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  <h3 className="font-semibold text-gray-900">AI Meal Suggestions</h3>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Let our AI nutritionist automatically suggest personalized meal plans based on your goals and preferences
                </p>
                <div className="flex items-center space-x-3">
                  <Switch
                    checked={profile.useAiSuggestions}
                    onCheckedChange={(checked) =>
                      setProfile({ ...profile, useAiSuggestions: checked })
                    }
                  />
                  <Label className="text-sm font-medium">
                    {profile.useAiSuggestions ? 'AI Enabled' : 'AI Disabled'}
                  </Label>
                </div>
              </div>
            </div>
          </Card>

          {/* Personal Information */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  value={profile.age || ''}
                  onChange={(e) => setProfile({ ...profile, age: parseInt(e.target.value) || null })}
                  placeholder="25"
                />
              </div>
              <div>
                <Label htmlFor="gender">Gender</Label>
                <Select
                  value={profile.gender || 'not-specified'}
                  onValueChange={(value) =>
                    setProfile({ ...profile, gender: value === 'not-specified' ? null : value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="not-specified">Prefer not to say</SelectItem>
                    <SelectItem value="MALE">Male</SelectItem>
                    <SelectItem value="FEMALE">Female</SelectItem>
                    <SelectItem value="OTHER">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.1"
                  value={profile.weight || ''}
                  onChange={(e) =>
                    setProfile({ ...profile, weight: parseFloat(e.target.value) || null })
                  }
                  placeholder="70"
                />
              </div>
              <div>
                <Label htmlFor="height">Height (cm)</Label>
                <Input
                  id="height"
                  type="number"
                  value={profile.height || ''}
                  onChange={(e) =>
                    setProfile({ ...profile, height: parseFloat(e.target.value) || null })
                  }
                  placeholder="175"
                />
              </div>
            </div>
          </Card>

          {/* Goals & Activity */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Goals & Activity</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="goal">Nutrition Goal</Label>
                <Select
                  value={profile.goal || 'MAINTAIN'}
                  onValueChange={(value) => setProfile({ ...profile, goal: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LOSE_WEIGHT">Lose Weight</SelectItem>
                    <SelectItem value="MAINTAIN">Maintain Weight</SelectItem>
                    <SelectItem value="GAIN_MUSCLE">Gain Muscle</SelectItem>
                    <SelectItem value="IMPROVE_HEALTH">Improve Health</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="activityLevel">Activity Level</Label>
                <Select
                  value={profile.activityLevel || 'MODERATE'}
                  onValueChange={(value) => setProfile({ ...profile, activityLevel: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SEDENTARY">Sedentary</SelectItem>
                    <SelectItem value="LIGHT">Light Activity</SelectItem>
                    <SelectItem value="MODERATE">Moderate Activity</SelectItem>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="VERY_ACTIVE">Very Active</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>

          {/* Daily Targets */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Daily Nutrition Targets</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="calories">Calories (kcal)</Label>
                <Input
                  id="calories"
                  type="number"
                  value={profile.dailyCalories}
                  onChange={(e) =>
                    setProfile({ ...profile, dailyCalories: parseInt(e.target.value) || 2000 })
                  }
                />
              </div>
              <div>
                <Label htmlFor="protein">Protein (g)</Label>
                <Input
                  id="protein"
                  type="number"
                  value={profile.dailyProtein}
                  onChange={(e) =>
                    setProfile({ ...profile, dailyProtein: parseFloat(e.target.value) || 60 })
                  }
                />
              </div>
              <div>
                <Label htmlFor="carbs">Carbohydrates (g)</Label>
                <Input
                  id="carbs"
                  type="number"
                  value={profile.dailyCarbs}
                  onChange={(e) =>
                    setProfile({ ...profile, dailyCarbs: parseFloat(e.target.value) || 225 })
                  }
                />
              </div>
              <div>
                <Label htmlFor="fat">Fat (g)</Label>
                <Input
                  id="fat"
                  type="number"
                  value={profile.dailyFat}
                  onChange={(e) =>
                    setProfile({ ...profile, dailyFat: parseFloat(e.target.value) || 77 })
                  }
                />
              </div>
            </div>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end space-x-4">
            <Button
              variant="outline"
              onClick={() => router.push('/nutrition-dashboard')}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-easymeals-green hover:bg-green-600"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Settings
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
