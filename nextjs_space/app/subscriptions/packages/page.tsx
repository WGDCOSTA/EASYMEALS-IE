
'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Check, Package, Star } from 'lucide-react'
import { toast } from 'react-hot-toast'
import Link from 'next/link'
import Image from 'next/image'

interface SubscriptionPackage {
  id: string
  name: string
  description: string
  frequency: string
  price: number
  discountPercentage: number | null
  imageUrl: string | null
  isFeatured: boolean
  mealsPerWeek: number | null
  servingsPerMeal: number | null
  customizable: boolean
  features: string[]
  packageItems: any[]
  _count?: {
    subscriptions: number
  }
}

export default function SubscriptionPackagesPage() {
  const { data: session } = useSession() || {}
  const router = useRouter()
  const [packages, setPackages] = useState<SubscriptionPackage[]>([])
  const [loading, setLoading] = useState(true)
  const [subscribing, setSubscribing] = useState<string | null>(null)

  useEffect(() => {
    loadPackages()
  }, [])

  const loadPackages = async () => {
    try {
      const response = await fetch('/api/subscriptions/packages')
      if (!response.ok) throw new Error('Failed to load packages')
      const data = await response.json()
      setPackages(data.packages)
    } catch (error) {
      console.error('Error loading packages:', error)
      toast.error('Failed to load packages')
    } finally {
      setLoading(false)
    }
  }

  const handleSubscribe = async (packageId: string) => {
    if (!session?.user) {
      toast.error('Please sign in to subscribe')
      router.push('/auth/signin?callbackUrl=/subscriptions/packages')
      return
    }

    setSubscribing(packageId)

    try {
      const response = await fetch('/api/subscriptions/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          packageId,
          deliveryAddress: (session.user as any).address || 'Dublin, Ireland'
        })
      })

      if (!response.ok) throw new Error('Failed to subscribe')

      toast.success('Subscription created successfully!')
      router.push('/subscriptions')
    } catch (error) {
      console.error('Error subscribing:', error)
      toast.error('Failed to create subscription')
    } finally {
      setSubscribing(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-easymeals-green"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Subscription Plans
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Save time and money with our convenient meal subscription plans. Get fresh, delicious meals delivered to your door regularly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {packages.map((pkg) => (
            <Card 
              key={pkg.id} 
              className={`relative hover:shadow-2xl transition-all duration-300 ${
                pkg.isFeatured ? 'border-2 border-easymeals-green shadow-xl scale-105' : ''
              }`}
            >
              {pkg.isFeatured && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-yellow-500 text-white px-4 py-1 flex items-center gap-1">
                    <Star className="h-3 w-3 fill-white" />
                    Most Popular
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pb-4">
                {pkg.imageUrl && (
                  <div className="mb-4 relative h-48 w-full rounded-lg overflow-hidden">
                    <Image
                      src={pkg.imageUrl}
                      alt={pkg.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <CardTitle className="text-2xl flex items-center justify-center gap-2">
                  <Package className="h-6 w-6 text-easymeals-green" />
                  {pkg.name}
                </CardTitle>
                <CardDescription className="text-base mt-2">
                  {pkg.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="text-center">
                  <div className="flex items-baseline justify-center gap-2">
                    <span className="text-4xl font-bold text-easymeals-green">
                      €{pkg.price.toFixed(2)}
                    </span>
                    <span className="text-gray-600">
                      / {pkg.frequency === 'WEEKLY' ? 'week' : 'fortnight'}
                    </span>
                  </div>
                  {pkg.discountPercentage && (
                    <Badge variant="outline" className="mt-2 bg-green-50">
                      Save {pkg.discountPercentage}%
                    </Badge>
                  )}
                </div>

                <div className="space-y-3">
                  {pkg.mealsPerWeek && (
                    <div className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-easymeals-green" />
                      <span>{pkg.mealsPerWeek} meals per delivery</span>
                    </div>
                  )}
                  {pkg.servingsPerMeal && (
                    <div className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-easymeals-green" />
                      <span>{pkg.servingsPerMeal} servings per meal</span>
                    </div>
                  )}
                  {pkg.customizable && (
                    <div className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-easymeals-green" />
                      <span>Fully customizable</span>
                    </div>
                  )}
                  {pkg.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-easymeals-green" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                {pkg._count && pkg._count.subscriptions > 10 && (
                  <div className="text-center">
                    <Badge variant="secondary">
                      {pkg._count.subscriptions}+ active subscribers
                    </Badge>
                  </div>
                )}
              </CardContent>

              <CardFooter>
                <Button
                  onClick={() => handleSubscribe(pkg.id)}
                  disabled={subscribing === pkg.id}
                  className="w-full"
                  variant={pkg.isFeatured ? 'default' : 'outline'}
                >
                  {subscribing === pkg.id ? 'Subscribing...' : 'Subscribe Now'}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {packages.length === 0 && (
          <div className="text-center py-12">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No subscription packages available
            </h3>
            <p className="text-gray-500">
              Check back soon for our meal subscription plans
            </p>
          </div>
        )}

        <div className="mt-12 text-center">
          <Link href="/subscriptions">
            <Button variant="outline">
              View My Subscriptions
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
