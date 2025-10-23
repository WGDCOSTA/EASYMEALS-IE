
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Check, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { getPageContent } from '@/lib/page-content'

export default async function CombosMealsPage() {
  const pageContent = await getPageContent('combos-meals')
  
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-orange-50 via-white to-orange-50 py-20">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Content */}
            <div>
              <div className="inline-block mb-4">
                <span className="bg-easymeals-orange/10 text-easymeals-orange px-4 py-2 rounded-full text-sm font-semibold uppercase tracking-wide">
                  Cork's Favourite
                </span>
              </div>
              <h1 className="text-5xl lg:text-6xl font-extrabold text-gray-900 mb-6 leading-tight">
                {pageContent.title || 'Combo Meals for Cork Families'}
              </h1>
              <p className="text-xl text-gray-600 mb-6">
                {pageContent.description || 'Perfect portion sizes for the whole family. Mix and match your favourites and save big on every order. Delivered fresh across Cork city and county.'}
              </p>
              
              {/* Key Features */}
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <Check className="w-6 h-6 text-easymeals-green mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Save €5-€10 on family combo deals</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-6 h-6 text-easymeals-green mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">4-6 meal portions per combo</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-6 h-6 text-easymeals-green mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Free delivery in Cork on orders over €30</span>
                </li>
              </ul>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="bg-easymeals-orange hover:bg-easymeals-orange/90 text-white rounded-full font-semibold text-lg px-10 shadow-xl">
                  <Link href="/meals?category=combos">
                    Browse Combos <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-2 border-easymeals-orange text-easymeals-orange hover:bg-easymeals-orange hover:text-white rounded-full font-semibold text-lg px-10">
                  <Link href="/subscriptions">
                    Subscribe & Save More
                  </Link>
                </Button>
              </div>
            </div>

            {/* Right side - Image */}
            <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src={pageContent.imageUrl || 'https://cdn.abacus.ai/images/2642f787-d06a-4823-b9bf-10d7af831d03.png'}
                alt="Family Combo Meals"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Popular Combos */}
      <section className="py-20 bg-white">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Popular Combo Deals This Week
            </h2>
            <p className="text-xl text-gray-600">
              Hand-picked favourites that Cork families love
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Combo 1 */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow">
              <div className="relative aspect-video bg-muted">
                <Image
                  src="https://cdn.abacus.ai/images/2642f787-d06a-4823-b9bf-10d7af831d03.png"
                  alt="Family Dinner Combo"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute top-4 right-4 bg-easymeals-red text-white px-3 py-1 rounded-full text-sm font-bold">
                  Save €8
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Family Dinner Combo</h3>
                <p className="text-gray-600 mb-4">4 generous portions - Perfect for a family of 4</p>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-3xl font-bold text-easymeals-orange">€32</span>
                  <span className="text-lg text-gray-500 line-through">€40</span>
                </div>
                <Button asChild className="w-full bg-easymeals-green hover:bg-easymeals-green/90 text-white rounded-full">
                  <Link href="/meals?category=combos">
                    Order Now
                  </Link>
                </Button>
              </div>
            </div>

            {/* Combo 2 */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow">
              <div className="relative aspect-video bg-muted">
                <Image
                  src="https://cdn.abacus.ai/images/2642f787-d06a-4823-b9bf-10d7af831d03.png"
                  alt="Weekend Special Combo"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute top-4 right-4 bg-easymeals-red text-white px-3 py-1 rounded-full text-sm font-bold">
                  Save €10
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Weekend Special</h3>
                <p className="text-gray-600 mb-4">6 meals - Feed the whole family all weekend</p>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-3xl font-bold text-easymeals-orange">€45</span>
                  <span className="text-lg text-gray-500 line-through">€55</span>
                </div>
                <Button asChild className="w-full bg-easymeals-green hover:bg-easymeals-green/90 text-white rounded-full">
                  <Link href="/meals?category=combos">
                    Order Now
                  </Link>
                </Button>
              </div>
            </div>

            {/* Combo 3 */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow">
              <div className="relative aspect-video bg-muted">
                <Image
                  src="https://cdn.abacus.ai/images/2642f787-d06a-4823-b9bf-10d7af831d03.png"
                  alt="Meal Prep Combo"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute top-4 right-4 bg-easymeals-red text-white px-3 py-1 rounded-full text-sm font-bold">
                  Best Value
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Weekly Meal Prep</h3>
                <p className="text-gray-600 mb-4">5 different meals - Monday to Friday sorted</p>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-3xl font-bold text-easymeals-orange">€38</span>
                  <span className="text-lg text-gray-500 line-through">€45</span>
                </div>
                <Button asChild className="w-full bg-easymeals-green hover:bg-easymeals-green/90 text-white rounded-full">
                  <Link href="/meals?category=combos">
                    Order Now
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-20 bg-gradient-to-br from-green-50 via-white to-green-50">
        <div className="container mx-auto max-w-4xl px-4 text-center">
          <div className="bg-white rounded-3xl shadow-xl p-12">
            <div className="flex justify-center mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className="w-8 h-8 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <p className="text-2xl text-gray-700 mb-6 italic leading-relaxed">
              "The combo deals are brilliant! We're a family of 5 in Douglas and the weekend special keeps us fed without breaking the bank. Quality is always top-notch."
            </p>
            <p className="text-lg font-bold text-gray-900">- Mary O'Sullivan, Douglas, Cork</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-easymeals-orange text-white">
        <div className="container mx-auto max-w-4xl px-4 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Subscribe to Combos & Save Even More
          </h2>
          <p className="text-xl mb-10 opacity-95">
            Get 15% off every combo order with a weekly subscription. Cancel anytime.
          </p>
          <Button asChild size="lg" className="bg-white text-orange-600 hover:bg-gray-100 font-bold rounded-full shadow-lg text-lg px-10">
            <Link href="/subscriptions">Start Subscription</Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  )
}
