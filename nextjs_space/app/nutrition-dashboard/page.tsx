
'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { CalorieTracker } from '@/components/calorie-tracker'
import { MealPlannerCard } from '@/components/meal-planner-card'
import { NutritionGoalsCard } from '@/components/nutrition-goals-card'
import { AiMealSuggestions } from '@/components/ai-meal-suggestions'
import { WeeklyProgressChart } from '@/components/weekly-progress-chart'
import { OrderDeliveredBanner } from '@/components/order-delivered-banner'
import { PurchaseHistoryAnalysis } from '@/components/purchase-history-analysis'
import { SubscriptionMealPlanner } from '@/components/subscription-meal-planner'
import { GuestNutritionDashboard } from '@/components/guest-nutrition-dashboard'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Settings, TrendingUp, Calendar, Sparkles, History, Zap } from 'lucide-react'
import { toast } from 'sonner'

export default function NutritionDashboard() {
  const { data: session, status } = useSession() || {}
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<any>(null)
  const [activeTab, setActiveTab] = useState(searchParams?.get('tab') || 'today')

  useEffect(() => {
    // Allow guests to view dashboard (with limited features)
    if (status === 'authenticated') {
      fetchProfile()
    } else if (status === 'unauthenticated') {
      setLoading(false)
    }
  }, [status])

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/nutrition/profile')
      if (response.ok) {
        const data = await response.json()
        setProfile(data)
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleProfileUpdate = (newProfile: any) => {
    setProfile(newProfile)
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-easymeals-green"></div>
      </div>
    )
  }

  // Show guest dashboard for non-authenticated users
  if (!session?.user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
        <div className="bg-white border-b">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                  <Sparkles className="w-8 h-8 mr-3 text-easymeals-green" />
                  Nutrition Dashboard
                </h1>
                <p className="text-gray-600 mt-1">
                  Track your nutrition goals with AI-powered insights
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <GuestNutritionDashboard />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <Sparkles className="w-8 h-8 mr-3 text-easymeals-green" />
                Nutrition Dashboard
              </h1>
              <p className="text-gray-600 mt-1">
                Track your nutrition goals with AI-powered insights
              </p>
            </div>
            <Button
              onClick={() => router.push('/nutrition-dashboard/settings')}
              variant="outline"
              className="flex items-center space-x-2"
            >
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Delivered Order Banner */}
        <div className="mb-6">
          <OrderDeliveredBanner />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 max-w-3xl mx-auto">
            <TabsTrigger value="today" className="flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>Today</span>
            </TabsTrigger>
            <TabsTrigger value="planner" className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4" />
              <span>Planner</span>
            </TabsTrigger>
            <TabsTrigger value="progress" className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4" />
              <span>Progress</span>
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center space-x-2">
              <History className="w-4 h-4" />
              <span>History</span>
            </TabsTrigger>
            <TabsTrigger value="subscription" className="flex items-center space-x-2">
              <Zap className="w-4 h-4" />
              <span>Auto-Plan</span>
            </TabsTrigger>
          </TabsList>

          {/* Today Tab */}
          <TabsContent value="today" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Calorie Tracker */}
              <div className="lg:col-span-1">
                <CalorieTracker />
              </div>

              {/* Middle Column - Meal Planner */}
              <div className="lg:col-span-1">
                <MealPlannerCard />
              </div>

              {/* Right Column - Goals & AI */}
              <div className="lg:col-span-1 space-y-6">
                <NutritionGoalsCard 
                  profile={profile} 
                  onUpdate={handleProfileUpdate}
                />
                
                {profile?.useAiSuggestions && (
                  <AiMealSuggestions profile={profile} />
                )}
              </div>
            </div>
          </TabsContent>

          {/* Planner Tab */}
          <TabsContent value="planner" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <MealPlannerCard expanded />
              <AiMealSuggestions profile={profile} fullView />
            </div>
          </TabsContent>

          {/* Progress Tab */}
          <TabsContent value="progress" className="space-y-6">
            <WeeklyProgressChart />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-700">This Week</h3>
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900">1,847</div>
                <div className="text-sm text-gray-600 mt-1">Avg. Calories/Day</div>
                <div className="mt-4 text-xs text-green-600">
                  ↑ 3% from last week
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-700">Protein Goal</h3>
                  <TrendingUp className="w-5 h-5 text-yellow-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900">82%</div>
                <div className="text-sm text-gray-600 mt-1">Avg. Achievement</div>
                <div className="mt-4 text-xs text-yellow-600">
                  ↑ 5% from last week
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-700">Meal Streak</h3>
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900">7 Days</div>
                <div className="text-sm text-gray-600 mt-1">Current Streak</div>
                <div className="mt-4 text-xs text-blue-600">
                  🔥 Keep it up!
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="space-y-6">
            <PurchaseHistoryAnalysis />
          </TabsContent>

          {/* Subscription Tab */}
          <TabsContent value="subscription" className="space-y-6">
            <SubscriptionMealPlanner />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
