
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Check, Star, Wallet, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'

export default function StudentLifePage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-purple-50 py-20">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Content */}
            <div>
              <div className="inline-block mb-4">
                <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold uppercase tracking-wide flex items-center gap-2">
                  <Wallet className="w-4 h-4" />
                  Student Specials
                </span>
              </div>
              <h1 className="text-5xl lg:text-6xl font-extrabold text-gray-900 mb-6 leading-tight">
                Proper Food for Cork Students
              </h1>
              <p className="text-xl text-gray-600 mb-6">
                Forget about beans on toast! Real, healthy meals designed for student budgets. From UCC to CIT, we've got Cork students covered.
              </p>
              
              {/* Key Features */}
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <Check className="w-6 h-6 text-easymeals-green mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">From just €4.50 per meal</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-6 h-6 text-easymeals-green mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Free delivery to UCC, CIT & MTU campuses</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-6 h-6 text-easymeals-green mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Ready in 5 minutes - microwave or oven</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-6 h-6 text-easymeals-green mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Pause subscription during exams or holidays</span>
                </li>
              </ul>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="bg-easymeals-orange hover:bg-easymeals-orange/90 text-white rounded-full font-semibold text-lg px-10 shadow-xl">
                  <Link href="/meals?category=student">
                    Browse Student Meals <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-2 border-easymeals-orange text-easymeals-orange hover:bg-easymeals-orange hover:text-white rounded-full font-semibold text-lg px-10">
                  <Link href="/subscriptions">
                    Student Box €20/week
                  </Link>
                </Button>
              </div>
            </div>

            {/* Right side - Image */}
            <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src="https://cdn.abacus.ai/images/ad92c076-1240-4a45-bd8c-d4a50e42e567.png"
                alt="Student Meals"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Popular Student Meals */}
      <section className="py-20 bg-white">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Student Favourites
            </h2>
            <p className="text-xl text-gray-600">
              Quick, cheap, and actually tasty
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Meal 1 */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow">
              <div className="relative aspect-video bg-muted">
                <Image
                  src="https://cdn.abacus.ai/images/ad92c076-1240-4a45-bd8c-d4a50e42e567.png"
                  alt="Chicken Curry & Rice"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                  Budget Pick
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Chicken Curry & Rice</h3>
                <p className="text-gray-600 mb-4">Filling and flavourful - better than takeaway</p>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-3xl font-bold text-easymeals-orange">€4.50</span>
                  <span className="text-sm text-gray-500">per meal</span>
                </div>
                <Button asChild className="w-full bg-easymeals-green hover:bg-easymeals-green/90 text-white rounded-full">
                  <Link href="/meals?category=student">
                    Order Now
                  </Link>
                </Button>
              </div>
            </div>

            {/* Meal 2 */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow">
              <div className="relative aspect-video bg-muted">
                <Image
                  src="https://cdn.abacus.ai/images/ad92c076-1240-4a45-bd8c-d4a50e42e567.png"
                  alt="Spaghetti Carbonara"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Spaghetti Carbonara</h3>
                <p className="text-gray-600 mb-4">Creamy pasta that'll keep you going through lectures</p>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-3xl font-bold text-easymeals-orange">€5.00</span>
                  <span className="text-sm text-gray-500">per meal</span>
                </div>
                <Button asChild className="w-full bg-easymeals-green hover:bg-easymeals-green/90 text-white rounded-full">
                  <Link href="/meals?category=student">
                    Order Now
                  </Link>
                </Button>
              </div>
            </div>

            {/* Meal 3 */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow">
              <div className="relative aspect-video bg-muted">
                <Image
                  src="https://cdn.abacus.ai/images/ad92c076-1240-4a45-bd8c-d4a50e42e567.png"
                  alt="Beef Chili Con Carne"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                  High Protein
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Beef Chili Con Carne</h3>
                <p className="text-gray-600 mb-4">Hearty and spicy - perfect after a night out</p>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-3xl font-bold text-easymeals-orange">€5.50</span>
                  <span className="text-sm text-gray-500">per meal</span>
                </div>
                <Button asChild className="w-full bg-easymeals-green hover:bg-easymeals-green/90 text-white rounded-full">
                  <Link href="/meals?category=student">
                    Order Now
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Students Choose Us */}
      <section className="py-20 bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Cork Students Love EasyMeals
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
              <Wallet className="w-12 h-12 text-easymeals-green mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">Budget-Friendly</h3>
              <p className="text-gray-600">
                Cheaper than takeaways, healthier than instant noodles. Meals from €4.50.
              </p>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
              <Clock className="w-12 h-12 text-easymeals-orange mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">Quick & Easy</h3>
              <p className="text-gray-600">
                5 minutes from freezer to table. More time for studying (or Netflix).
              </p>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
              <Check className="w-12 h-12 text-easymeals-green mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">No Commitment</h3>
              <p className="text-gray-600">
                Pause anytime. Perfect for exam season or heading home for the holidays.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Student Testimonial */}
      <section className="py-20 bg-white">
        <div className="container mx-auto max-w-4xl px-4 text-center">
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl shadow-xl p-12">
            <div className="flex justify-center mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className="w-8 h-8 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <p className="text-2xl text-gray-700 mb-6 italic leading-relaxed">
              "Honestly a lifesaver! I'm at UCC and barely have time to cook between lectures and rugby training. EasyMeals keeps me fed without destroying my student budget. The chicken curry is unreal."
            </p>
            <p className="text-lg font-bold text-gray-900">- Conor Murphy, UCC Student</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-easymeals-orange text-white">
        <div className="container mx-auto max-w-4xl px-4 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Student Special: First Week €15
          </h2>
          <p className="text-xl mb-10 opacity-95">
            Try 5 meals for just €15 (that's €3 per meal!). Use code: CORKSTUENT
          </p>
          <Button asChild size="lg" className="bg-white text-orange-600 hover:bg-gray-100 font-bold rounded-full shadow-lg text-lg px-10">
            <Link href="/subscriptions">Claim Student Deal</Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  )
}
