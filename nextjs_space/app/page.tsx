
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
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-orange-50 to-yellow-50 py-20 overflow-hidden">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                Fresh & Frozen
                <span className="block text-orange-500">Ready Meals</span>
                <span className="block">Delivered Daily</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Skip the cooking, not the nutrition. Our chef-prepared meals are made with fresh, 
                local ingredients and delivered straight to your door in Cork.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="bg-orange-500 hover:bg-orange-600">
                  <Link href="/meals">
                    Browse Meals <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/subscriptions">View Subscriptions</Link>
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="relative aspect-square bg-gradient-to-br from-orange-100 to-yellow-100 rounded-2xl overflow-hidden">
                <Image
                  src="https://cdn.abacus.ai/images/89c41a16-b55b-4ced-b876-30b5b3a7e3db.png"
                  alt="Delicious ready-made meals"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Why Choose EasyMeals.ie?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We make healthy eating convenient with fresh ingredients, expert preparation, and reliable delivery.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-lg bg-orange-50 hover:bg-orange-100 transition-colors">
              <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Quick & Convenient</h3>
              <p className="text-gray-600">
                Ready in minutes, not hours. Perfect for busy lifestyles without compromising on quality.
              </p>
            </div>

            <div className="text-center p-6 rounded-lg bg-green-50 hover:bg-green-100 transition-colors">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Fresh & Safe</h3>
              <p className="text-gray-600">
                Proper cold chain delivery ensuring fresh chilled (0-5°C) and frozen (≤-18°C) meals arrive safely.
              </p>
            </div>

            <div className="text-center p-6 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Cork Delivery</h3>
              <p className="text-gray-600">
                Reliable delivery throughout Cork city and surrounding areas, 4-6 days per week.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Featured Meals
            </h2>
            <p className="text-lg text-gray-600">
              Discover our most popular chef-prepared dishes
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {featuredProducts?.map((product) => (
              <ProductCard key={product?.id} product={product} />
            ))}
          </div>

          <div className="text-center">
            <Button asChild size="lg" variant="outline">
              <Link href="/meals">
                View All Meals <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-orange-500 to-yellow-500 text-white">
        <div className="container mx-auto max-w-4xl px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Start Your Meal Delivery Today
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join Cork's growing community of food lovers enjoying convenient, healthy meals delivered fresh to their door.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary">
              <Link href="/auth/signup">Get Started Now</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-orange-500">
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
