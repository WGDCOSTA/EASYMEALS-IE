
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Star, Check, TrendingUp, ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { ProductCarousel } from '@/components/product-carousel'
import { EnhancedProductCard } from '@/components/enhanced-product-card'
import { prisma } from '@/lib/db'

interface ProductData {
  id: string
  name: string
  description: string
  price: number
  originalPrice?: number | null
  imageUrl: string
  category: string
  storageType: string
  allergens: string[]
  calories?: number | null
  preparationTime?: number | null
  servingSize?: number | null
  discount?: number | null
  stockQuantity: number
  stockAlert?: number | null
  limitedTimeOffer?: Date | null
  isBestOffer?: boolean
  isTopSaver?: boolean
}

export default async function HomePage() {
  // Get product sections with their products
  const sections = await prisma.productSection.findMany({
    where: { isActive: true },
    include: {
      sectionProducts: {
        include: {
          product: true
        },
        orderBy: { displayOrder: 'asc' },
        take: 10
      }
    },
    orderBy: { displayOrder: 'asc' }
  })

  // Get featured products for the main section
  const featuredProducts = await prisma.product.findMany({
    where: { 
      isActive: true,
      isFeatured: true
    },
    take: 6,
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section with Happy Customers Badge */}
      <section className="relative bg-gradient-to-br from-green-50 via-white to-green-50 py-16 overflow-hidden">
        {/* Decorative wave elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-30">
          <svg className="absolute top-0 right-0 w-1/2 h-full" viewBox="0 0 500 500" preserveAspectRatio="none">
            <path d="M 0,100 C 150,200 350,0 500,100 L 500,500 L 0,500 Z" fill="#86efac" opacity="0.3"></path>
          </svg>
          <svg className="absolute bottom-0 left-0 w-1/2 h-full" viewBox="0 0 500 500" preserveAspectRatio="none">
            <path d="M 0,400 C 150,300 350,500 500,400 L 500,500 L 0,500 Z" fill="#86efac" opacity="0.2"></path>
          </svg>
        </div>
        
        <div className="container mx-auto max-w-7xl px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Images */}
            <div className="grid grid-cols-2 gap-4">
              <div className="relative aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-300">
                <Image
                  src="https://cdn.abacus.ai/images/89c41a16-b55b-4ced-b876-30b5b3a7e3db.png"
                  alt="Delicious meal 1"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 25vw"
                  priority
                />
              </div>
              <div className="relative aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl transform -rotate-2 hover:rotate-0 transition-transform duration-300 mt-8">
                <Image
                  src="https://cdn.abacus.ai/images/89c41a16-b55b-4ced-b876-30b5b3a7e3db.png"
                  alt="Delicious meal 2"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              </div>
            </div>

            {/* Right side - Text Content */}
            <div>
              <div className="inline-block mb-4">
                <span className="bg-easymeals-green/10 text-easymeals-green px-4 py-2 rounded-full text-sm font-semibold uppercase tracking-wide">
                  Serving Cork & Surrounding Areas
                </span>
              </div>
              <h1 className="text-5xl lg:text-6xl font-extrabold text-gray-900 mb-6 leading-tight">
                Real Meals, Ready Fast - Delivered to Your Cork Home
              </h1>
              <p className="text-xl text-gray-600 mb-6">
                From Douglas to Ballincollig, Blackrock to Bishopstown - we're bringing proper food to busy Cork people. No fancy talk, just good meals made simple.
              </p>
              
              {/* Star rating */}
              <div className="flex items-center mb-8">
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="ml-3 text-2xl font-bold text-gray-900">4.5</span>
              </div>
              <p className="text-sm text-gray-500 mb-8">Based on 110+ Reviews from Real Cork Customers</p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="bg-easymeals-orange hover:bg-easymeals-orange/90 text-white rounded-full font-semibold text-lg px-10 shadow-xl hover:shadow-2xl transition-all">
                  <Link href="/meals">
                    Browse Meals
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-2 border-easymeals-orange text-easymeals-orange hover:bg-easymeals-orange hover:text-white rounded-full font-semibold text-lg px-10">
                  <Link href="/subscriptions">
                    Start Subscription
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="relative py-20 bg-gradient-to-br from-green-50 via-green-100/50 to-green-50 overflow-hidden">
        {/* Decorative wave background */}
        <div className="absolute inset-0 opacity-40">
          <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 1440 800" preserveAspectRatio="none">
            <path d="M0,400 Q360,300 720,400 T1440,400 L1440,800 L0,800 Z" fill="#86efac" opacity="0.2"></path>
            <path d="M0,500 Q360,450 720,500 T1440,500 L1440,800 L0,800 Z" fill="#86efac" opacity="0.15"></path>
          </svg>
        </div>

        <div className="container mx-auto max-w-7xl px-4 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              How EasyMeals Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Three simple steps to better eating in Cork - no hassle, no waste, just great food
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {/* Step 1 - You Choose */}
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden transform hover:scale-105 transition-transform duration-300">
              <div className="relative aspect-[16/10] bg-muted">
                <Image
                  src="/images/how-it-works-choose.jpg"
                  alt="Browse and choose your meals"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">1. Pick Your Meals</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-easymeals-green mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600">Browse our menu - from student meals to family combos</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-easymeals-green mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600">Choose frozen or fresh - whatever suits your lifestyle</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-easymeals-green mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600">Order once-off or set up a weekly subscription</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-easymeals-green mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600">No commitment - pause or cancel anytime</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Step 2 - We Deliver */}
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden transform hover:scale-105 transition-transform duration-300">
              <div className="relative aspect-[16/10] bg-muted">
                <Image
                  src="/images/how-it-works-deliver.jpg"
                  alt="We deliver to your door"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">2. We Deliver to Cork</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-easymeals-green mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600">Free delivery in Cork on orders over €30</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-easymeals-green mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600">Deliveries every Tuesday & Friday to Cork addresses</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-easymeals-green mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600">Insulated packaging keeps meals fresh - even if you're out</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-easymeals-green mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600">Track your order in real-time</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Step 3 - You Enjoy */}
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden transform hover:scale-105 transition-transform duration-300">
              <div className="relative aspect-[16/10] bg-muted">
                <Image
                  src="/images/how-it-works-enjoy.jpg"
                  alt="Enjoy your delicious meals"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">3. Heat & Eat</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-easymeals-green mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600">Pop it in the microwave or oven - ready in 5-10 minutes</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-easymeals-green mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600">No chopping, no mess, minimal washing up</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-easymeals-green mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600">Frozen meals last weeks - fresh meals stay good for 5-7 days</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-easymeals-green mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600">Proper food that actually tastes like home cooking</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="text-center">
            <Button asChild size="lg" className="bg-easymeals-green hover:bg-easymeals-green/90 text-white rounded-full font-semibold text-lg px-10 shadow-xl">
              <Link href="/meals">
                Get Started Now
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Shop Your Way Section - Retail vs Subscription */}
      <section className="py-20 bg-gradient-to-br from-orange-50 via-white to-green-50">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Shop Your Way
            </h2>
            <p className="text-xl text-gray-600">
              Choose what works best for your Cork lifestyle
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* One-Time Purchase */}
            <div className="relative bg-white rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-all border-2 border-transparent hover:border-easymeals-orange group">
              <div className="absolute top-4 right-4 bg-easymeals-orange text-white px-4 py-2 rounded-full text-sm font-bold">
                Most Flexible
              </div>
              <ShoppingBag className="w-16 h-16 text-easymeals-orange mb-6" />
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                Buy Once
              </h3>
              <p className="text-gray-600 mb-6">
                Order exactly what you want, when you want it. Perfect for trying us out or occasional meals.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-easymeals-green mt-0.5" />
                  <span className="text-gray-700">No commitment required</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-easymeals-green mt-0.5" />
                  <span className="text-gray-700">Choose any meal from the menu</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-easymeals-green mt-0.5" />
                  <span className="text-gray-700">Free delivery on orders over €30</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-easymeals-green mt-0.5" />
                  <span className="text-gray-700">Order when you need it</span>
                </li>
              </ul>
              <Button asChild className="w-full bg-easymeals-orange hover:bg-easymeals-orange/90 text-white font-bold py-6 rounded-full text-lg">
                <Link href="/meals">Browse Meals</Link>
              </Button>
            </div>

            {/* Subscription */}
            <div className="relative bg-gradient-to-br from-green-500 to-green-600 rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-all text-white group">
              <div className="absolute top-4 right-4 bg-yellow-400 text-gray-900 px-4 py-2 rounded-full text-sm font-bold flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                Save 15%
              </div>
              <Star className="w-16 h-16 text-yellow-300 mb-6 fill-yellow-300" />
              <h3 className="text-3xl font-bold mb-4">
                Subscribe & Save
              </h3>
              <p className="mb-6 text-green-50">
                Get regular deliveries and save money. Perfect for busy Cork families and professionals.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-yellow-300 mt-0.5" />
                  <span className="text-white">Save 15% on every order</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-yellow-300 mt-0.5" />
                  <span className="text-white">Automatic weekly deliveries</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-yellow-300 mt-0.5" />
                  <span className="text-white">Priority delivery slots</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-yellow-300 mt-0.5" />
                  <span className="text-white">Cancel or pause anytime</span>
                </li>
              </ul>
              <Button asChild className="w-full bg-white text-easymeals-green hover:bg-gray-100 font-bold py-6 rounded-full text-lg shadow-lg">
                <Link href="/subscriptions">Start Subscription</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Dynamic Product Sections - Carousels */}
      {sections.map((section: any) => {
        const sectionProducts = section.sectionProducts
          ?.map((sp: any) => sp.product)
          .filter((p: any) => p !== null && p.isActive) as ProductData[]
        
        if (!sectionProducts || sectionProducts.length === 0) return null

        return (
          <section key={section.id} className="py-20 bg-white odd:bg-gray-50">
            <div className="container mx-auto max-w-7xl px-4">
              <ProductCarousel
                title={section.title}
                description={section.description || undefined}
                products={sectionProducts}
              />
            </div>
          </section>
        )
      })}

      {/* Featured Products Grid */}
      {featuredProducts.length > 0 && (
        <section className="py-20 bg-white">
          <div className="container mx-auto max-w-7xl px-4">
            <div className="mb-12 text-center">
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                Popular This Week in Cork
              </h2>
              <p className="text-xl text-gray-600">
                See what your neighbors are ordering
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {featuredProducts.map((product) => (
                <EnhancedProductCard key={product.id} product={product} />
              ))}
            </div>

            <div className="text-center">
              <Button asChild size="lg" className="bg-easymeals-orange hover:bg-easymeals-orange/90 text-white rounded-full font-semibold text-lg px-8 shadow-lg">
                <Link href="/meals">
                  View All Meals <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Reviews Section */}
      <section className="py-20 bg-gradient-to-br from-green-50 via-white to-green-50">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              What Cork People Are Saying
            </h2>
            <p className="text-xl text-gray-600">
              Real reviews from real Cork customers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Review 1 */}
            <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center text-white text-xl font-bold mr-4">
                  OL
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Orla Linehan</h4>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-600 leading-relaxed">
                &quot;Been using EasyMeals since January and it's brilliant. Between work and the kids' hurling training, I barely had time to cook. Now dinner's sorted in minutes and the quality is savage. The chicken curry is our favourite!&quot;
              </p>
            </div>

            {/* Review 2 */}
            <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-green-400 to-green-500 flex items-center justify-center text-white text-xl font-bold mr-4">
                  AM
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Aleksei Murphy</h4>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-600 leading-relaxed">
                &quot;I'm a student at UCC and these meals are a lifesaver! Way cheaper than Deliveroo and actually healthy. The portions are massive too. My flatmates are all jealous!&quot;
              </p>
            </div>

            {/* Review 3 */}
            <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-400 to-blue-500 flex items-center justify-center text-white text-xl font-bold mr-4">
                  SM
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Sarah McGrath</h4>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-600 leading-relaxed">
                &quot;Working 12-hour shifts at CUH, the last thing I want to do is cook when I get home to Ballincollig. EasyMeals sorted that problem. Tastes like proper home cooking and I don't have to think about it. Game changer!&quot;
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-orange-400 via-orange-500 to-easymeals-orange text-white relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-10 right-10 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-10 left-10 w-40 h-40 bg-yellow-300 opacity-10 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto max-w-4xl px-4 text-center relative z-10">
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-12 shadow-2xl">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Try EasyMeals This Week
            </h2>
            <p className="text-xl mb-10 opacity-95 max-w-2xl mx-auto">
              Join hundreds of Cork families who've ditched the takeaways and switched to real food, made easy. First order? We'll deliver free in Cork.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-white text-orange-600 hover:bg-gray-100 font-bold rounded-full shadow-lg hover:shadow-xl transition-all text-lg px-8">
                <Link href="/meals">Browse Meals</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-orange-500 font-bold rounded-full bg-transparent transition-all text-lg px-8">
                <Link href="/subscriptions">Start Subscription</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
