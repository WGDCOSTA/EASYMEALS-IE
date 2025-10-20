
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import Image from 'next/image'
import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="container mx-auto max-w-7xl px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">How It Works</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Getting started with EasyMeals.ie is simple. Follow these three easy steps to enjoy 
            delicious, healthy meals delivered to your door.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          {/* Step 1 */}
          <div className="text-center">
            <div className="bg-easymeals-green w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6">
              1
            </div>
            <div className="relative aspect-[16/10] mb-6 rounded-2xl overflow-hidden shadow-lg">
              <Image
                src="/images/how-it-works-choose.jpg"
                alt="Choose your meals"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">You Choose</h3>
            <ul className="text-left space-y-2">
              <li className="flex items-start">
                <Check className="w-5 h-5 text-easymeals-green mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-gray-600">Select your plan depending on who&apos;s at home</span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 text-easymeals-green mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-gray-600">Choose from Frozen or Fresh Chilled plans</span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 text-easymeals-green mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-gray-600">Over 20 new recipes each week</span>
              </li>
            </ul>
          </div>

          {/* Step 2 */}
          <div className="text-center">
            <div className="bg-easymeals-orange w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6">
              2
            </div>
            <div className="relative aspect-[16/10] mb-6 rounded-2xl overflow-hidden shadow-lg">
              <Image
                src="/images/how-it-works-deliver.jpg"
                alt="We deliver"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">We Deliver</h3>
            <ul className="text-left space-y-2">
              <li className="flex items-start">
                <Check className="w-5 h-5 text-easymeals-green mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-gray-600">Free delivery* to Ireland and Northern Ireland</span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 text-easymeals-green mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-gray-600">Insulated packaging keeps food fresh</span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 text-easymeals-green mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-gray-600">Flexible delivery slots</span>
              </li>
            </ul>
          </div>

          {/* Step 3 */}
          <div className="text-center">
            <div className="bg-easymeals-red w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6">
              3
            </div>
            <div className="relative aspect-[16/10] mb-6 rounded-2xl overflow-hidden shadow-lg">
              <Image
                src="/images/how-it-works-enjoy.jpg"
                alt="You enjoy"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">You Enjoy</h3>
            <ul className="text-left space-y-2">
              <li className="flex items-start">
                <Check className="w-5 h-5 text-easymeals-green mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-gray-600">Ready in 30 minutes or less</span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 text-easymeals-green mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-gray-600">Easy-to-follow recipe cards</span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 text-easymeals-green mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-gray-600">Fresh, delicious, and healthy</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="text-center">
          <Button asChild size="lg" className="bg-easymeals-green hover:bg-easymeals-green/90 text-white rounded-full font-semibold text-lg px-10">
            <Link href="/meals">Get Started Now</Link>
          </Button>
        </div>
      </div>

      <Footer />
    </div>
  )
}
