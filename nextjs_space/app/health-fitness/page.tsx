
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Check, Star, Dumbbell, Activity } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'

export default function HealthFitnessPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-emerald-50 via-white to-teal-50 py-20">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Content */}
            <div>
              <div className="inline-block mb-4">
                <span className="bg-teal-100 text-teal-700 px-4 py-2 rounded-full text-sm font-semibold uppercase tracking-wide flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  Nutrition Focused
                </span>
              </div>
              <h1 className="text-5xl lg:text-6xl font-extrabold text-gray-900 mb-6 leading-tight">
                Fuel Your Fitness in Cork
              </h1>
              <p className="text-xl text-gray-600 mb-6">
                High-protein, macro-balanced meals for active lifestyles. Whether you're training at FLYEfit Cork or hitting the Lee Fields for a run, we've got the nutrition you need.
              </p>
              
              {/* Key Features */}
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <Check className="w-6 h-6 text-easymeals-green mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">30g+ protein per meal</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-6 h-6 text-easymeals-green mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Macro breakdown on every label</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-6 h-6 text-easymeals-green mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Low carb, high protein, vegan options available</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-6 h-6 text-easymeals-green mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Created with Cork nutritionist input</span>
                </li>
              </ul>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="bg-easymeals-green hover:bg-easymeals-green/90 text-white rounded-full font-semibold text-lg px-10 shadow-xl">
                  <Link href="/meals?category=fitness">
                    Browse Fitness Meals <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-2 border-easymeals-green text-easymeals-green hover:bg-easymeals-green hover:text-white rounded-full font-semibold text-lg px-10">
                  <Link href="/subscriptions">
                    Fitness Weekly Plan
                  </Link>
                </Button>
              </div>
            </div>

            {/* Right side - Image */}
            <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src="https://cdn.abacus.ai/images/a8be86ec-e2e1-479a-90d7-41ddca4cf3a9.png"
                alt="Health & Fitness Meals"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Popular Fitness Meals */}
      <section className="py-20 bg-white">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Top Picks for Active Cork People
            </h2>
            <p className="text-xl text-gray-600">
              Protein-packed meals to support your goals
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Meal 1 */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow">
              <div className="relative aspect-video bg-muted">
                <Image
                  src="https://cdn.abacus.ai/images/a8be86ec-e2e1-479a-90d7-41ddca4cf3a9.png"
                  alt="Grilled Chicken & Quinoa"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute top-4 right-4 bg-teal-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                  35g Protein
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Grilled Chicken & Quinoa</h3>
                <p className="text-gray-600 mb-2">Lean protein with superfood grains</p>
                <p className="text-sm text-gray-500 mb-4">Protein: 35g | Carbs: 40g | Fat: 12g</p>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-3xl font-bold text-easymeals-green">€8.50</span>
                  <span className="text-sm text-gray-500">per meal</span>
                </div>
                <Button asChild className="w-full bg-easymeals-green hover:bg-easymeals-green/90 text-white rounded-full">
                  <Link href="/meals?category=fitness">
                    Order Now
                  </Link>
                </Button>
              </div>
            </div>

            {/* Meal 2 */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow">
              <div className="relative aspect-video bg-muted">
                <Image
                  src="https://cdn.abacus.ai/images/a8be86ec-e2e1-479a-90d7-41ddca4cf3a9.png"
                  alt="Salmon & Sweet Potato"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute top-4 right-4 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                  Omega-3
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Salmon & Sweet Potato</h3>
                <p className="text-gray-600 mb-2">Rich in omega-3 for recovery</p>
                <p className="text-sm text-gray-500 mb-4">Protein: 32g | Carbs: 45g | Fat: 18g</p>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-3xl font-bold text-easymeals-green">€10.00</span>
                  <span className="text-sm text-gray-500">per meal</span>
                </div>
                <Button asChild className="w-full bg-easymeals-green hover:bg-easymeals-green/90 text-white rounded-full">
                  <Link href="/meals?category=fitness">
                    Order Now
                  </Link>
                </Button>
              </div>
            </div>

            {/* Meal 3 */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow">
              <div className="relative aspect-video bg-muted">
                <Image
                  src="https://cdn.abacus.ai/images/a8be86ec-e2e1-479a-90d7-41ddca4cf3a9.png"
                  alt="Turkey Mince Stir-Fry"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                  Low Carb
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Turkey Mince Stir-Fry</h3>
                <p className="text-gray-600 mb-2">High protein, low carb option</p>
                <p className="text-sm text-gray-500 mb-4">Protein: 38g | Carbs: 15g | Fat: 10g</p>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-3xl font-bold text-easymeals-green">€9.00</span>
                  <span className="text-sm text-gray-500">per meal</span>
                </div>
                <Button asChild className="w-full bg-easymeals-green hover:bg-easymeals-green/90 text-white rounded-full">
                  <Link href="/meals?category=fitness">
                    Order Now
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gradient-to-br from-teal-50 via-white to-emerald-50">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Designed for Your Active Lifestyle
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
              <Dumbbell className="w-12 h-12 text-easymeals-green mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">Muscle Building</h3>
              <p className="text-gray-600">
                30-40g protein per meal to support muscle growth and recovery.
              </p>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
              <Activity className="w-12 h-12 text-easymeals-green mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">Performance Fuel</h3>
              <p className="text-gray-600">
                Balanced macros to keep you energized through training sessions.
              </p>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
              <Check className="w-12 h-12 text-easymeals-green mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">Clean Ingredients</h3>
              <p className="text-gray-600">
                No processed junk - just real food to fuel real results.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-20 bg-white">
        <div className="container mx-auto max-w-4xl px-4 text-center">
          <div className="bg-gradient-to-br from-teal-50 to-emerald-50 rounded-3xl shadow-xl p-12">
            <div className="flex justify-center mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className="w-8 h-8 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <p className="text-2xl text-gray-700 mb-6 italic leading-relaxed">
              "Training for the Cork City Marathon and these meals have been a game-changer. Perfect macros, tastes great, and saves me hours of meal prep. The salmon is restaurant quality!"
            </p>
            <p className="text-lg font-bold text-gray-900">- David Collins, Cork Running Club</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-easymeals-green text-white">
        <div className="container mx-auto max-w-4xl px-4 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Weekly Fitness Meal Plan
          </h2>
          <p className="text-xl mb-10 opacity-95">
            7 high-protein meals delivered weekly. From €8 per meal.
          </p>
          <Button asChild size="lg" className="bg-white text-green-600 hover:bg-gray-100 font-bold rounded-full shadow-lg text-lg px-10">
            <Link href="/subscriptions">Start Your Plan</Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  )
}
