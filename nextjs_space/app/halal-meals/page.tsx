
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Check, Star, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'

export default function HalalMealsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-green-50 via-white to-emerald-50 py-20">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Content */}
            <div>
              <div className="inline-block mb-4">
                <span className="bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-semibold uppercase tracking-wide flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" />
                  100% Halal Certified
                </span>
              </div>
              <h1 className="text-5xl lg:text-6xl font-extrabold text-gray-900 mb-6 leading-tight">
                Authentic Halal Meals in Cork
              </h1>
              <p className="text-xl text-gray-600 mb-6">
                Fully certified halal ready-made meals, prepared with care and respect for tradition. Serving Cork's Muslim community with quality you can trust.
              </p>
              
              {/* Key Features */}
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <Check className="w-6 h-6 text-easymeals-green mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Certified by Irish Halal Food Authority</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-6 h-6 text-easymeals-green mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Fresh ingredients from trusted suppliers</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-6 h-6 text-easymeals-green mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Traditional recipes with modern convenience</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-6 h-6 text-easymeals-green mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Delivered fresh across Cork</span>
                </li>
              </ul>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="bg-easymeals-green hover:bg-easymeals-green/90 text-white rounded-full font-semibold text-lg px-10 shadow-xl">
                  <Link href="/meals?category=halal">
                    Browse Halal Meals <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-2 border-easymeals-green text-easymeals-green hover:bg-easymeals-green hover:text-white rounded-full font-semibold text-lg px-10">
                  <Link href="/subscriptions">
                    Weekly Halal Box
                  </Link>
                </Button>
              </div>
            </div>

            {/* Right side - Image */}
            <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src="https://cdn.abacus.ai/images/2f8a7c9d-f090-4098-9f83-e2b60fb40b3d.png"
                alt="Halal Certified Meals"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Popular Halal Meals */}
      <section className="py-20 bg-white">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Our Halal Collection
            </h2>
            <p className="text-xl text-gray-600">
              Authentic flavours from around the world
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Meal 1 */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow">
              <div className="relative aspect-video bg-muted">
                <Image
                  src="https://cdn.abacus.ai/images/2f8a7c9d-f090-4098-9f83-e2b60fb40b3d.png"
                  alt="Chicken Biryani"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute top-4 right-4 bg-emerald-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                  Bestseller
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Chicken Biryani</h3>
                <p className="text-gray-600 mb-4">Aromatic basmati rice with tender halal chicken</p>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-3xl font-bold text-easymeals-green">€9.50</span>
                  <span className="text-sm text-gray-500">per meal</span>
                </div>
                <Button asChild className="w-full bg-easymeals-green hover:bg-easymeals-green/90 text-white rounded-full">
                  <Link href="/meals?category=halal">
                    Order Now
                  </Link>
                </Button>
              </div>
            </div>

            {/* Meal 2 */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow">
              <div className="relative aspect-video bg-muted">
                <Image
                  src="https://cdn.abacus.ai/images/2f8a7c9d-f090-4098-9f83-e2b60fb40b3d.png"
                  alt="Lamb Tagine"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Lamb Tagine</h3>
                <p className="text-gray-600 mb-4">Slow-cooked lamb with authentic Moroccan spices</p>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-3xl font-bold text-easymeals-green">€11.00</span>
                  <span className="text-sm text-gray-500">per meal</span>
                </div>
                <Button asChild className="w-full bg-easymeals-green hover:bg-easymeals-green/90 text-white rounded-full">
                  <Link href="/meals?category=halal">
                    Order Now
                  </Link>
                </Button>
              </div>
            </div>

            {/* Meal 3 */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow">
              <div className="relative aspect-video bg-muted">
                <Image
                  src="https://cdn.abacus.ai/images/2f8a7c9d-f090-4098-9f83-e2b60fb40b3d.png"
                  alt="Beef Kofta Curry"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Beef Kofta Curry</h3>
                <p className="text-gray-600 mb-4">Spiced meatballs in a rich tomato sauce</p>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-3xl font-bold text-easymeals-green">€10.50</span>
                  <span className="text-sm text-gray-500">per meal</span>
                </div>
                <Button asChild className="w-full bg-easymeals-green hover:bg-easymeals-green/90 text-white rounded-full">
                  <Link href="/meals?category=halal">
                    Order Now
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Certification Info */}
      <section className="py-20 bg-gradient-to-br from-emerald-50 via-white to-green-50">
        <div className="container mx-auto max-w-5xl px-4">
          <div className="bg-white rounded-3xl shadow-xl p-12">
            <div className="text-center mb-8">
              <ShieldCheck className="w-16 h-16 text-emerald-600 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Our Halal Commitment
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start">
                <Check className="w-6 h-6 text-emerald-600 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">Certified Suppliers</h4>
                  <p className="text-gray-600">All meat sourced from Irish Halal Food Authority certified suppliers</p>
                </div>
              </div>
              <div className="flex items-start">
                <Check className="w-6 h-6 text-emerald-600 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">Dedicated Prep</h4>
                  <p className="text-gray-600">Separate kitchen facilities to prevent cross-contamination</p>
                </div>
              </div>
              <div className="flex items-start">
                <Check className="w-6 h-6 text-emerald-600 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">Regular Audits</h4>
                  <p className="text-gray-600">Monthly inspections to maintain highest standards</p>
                </div>
              </div>
              <div className="flex items-start">
                <Check className="w-6 h-6 text-emerald-600 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">Complete Transparency</h4>
                  <p className="text-gray-600">Full ingredient lists and certification docs available on request</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-20 bg-white">
        <div className="container mx-auto max-w-4xl px-4 text-center">
          <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-3xl shadow-xl p-12">
            <div className="flex justify-center mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className="w-8 h-8 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <p className="text-2xl text-gray-700 mb-6 italic leading-relaxed">
              "Finally, proper halal meals in Cork! The quality and taste remind me of home. The chicken biryani is exactly like my mother's recipe. EasyMeals has become essential for our family."
            </p>
            <p className="text-lg font-bold text-gray-900">- Ahmed Rahman, Cork City</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-easymeals-green text-white">
        <div className="container mx-auto max-w-4xl px-4 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Subscribe to Weekly Halal Box
          </h2>
          <p className="text-xl mb-10 opacity-95">
            Get 5 different halal meals delivered every Friday. Perfect for busy families.
          </p>
          <Button asChild size="lg" className="bg-white text-green-600 hover:bg-gray-100 font-bold rounded-full shadow-lg text-lg px-10">
            <Link href="/subscriptions">Start Subscription</Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  )
}
