
'use client'

import { useState } from 'react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Gift } from 'lucide-react'

export default function RedeemGiftCardPage() {
  const [giftCode, setGiftCode] = useState('')

  const handleRedeem = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle gift card redemption logic here
    alert('Gift card redemption functionality will be implemented')
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="container mx-auto max-w-2xl px-4 py-16">
        <div className="text-center mb-12">
          <Gift className="w-20 h-20 text-easymeals-green mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Redeem Gift Card</h1>
          <p className="text-lg text-gray-600">
            Enter your gift card code below to add credit to your account
          </p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-3xl p-8 md:p-12">
          <form onSubmit={handleRedeem} className="space-y-6">
            <div>
              <label htmlFor="giftCode" className="block text-sm font-semibold text-gray-900 mb-2">
                Gift Card Code
              </label>
              <Input
                id="giftCode"
                type="text"
                value={giftCode}
                onChange={(e) => setGiftCode(e.target.value)}
                placeholder="Enter your gift card code"
                className="text-lg py-6 rounded-xl"
                required
              />
            </div>

            <Button 
              type="submit" 
              size="lg" 
              className="w-full bg-easymeals-green hover:bg-easymeals-green/90 text-white rounded-full font-semibold text-lg"
            >
              Redeem Gift Card
            </Button>
          </form>

          <div className="mt-8 pt-8 border-t border-gray-300">
            <h3 className="font-semibold text-gray-900 mb-3">Need Help?</h3>
            <p className="text-gray-600 text-sm mb-2">
              • Gift card codes are case-sensitive
            </p>
            <p className="text-gray-600 text-sm mb-2">
              • Make sure you&apos;re signed in to your account
            </p>
            <p className="text-gray-600 text-sm">
              • Contact us if you&apos;re having trouble redeeming your card
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
