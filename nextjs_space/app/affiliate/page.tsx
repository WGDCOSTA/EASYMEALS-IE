
'use client'

import { useState } from 'react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Check, TrendingUp, Users, Euro, Gift } from 'lucide-react'
import { toast } from 'react-hot-toast'

export default function AffiliatePage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: ''
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('/api/affiliates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to submit application')
      }

      setSuccess(true)
      toast.success('Application submitted successfully!')
      setFormData({ name: '', email: '', phone: '', company: '' })
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to submit application'
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-orange-50">
      <Header />

      {/* Hero Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-easymeals-green/10 to-easymeals-orange/10"></div>
        <div className="container mx-auto max-w-7xl px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl lg:text-6xl font-extrabold text-gray-900 mb-6">
              Join the EasyMeals Affiliate Program
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Earn up to 20% commission by referring customers to Cork's favorite meal delivery service
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-easymeals-orange hover:bg-easymeals-orange/90 text-white rounded-full font-semibold text-lg px-10"
                onClick={() => document.getElementById('signup-form')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Become a Partner
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-easymeals-orange text-easymeals-orange hover:bg-easymeals-orange hover:text-white rounded-full font-semibold text-lg px-10"
                onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
              >
                How It Works
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto max-w-7xl px-4">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
            Why Partner with EasyMeals?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="border-2 border-easymeals-green/20 hover:border-easymeals-green transition-all">
              <CardContent className="pt-8 text-center">
                <div className="w-16 h-16 bg-easymeals-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-easymeals-green" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">20% Commission</h3>
                <p className="text-gray-600">
                  Earn generous commissions on every sale you refer
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-easymeals-orange/20 hover:border-easymeals-orange transition-all">
              <CardContent className="pt-8 text-center">
                <div className="w-16 h-16 bg-easymeals-orange/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-easymeals-orange" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Growing Market</h3>
                <p className="text-gray-600">
                  Cork's meal delivery market is expanding rapidly
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-easymeals-green/20 hover:border-easymeals-green transition-all">
              <CardContent className="pt-8 text-center">
                <div className="w-16 h-16 bg-easymeals-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Euro className="w-8 h-8 text-easymeals-green" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Fast Payouts</h3>
                <p className="text-gray-600">
                  Get paid monthly via PayPal or bank transfer
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-easymeals-orange/20 hover:border-easymeals-orange transition-all">
              <CardContent className="pt-8 text-center">
                <div className="w-16 h-16 bg-easymeals-orange/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Gift className="w-8 h-8 text-easymeals-orange" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Marketing Support</h3>
                <p className="text-gray-600">
                  Access to banners, links, and promotional materials
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-gradient-to-br from-green-50 to-orange-50">
        <div className="container mx-auto max-w-7xl px-4">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
            How the Program Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
              <div className="w-16 h-16 bg-easymeals-green text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Sign Up</h3>
              <p className="text-gray-600">
                Fill out the form below and we'll review your application within 24 hours
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
              <div className="w-16 h-16 bg-easymeals-orange text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Get Your Link</h3>
              <p className="text-gray-600">
                Receive your unique referral code and marketing materials
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
              <div className="w-16 h-16 bg-easymeals-green text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Earn Money</h3>
              <p className="text-gray-600">
                Share your link and earn 20% on every sale you refer
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Ideal Partners Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto max-w-7xl px-4">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
            Who Should Join?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="flex items-start gap-4">
              <Check className="w-6 h-6 text-easymeals-green flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-lg text-gray-900 mb-2">Food Bloggers & Influencers</h3>
                <p className="text-gray-600">Share EasyMeals with your Cork-based followers</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Check className="w-6 h-6 text-easymeals-green flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-lg text-gray-900 mb-2">Fitness Coaches & Nutritionists</h3>
                <p className="text-gray-600">Recommend healthy meal options to your clients</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Check className="w-6 h-6 text-easymeals-green flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-lg text-gray-900 mb-2">Local Businesses</h3>
                <p className="text-gray-600">Offer meal solutions to your employees or customers</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Check className="w-6 h-6 text-easymeals-green flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-lg text-gray-900 mb-2">Website Owners</h3>
                <p className="text-gray-600">Monetize your Cork-focused website or blog</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Check className="w-6 h-6 text-easymeals-green flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-lg text-gray-900 mb-2">Student Groups</h3>
                <p className="text-gray-600">Help fellow UCC/MTU students discover easy meals</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Check className="w-6 h-6 text-easymeals-green flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-lg text-gray-900 mb-2">Community Groups</h3>
                <p className="text-gray-600">Support local Cork families with convenient meal options</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sign Up Form */}
      <section id="signup-form" className="py-20 bg-gradient-to-br from-orange-50 to-green-50">
        <div className="container mx-auto max-w-2xl px-4">
          {!success ? (
            <Card className="shadow-2xl border-2 border-easymeals-orange/20">
              <CardContent className="pt-8">
                <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
                  Become an Affiliate Partner
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="John Murphy"
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="john@example.com"
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+353 87 123 4567"
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="company">Company/Website (Optional)</Label>
                    <Input
                      id="company"
                      type="text"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      placeholder="My Cork Blog"
                      className="mt-2"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-easymeals-orange hover:bg-easymeals-orange/90 text-white font-bold py-6 rounded-full text-lg"
                  >
                    {loading ? 'Submitting...' : 'Apply Now'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          ) : (
            <Card className="shadow-2xl border-2 border-green-500">
              <CardContent className="pt-8 text-center py-12">
                <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Check className="w-12 h-12 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Application Submitted!
                </h2>
                <p className="text-lg text-gray-600 mb-8">
                  Thank you for your interest in the EasyMeals Affiliate Program. We'll review your application and get back to you within 24 hours.
                </p>
                <Button
                  onClick={() => setSuccess(false)}
                  className="bg-easymeals-green hover:bg-easymeals-green/90 text-white font-bold rounded-full"
                >
                  Submit Another Application
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}
