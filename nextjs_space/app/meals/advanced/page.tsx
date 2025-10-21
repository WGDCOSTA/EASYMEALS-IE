
'use client'

import { useState } from 'react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { CalorieTracker } from '@/components/calorie-tracker'
import { MealPlannerCard } from '@/components/meal-planner-card'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { TrendingUp, Target, Calendar, Award, BarChart3 } from 'lucide-react'
import Link from 'next/link'

export default function AdvancedModePage() {
  const [view, setView] = useState<'tracker' | 'planner' | 'analytics'>('tracker')

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto max-w-7xl px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Nutrition Dashboard</h1>
              <p className="text-gray-600 mt-2">Track your meals, plan your diet, and achieve your goals</p>
            </div>
            <Link href="/meals">
              <Button variant="outline">
                Back to Meals
              </Button>
            </Link>
          </div>

          {/* View Tabs */}
          <div className="flex space-x-2 bg-white p-1 rounded-lg border">
            <Button
              variant={view === 'tracker' ? 'default' : 'ghost'}
              className={view === 'tracker' ? 'bg-easymeals-green hover:bg-green-600' : ''}
              onClick={() => setView('tracker')}
            >
              <Target className="w-4 h-4 mr-2" />
              Tracker
            </Button>
            <Button
              variant={view === 'planner' ? 'default' : 'ghost'}
              className={view === 'planner' ? 'bg-easymeals-green hover:bg-green-600' : ''}
              onClick={() => setView('planner')}
            >
              <Calendar className="w-4 h-4 mr-2" />
              Meal Planner
            </Button>
            <Button
              variant={view === 'analytics' ? 'default' : 'ghost'}
              className={view === 'analytics' ? 'bg-easymeals-green hover:bg-green-600' : ''}
              onClick={() => setView('analytics')}
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Analytics
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-6">
            {view === 'tracker' && (
              <>
                <CalorieTracker />
                
                <Card className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Add Meals</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <Link href="/meals?category=HEALTHY">
                      <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                            <TrendingUp className="w-6 h-6 text-green-600" />
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">Healthy Meals</div>
                            <div className="text-xs text-gray-500">Low calorie options</div>
                          </div>
                        </div>
                      </Card>
                    </Link>
                    
                    <Link href="/meals?category=VEGETARIAN">
                      <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                            <Award className="w-6 h-6 text-orange-600" />
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">Vegetarian</div>
                            <div className="text-xs text-gray-500">Plant-based meals</div>
                          </div>
                        </div>
                      </Card>
                    </Link>
                  </div>
                </Card>
              </>
            )}

            {view === 'planner' && (
              <>
                <MealPlannerCard />
                
                <Card className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Meal Suggestions</h3>
                  <p className="text-gray-600">
                    Based on your nutrition goals, we recommend these meals for today.
                  </p>
                  <div className="mt-4">
                    <Link href="/meals">
                      <Button className="bg-easymeals-green hover:bg-green-600">
                        Browse All Meals
                      </Button>
                    </Link>
                  </div>
                </Card>
              </>
            )}

            {view === 'analytics' && (
              <Card className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Weekly Progress</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">Average Daily Calories</span>
                      <span className="font-semibold">1,850 / 2,000</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500" style={{ width: '92.5%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">Protein Goal Achievement</span>
                      <span className="font-semibold">78%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-yellow-500" style={{ width: '78%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">Balanced Meals</span>
                      <span className="font-semibold">5 / 7 days</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500" style={{ width: '71%' }}></div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-green-50 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <Award className="w-6 h-6 text-green-600 flex-shrink-0" />
                    <div>
                      <div className="font-semibold text-green-900">Great Progress!</div>
                      <div className="text-sm text-green-700 mt-1">
                        You're maintaining a healthy diet this week. Keep up the good work!
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="font-bold text-gray-900 mb-4">Today's Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Meals Logged</span>
                  <span className="font-semibold">0 / 3</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Water Intake</span>
                  <span className="font-semibold">0 / 8 glasses</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Active Minutes</span>
                  <span className="font-semibold">0 / 30 min</span>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-purple-500 to-purple-600 text-white">
              <h3 className="font-bold mb-2">Premium Features</h3>
              <p className="text-sm opacity-90 mb-4">
                Get personalized meal plans, advanced analytics, and priority support.
              </p>
              <Link href="/subscriptions">
                <Button variant="secondary" size="sm" className="w-full">
                  Upgrade Now
                </Button>
              </Link>
            </Card>

            <Card className="p-6">
              <h3 className="font-bold text-gray-900 mb-3">Quick Tips</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Plan your meals ahead for better nutrition</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Track your water intake throughout the day</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Aim for balanced macronutrients</span>
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
