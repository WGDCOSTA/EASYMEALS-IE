
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Clock, Shield, Truck, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { ProductCard } from '@/components/product-card'
import { prisma } from '@/lib/db'

interface ProductCardData {
  id: string
  name: string
  description: string
  price: number
  imageUrl: string
  category: string
  storageType: string
  allergens: string[]
  calories?: number | null
  preparationTime?: number | null
  servingSize?: number | null
}

export default async function HomePage() {
  // Get featured products
  const rawProducts = await prisma.product.findMany({
    where: { isActive: true },
    take: 6,
    orderBy: { createdAt: 'desc' }
  })

  // Transform the products to match the expected interface
  const featuredProducts: ProductCardData[] = rawProducts.map(product => ({
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price,
    imageUrl: product.imageUrl,
    category: product.category,
    storageType: product.storageType,
    allergens: product.allergens,
    calories: product.calories,
    preparationTime: product.preparationTime,
    servingSize: product.servingSize
  }))

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section - Cork Delivery Banner */}
      <section className="relative bg-gradient-to-br from-easymeals-orange via-red-600 to-easymeals-orange py-12 overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute top-10 right-10 w-48 h-48 bg-white/10 rounded-full"></div>
        <div className="absolute bottom-10 right-1/4 w-32 h-32 bg-white/10 rounded-full"></div>
        <div className="absolute top-20 left-10 w-24 h-24 bg-easymeals-yellow/20 rounded-full"></div>
        
        <div className="container mx-auto max-w-7xl px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="relative">
              <div className="relative aspect-square max-w-md mx-auto">
                <Image
                  src="https://cdn.abacus.ai/images/89c41a16-b55b-4ced-b876-30b5b3a7e3db.png"
                  alt="Fresh ready-made meals"
                  fill
                  className="object-cover rounded-full"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
              </div>
            </div>
            <div className="text-white text-center lg:text-left">
              <h1 className="text-5xl lg:text-7xl font-extrabold mb-4 leading-tight">
                HELLO CORK
              </h1>
              <p className="text-2xl lg:text-3xl font-semibold mb-6">
                GET YOUR MEALS READY FOR DELIVERY.
              </p>
              <h2 className="text-4xl lg:text-6xl font-bold mb-8">
                FROZEN OR FRESH
                <span className="block text-xl lg:text-2xl font-normal mt-2">AT YOUR DOORSTEP :</span>
              </h2>
              <div className="flex flex-wrap gap-3 justify-center lg:justify-start mb-6">
                <span className="bg-easymeals-red px-6 py-2 rounded-full font-semibold text-white shadow-lg">BLARNEY</span>
                <span className="bg-easymeals-red px-6 py-2 rounded-full font-semibold text-white shadow-lg">CORK CITY</span>
                <span className="bg-easymeals-red px-6 py-2 rounded-full font-semibold text-white shadow-lg">GLANMIRE</span>
                <span className="bg-easymeals-red px-6 py-2 rounded-full font-semibold text-white shadow-lg">TOWER</span>
              </div>
              <div className="flex flex-wrap gap-3 justify-center lg:justify-start mb-8">
                <span className="bg-easymeals-red px-6 py-2 rounded-full font-semibold text-white shadow-lg">CARRIGTWOHILL</span>
                <span className="bg-easymeals-red px-6 py-2 rounded-full font-semibold text-white shadow-lg">BALLINCOLLIG</span>
                <span className="bg-easymeals-red px-6 py-2 rounded-full font-semibold text-white shadow-lg">CARRIGALINE</span>
              </div>
              <div className="inline-block">
                <div className="bg-white text-easymeals-orange px-8 py-4 rounded-full font-bold text-2xl shadow-2xl">
                  30% OFF
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Action Cards */}
      <section className="py-8 bg-gradient-to-br from-blue-600 to-indigo-700">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-green-600 p-8 rounded-2xl text-white relative overflow-hidden">
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full"></div>
              <div className="relative z-10">
                <div className="inline-block bg-red-500 text-white px-4 py-1 rounded-full text-sm font-semibold mb-4">
                  $10 OFF
                </div>
                <h3 className="text-xl font-semibold mb-2">The Fitness Kitchen</h3>
                <h2 className="text-4xl font-bold mb-4">Frozen or Chilled</h2>
                <Button asChild className="bg-easymeals-yellow hover:bg-yellow-400 text-gray-900 font-semibold rounded-full">
                  <Link href="/meals?category=fitness">SHOP NOW</Link>
                </Button>
              </div>
            </div>
            <div className="bg-easymeals-yellow p-8 rounded-2xl text-white relative overflow-hidden">
              <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-white/20 rounded-full"></div>
              <div className="relative z-10">
                <div className="inline-block bg-easymeals-red text-white px-4 py-1 rounded-full text-sm font-semibold mb-4">
                  TOP 5
                </div>
                <h3 className="text-xl font-semibold mb-2">It's Curry Time</h3>
                <h2 className="text-4xl font-bold text-gray-900 mb-4">Chicken & Curry</h2>
                <Button asChild className="bg-easymeals-charcoal hover:bg-gray-700 text-white font-semibold rounded-full">
                  <Link href="/meals?category=curry">SHOP NOW</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Why Choose EasyMeals.ie?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We make healthy eating convenient with fresh ingredients, expert preparation, and reliable delivery.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8 rounded-3xl bg-gradient-to-br from-orange-50 to-yellow-50 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Clock className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Quick & Convenient</h3>
              <p className="text-gray-600 text-lg">
                Ready in minutes, not hours. Perfect for busy lifestyles without compromising on quality.
              </p>
            </div>

            <div className="text-center p-8 rounded-3xl bg-gradient-to-br from-green-50 to-emerald-50 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Shield className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Fresh & Safe</h3>
              <p className="text-gray-600 text-lg">
                Proper cold chain delivery ensuring fresh chilled (0-5°C) and frozen (≤-18°C) meals arrive safely.
              </p>
            </div>

            <div className="text-center p-8 rounded-3xl bg-gradient-to-br from-blue-50 to-cyan-50 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Truck className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Cork Delivery</h3>
              <p className="text-gray-600 text-lg">
                Reliable delivery throughout Cork city and surrounding areas, 4-6 days per week.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="mb-12">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Popular Recipes
            </h2>
            <p className="text-xl text-gray-600">
              Discover our most loved chef-prepared dishes
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {featuredProducts?.map((product) => (
              <ProductCard key={product?.id} product={product} />
            ))}
          </div>

          <div className="text-center">
            <Button asChild size="lg" className="bg-orange-500 hover:bg-orange-600 rounded-full font-semibold text-lg px-8 shadow-lg">
              <Link href="/meals">
                View All Meals <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-orange-400 via-orange-500 to-yellow-400 text-white relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-10 right-10 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-10 left-10 w-40 h-40 bg-yellow-300 opacity-10 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto max-w-4xl px-4 text-center relative z-10">
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-12 shadow-2xl">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Start Your Meal Delivery Today
            </h2>
            <p className="text-xl mb-10 opacity-95 max-w-2xl mx-auto">
              Join Cork's growing community of food lovers enjoying convenient, healthy meals delivered fresh to their door.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-white text-orange-600 hover:bg-gray-100 font-bold rounded-full shadow-lg hover:shadow-xl transition-all text-lg px-8">
                <Link href="/auth/signup">Get Started Now</Link>
              </Button>
              <Button asChild size="lg" className="border-2 border-white text-white hover:bg-white hover:text-orange-500 font-bold rounded-full bg-transparent transition-all text-lg px-8">
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
