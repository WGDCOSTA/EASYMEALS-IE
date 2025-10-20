
'use client'

import { useState } from 'react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Gift, Heart, Calendar } from 'lucide-react'

export default function GiftCardsPage() {
  const giftAmounts = [25, 50, 75, 100, 150, 200]
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null)

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="container mx-auto max-w-6xl px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Gift Cards</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Give the gift of delicious, healthy meals. Perfect for any occasion!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="text-center p-8 bg-gradient-to-br from-orange-50 to-orange-100 rounded-3xl">
            <Gift className="w-16 h-16 text-easymeals-orange mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Perfect Gift</h3>
            <p className="text-gray-600">
              Ideal for birthdays, holidays, or just because. Everyone loves good food!
            </p>
          </div>
          <div className="text-center p-8 bg-gradient-to-br from-green-50 to-green-100 rounded-3xl">
            <Heart className="w-16 h-16 text-easymeals-green mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Show You Care</h3>
            <p className="text-gray-600">
              Support loved ones with the gift of convenient, healthy meals
            </p>
          </div>
          <div className="text-center p-8 bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl">
            <Calendar className="w-16 h-16 text-blue-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No Expiry</h3>
            <p className="text-gray-600">
              Our gift cards never expire, so they can use them whenever they like
            </p>
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Choose an Amount</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {giftAmounts.map((amount) => (
              <button
                key={amount}
                onClick={() => setSelectedAmount(amount)}
                className={`bg-white border-2 ${
                  selectedAmount === amount 
                    ? 'border-easymeals-green bg-green-50' 
                    : 'border-gray-200'
                } hover:border-easymeals-green rounded-2xl p-6 text-center transition-all hover:shadow-lg`}
              >
                <span className="text-3xl font-bold text-gray-900">€{amount}</span>
              </button>
            ))}
          </div>
          {selectedAmount && (
            <div className="mt-8 text-center">
              <p className="text-lg text-gray-600 mb-4">
                Selected amount: <span className="font-bold text-easymeals-green">€{selectedAmount}</span>
              </p>
            </div>
          )}
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-3xl p-12 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            <div className="text-center">
              <div className="bg-easymeals-green w-12 h-12 rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Choose Amount</h3>
              <p className="text-gray-600">Select the gift card value that works for you</p>
            </div>
            <div className="text-center">
              <div className="bg-easymeals-orange w-12 h-12 rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Personalize</h3>
              <p className="text-gray-600">Add a personal message for the recipient</p>
            </div>
            <div className="text-center">
              <div className="bg-easymeals-red w-12 h-12 rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Send or Print</h3>
              <p className="text-gray-600">Email it instantly or print a physical card</p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <Button asChild size="lg" className="bg-easymeals-green hover:bg-easymeals-green/90 text-white rounded-full font-semibold text-lg px-10">
            <Link href="/contact">Purchase Gift Card</Link>
          </Button>
          <p className="text-gray-500 mt-4">
            <Link href="/gift-cards/redeem" className="text-easymeals-green hover:underline">
              Already have a gift card? Redeem it here →
            </Link>
          </p>
        </div>
      </div>

      <Footer />
    </div>
  )
}
