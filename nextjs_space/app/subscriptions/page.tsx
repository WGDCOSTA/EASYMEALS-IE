
'use client'

import { useState } from 'react'
import { Calendar, Check, Crown, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function SubscriptionsPage() {
  const { data: session } = useSession() || {}
  const router = useRouter()
  const [selectedPlan, setSelectedPlan] = useState<string>('weekly')

  const plans = [
    {
      id: 'weekly',
      name: 'Weekly Delivery',
      frequency: 'Every week',
      discount: '10%',
      description: 'Perfect for busy professionals who need consistent meal solutions',
      price: '€45/week',
      originalPrice: '€50/week',
      features: [
        '4-5 meals per delivery',
        '10% off all meals',
        'Priority delivery slots',
        'Skip weeks anytime',
        'Free delivery (€4.99 value)'
      ],
      popular: false
    },
    {
      id: 'fortnightly',
      name: 'Fortnightly Delivery',
      frequency: 'Every 2 weeks',
      discount: '15%',
      description: 'Ideal for smaller households or occasional meal planning',
      price: '€85/fortnight',
      originalPrice: '€100/fortnight',
      features: [
        '8-10 meals per delivery',
        '15% off all meals',
        'Priority delivery slots',
        'Skip deliveries anytime',
        'Free delivery (€4.99 value)',
        'Meal customization'
      ],
      popular: true
    }
  ]

  const handleSubscribe = () => {
    if (!session?.user) {
      router.push('/auth/signin')
      return
    }
    // In a real app, this would create a subscription
    alert('Subscription feature coming soon! For now, you can order individual meals.')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto max-w-6xl px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Meal Subscription Plans
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Save time and money with our recurring meal delivery subscriptions. 
            Fresh and frozen meals delivered right to your door in Cork.
          </p>
        </div>

        {/* Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-white rounded-lg p-6 text-center shadow-sm">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Exclusive Discounts</h3>
            <p className="text-gray-600 text-sm">
              Save up to 15% on every order with subscription pricing
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 text-center shadow-sm">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Flexible Scheduling</h3>
            <p className="text-gray-600 text-sm">
              Skip weeks, pause, or cancel anytime with no penalty
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 text-center shadow-sm">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Crown className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Priority Access</h3>
            <p className="text-gray-600 text-sm">
              Get first pick of delivery slots and new menu items
            </p>
          </div>
        </div>

        {/* Subscription Plans */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`bg-white rounded-2xl p-8 shadow-sm border-2 transition-all ${
                selectedPlan === plan.id
                  ? 'border-orange-500 shadow-lg'
                  : 'border-gray-100 hover:border-gray-200'
              } ${plan.popular ? 'relative' : ''}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-orange-500 text-white px-4 py-1">
                    Most Popular
                  </Badge>
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <p className="text-gray-600 mb-4">{plan.description}</p>
                
                <div className="mb-4">
                  <span className="text-3xl font-bold text-orange-600">{plan.price}</span>
                  <span className="text-gray-500 line-through ml-2">{plan.originalPrice}</span>
                </div>
                
                <Badge variant="outline" className="text-green-600 border-green-200">
                  Save {plan.discount}
                </Badge>
              </div>

              <div className="space-y-3 mb-8">
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-green-600" />
                    </div>
                    <span className="text-gray-700 text-sm">{feature}</span>
                  </div>
                ))}
              </div>

              <Button
                onClick={() => setSelectedPlan(plan.id)}
                variant={selectedPlan === plan.id ? "default" : "outline"}
                className={`w-full mb-3 ${
                  selectedPlan === plan.id
                    ? 'bg-orange-500 hover:bg-orange-600'
                    : ''
                }`}
              >
                {selectedPlan === plan.id ? 'Selected' : 'Select Plan'}
              </Button>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Button
            onClick={handleSubscribe}
            size="lg"
            className="bg-orange-500 hover:bg-orange-600 px-12"
          >
            Start Your Subscription
          </Button>
          
          <p className="text-sm text-gray-500 mt-4">
            No commitment • Cancel anytime • Cork delivery area
          </p>

          <div className="mt-8">
            <p className="text-gray-600 mb-4">Want to try individual meals first?</p>
            <Button asChild variant="outline">
              <Link href="/meals">
                Browse Individual Meals
              </Link>
            </Button>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}
