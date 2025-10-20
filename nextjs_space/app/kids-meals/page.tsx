
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Check, Star, Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'

export default function KidsMealsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-yellow-50 via-white to-orange-50 py-20">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Content */}
            <div>
              <div className="inline-block mb-4">
                <span className="bg-yellow-100 text-orange-600 px-4 py-2 rounded-full text-sm font-semibold uppercase tracking-wide flex items-center gap-2">
                  <Heart className="w-4 h-4" />
                  Kids Approved
                </span>
              </div>
              <h1 className="text-5xl lg:text-6xl font-extrabold text-gray-900 mb-6 leading-tight">
                Healthy Meals Cork Kids Actually Love
              </h1>
              <p className="text-xl text-gray-600 mb-6">
                No more dinner battles! Nutritious, colourful meals designed for fussy eaters. Created with Cork parents in mind.
              </p>
              
              {/* Key Features */}
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <Check className="w-6 h-6 text-easymeals-green mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Hidden veggies - they'll never know!</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-6 h-6 text-easymeals-green mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Perfect portions for ages 4-12</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-6 h-6 text-easymeals-green mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">No artificial colours or preservatives</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-6 h-6 text-easymeals-green mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Ready in under 10 minutes</span>
                </li>
              </ul>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="bg-easymeals-orange hover:bg-easymeals-orange/90 text-white rounded-full font-semibold text-lg px-10 shadow-xl">
                  <Link href="/meals?category=kids">
                    Browse Kids Meals <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-2 border-easymeals-orange text-easymeals-orange hover:bg-easymeals-orange hover:text-white rounded-full font-semibold text-lg px-10">
                  <Link href="/subscriptions">
                    Weekly Kids Box
                  </Link>
                </Button>
              </div>
            </div>

            {/* Right side - Image */}
            <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src="https://cdn.abacus.ai/images/9e2619ef-f7e2-4b53-8440-ab5af003d0f9.png"
                alt="Healthy Kids Meals"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Popular Kids Meals */}
      <section className="py-20 bg-white">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Most Popular with Cork Kids
            </h2>
            <p className="text-xl text-gray-600">
              Tested and approved by real families across Cork
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Meal 1 */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow">
              <div className="relative aspect-video bg-muted">
                <Image
                  src="https://cdn.abacus.ai/images/9e2619ef-f7e2-4b53-8440-ab5af003d0f9.png"
                  alt="Mini Chicken Nuggets"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute top-4 right-4 bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-sm font-bold">
                  ⭐ Top Pick
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Mini Chicken Bites</h3>
                <p className="text-gray-600 mb-4">Crispy on the outside, tender inside. With hidden veg!</p>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-3xl font-bold text-easymeals-orange">€6.50</span>
                  <span className="text-sm text-gray-500">per meal</span>
                </div>
                <Button asChild className="w-full bg-easymeals-green hover:bg-easymeals-green/90 text-white rounded-full">
                  <Link href="/meals?category=kids">
                    Add to Cart
                  </Link>
                </Button>
              </div>
            </div>

            {/* Meal 2 */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow">
              <div className="relative aspect-video bg-muted">
                <Image
                  src="https://cdn.abacus.ai/images/9e2619ef-f7e2-4b53-8440-ab5af003d0f9.png"
                  alt="Spaghetti Bolognese"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Spaghetti Bolognese</h3>
                <p className="text-gray-600 mb-4">Classic favourite with a veggie-packed sauce</p>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-3xl font-bold text-easymeals-orange">€7.00</span>
                  <span className="text-sm text-gray-500">per meal</span>
                </div>
                <Button asChild className="w-full bg-easymeals-green hover:bg-easymeals-green/90 text-white rounded-full">
                  <Link href="/meals?category=kids">
                    Add to Cart
                  </Link>
                </Button>
              </div>
            </div>

            {/* Meal 3 */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow">
              <div className="relative aspect-video bg-muted">
                <Image
                  src="https://cdn.abacus.ai/images/9e2619ef-f7e2-4b53-8440-ab5af003d0f9.png"
                  alt="Fish Fingers & Mash"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Fish Fingers & Mash</h3>
                <p className="text-gray-600 mb-4">Real cod fillet with creamy mashed potato</p>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-3xl font-bold text-easymeals-orange">€7.50</span>
                  <span className="text-sm text-gray-500">per meal</span>
                </div>
                <Button asChild className="w-full bg-easymeals-green hover:bg-easymeals-green/90 text-white rounded-full">
                  <Link href="/meals?category=kids">
                    Add to Cart
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Parent Testimonial */}
      <section className="py-20 bg-gradient-to-br from-yellow-50 via-white to-orange-50">
        <div className="container mx-auto max-w-4xl px-4 text-center">
          <div className="bg-white rounded-3xl shadow-xl p-12">
            <div className="flex justify-center mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className="w-8 h-8 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <p className="text-2xl text-gray-700 mb-6 italic leading-relaxed">
              "My two boys in Ballincollig are the fussiest eaters you'll meet. These meals? They devour them! Finally, a dinner without tears. Thank you EasyMeals!"
            </p>
            <p className="text-lg font-bold text-gray-900">- Laura Fitzgerald, Ballincollig</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-easymeals-orange text-white">
        <div className="container mx-auto max-w-4xl px-4 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Try the Kids Weekly Box
          </h2>
          <p className="text-xl mb-10 opacity-95">
            5 different kid-friendly meals delivered every week. First box just €25!
          </p>
          <Button asChild size="lg" className="bg-white text-orange-600 hover:bg-gray-100 font-bold rounded-full shadow-lg text-lg px-10">
            <Link href="/subscriptions">Get First Box</Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  )
}
