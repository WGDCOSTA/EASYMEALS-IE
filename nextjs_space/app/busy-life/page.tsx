
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Check, Star, Clock, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'

export default function BusyLifePage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-orange-50 via-white to-red-50 py-20">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Content */}
            <div>
              <div className="inline-block mb-4">
                <span className="bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-sm font-semibold uppercase tracking-wide flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Ready in Minutes
                </span>
              </div>
              <h1 className="text-5xl lg:text-6xl font-extrabold text-gray-900 mb-6 leading-tight">
                Real Food for Busy Cork Lives
              </h1>
              <p className="text-xl text-gray-600 mb-6">
                No time to cook? No problem. From Douglas to Blackrock, we're helping busy Cork professionals eat well without the stress. Proper meals in 5 minutes.
              </p>
              
              {/* Key Features */}
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <Check className="w-6 h-6 text-easymeals-green mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Ready in 5 minutes - microwave or oven</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-6 h-6 text-easymeals-green mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Delivered to your Cork address weekly</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-6 h-6 text-easymeals-green mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">No meal planning, no shopping, no washing up</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-6 h-6 text-easymeals-green mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Better than takeaway - healthier and cheaper</span>
                </li>
              </ul>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="bg-easymeals-orange hover:bg-easymeals-orange/90 text-white rounded-full font-semibold text-lg px-10 shadow-xl">
                  <Link href="/meals?category=busy">
                    Browse Quick Meals <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-2 border-easymeals-orange text-easymeals-orange hover:bg-easymeals-orange hover:text-white rounded-full font-semibold text-lg px-10">
                  <Link href="/subscriptions">
                    Weekly Easy Box
                  </Link>
                </Button>
              </div>
            </div>

            {/* Right side - Image */}
            <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src="https://cdn.abacus.ai/images/9078dae7-9683-47ea-966a-578d8e1a4947.png"
                alt="Quick & Easy Meals"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Popular Quick Meals */}
      <section className="py-20 bg-white">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Most Popular Quick Meals
            </h2>
            <p className="text-xl text-gray-600">
              From freezer to table in 5 minutes
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Meal 1 */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow">
              <div className="relative aspect-video bg-muted">
                <Image
                  src="https://cdn.abacus.ai/images/9078dae7-9683-47ea-966a-578d8e1a4947.png"
                  alt="Lasagne"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute top-4 right-4 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                  <Zap className="w-3 h-3" />
                  5 mins
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Beef Lasagne</h3>
                <p className="text-gray-600 mb-4">Classic comfort food, ready when you are</p>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-3xl font-bold text-easymeals-orange">€7.50</span>
                  <span className="text-sm text-gray-500">per meal</span>
                </div>
                <Button asChild className="w-full bg-easymeals-green hover:bg-easymeals-green/90 text-white rounded-full">
                  <Link href="/meals?category=busy">
                    Order Now
                  </Link>
                </Button>
              </div>
            </div>

            {/* Meal 2 */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow">
              <div className="relative aspect-video bg-muted">
                <Image
                  src="https://cdn.abacus.ai/images/9078dae7-9683-47ea-966a-578d8e1a4947.png"
                  alt="Thai Green Curry"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                  Bestseller
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Thai Green Curry</h3>
                <p className="text-gray-600 mb-4">Restaurant-quality flavour at home</p>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-3xl font-bold text-easymeals-orange">€8.50</span>
                  <span className="text-sm text-gray-500">per meal</span>
                </div>
                <Button asChild className="w-full bg-easymeals-green hover:bg-easymeals-green/90 text-white rounded-full">
                  <Link href="/meals?category=busy">
                    Order Now
                  </Link>
                </Button>
              </div>
            </div>

            {/* Meal 3 */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow">
              <div className="relative aspect-video bg-muted">
                <Image
                  src="https://cdn.abacus.ai/images/9078dae7-9683-47ea-966a-578d8e1a4947.png"
                  alt="Chicken Tikka Masala"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Chicken Tikka Masala</h3>
                <p className="text-gray-600 mb-4">Creamy, spicy, and ready in minutes</p>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-3xl font-bold text-easymeals-orange">€8.00</span>
                  <span className="text-sm text-gray-500">per meal</span>
                </div>
                <Button asChild className="w-full bg-easymeals-green hover:bg-easymeals-green/90 text-white rounded-full">
                  <Link href="/meals?category=busy">
                    Order Now
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Time Savings Section */}
      <section className="py-20 bg-gradient-to-br from-orange-50 via-white to-red-50">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Get Your Time Back
            </h2>
            <p className="text-xl text-gray-600">
              Stop wasting hours on meal planning and cooking
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
              <div className="text-5xl font-bold text-easymeals-orange mb-2">5</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Hours Saved Per Week</h3>
              <p className="text-gray-600">
                No more shopping, chopping, or cleaning up
              </p>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
              <div className="text-5xl font-bold text-easymeals-orange mb-2">€50</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Save vs Takeaways</h3>
              <p className="text-gray-600">
                Better quality at a fraction of the cost
              </p>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
              <div className="text-5xl font-bold text-easymeals-orange mb-2">0</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Washing Up</h3>
              <p className="text-gray-600">
                Eat straight from the container - we won't judge!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-20 bg-white">
        <div className="container mx-auto max-w-4xl px-4 text-center">
          <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-3xl shadow-xl p-12">
            <div className="flex justify-center mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className="w-8 h-8 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <p className="text-2xl text-gray-700 mb-6 italic leading-relaxed">
              "Between work at the hospital and getting the kids to GAA training, I barely had time to breathe, never mind cook. EasyMeals has been a complete lifesaver for our family in Bishopstown!"
            </p>
            <p className="text-lg font-bold text-gray-900">- Dr. Siobhan O'Brien, Cork University Hospital</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-easymeals-orange text-white">
        <div className="container mx-auto max-w-4xl px-4 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Try Your First Week for €30
          </h2>
          <p className="text-xl mb-10 opacity-95">
            5 delicious meals delivered to your door. No commitment required.
          </p>
          <Button asChild size="lg" className="bg-white text-orange-600 hover:bg-gray-100 font-bold rounded-full shadow-lg text-lg px-10">
            <Link href="/subscriptions">Get Started Now</Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  )
}
