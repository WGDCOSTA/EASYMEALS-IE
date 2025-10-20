
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Star, Check } from 'lucide-react'
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
                  Happy Customers
                </span>
              </div>
              <h1 className="text-5xl lg:text-6xl font-extrabold text-gray-900 mb-6 leading-tight">
                Ireland&apos;s Best Rated Meal Delivery Service
              </h1>
              <p className="text-xl text-gray-600 mb-6">
                Over 1 Million meals delivered to happy customers throughout Ireland
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
              <p className="text-sm text-gray-500 mb-8">Based on 110+ Google Reviews</p>

              <Button asChild size="lg" className="bg-easymeals-green hover:bg-easymeals-green/90 text-white rounded-full font-semibold text-lg px-10 shadow-xl hover:shadow-2xl transition-all">
                <Link href="/meals">
                  Get Started Now
                </Link>
              </Button>
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
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Premium, fresh and healthy meals delivered weekly to your door
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
                <h3 className="text-2xl font-bold text-gray-900 mb-4">You Choose</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-easymeals-green mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600">Select your plan depending on who&apos;s at home</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-easymeals-green mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600">Choose from Frozen or Fresh Chilled plans</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-easymeals-green mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600">Over 20 new recipes each week</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-easymeals-green mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600">Pause, skip or cancel any time</span>
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
                <h3 className="text-2xl font-bold text-gray-900 mb-4">We Deliver</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-easymeals-green mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600">Free delivery* to Ireland and Northern Ireland</span>
                  </li>
                  <li className="flex items-start text-sm text-gray-500">
                    <span className="ml-8">* Except Made Fresh with 5 & 6 meals</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-easymeals-green mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600">Not at home? Our nifty packaging will keep everything chilled until you get home</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-easymeals-green mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600">Convenient delivery at a place & time that suits you</span>
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
                <h3 className="text-2xl font-bold text-gray-900 mb-4">You Enjoy</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-easymeals-green mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600">Cook a tasty dinner in less than 30 minutes with easy to follow step-by-step recipe cards and pre-portioned ingredients</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-easymeals-green mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600">Or enjoy one of our prepared meals - ready in minutes</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-easymeals-green mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600">Boost your box with our range of convenient and healthy snacks, juices & smoothies</span>
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

      {/* Featured Products */}
      <section className="py-20 bg-white">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="mb-12 text-center">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Popular This Week
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
            <Button asChild size="lg" className="bg-easymeals-orange hover:bg-easymeals-orange/90 text-white rounded-full font-semibold text-lg px-8 shadow-lg">
              <Link href="/meals">
                View All Meals <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-20 bg-gradient-to-br from-green-50 via-white to-green-50">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              What Our Customers Say
            </h2>
            <p className="text-xl text-gray-600">
              Join thousands of happy customers across Ireland
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
                &quot;We have been using EasyMeals since January this year and love it. It has also brought some variety and fun into our lives trying out new foods and recipes. Everyone helps out with the cooking too because there is a printed recipe that is easy to follow. The freshness and quality of the food is excellent.&quot;
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
                &quot;Super happy with EasyMeals! It&apos;s working, and having the meal kits is amazing because it gives us some variety in our life shopping. The quality is excellent and delivery is always on time.&quot;
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
                &quot;Absolutely brilliant service! As a busy mum, EasyMeals has been a lifesaver. The meals are healthy, delicious and my kids actually eat them! The frozen options are perfect for those really hectic days. Highly recommend!&quot;
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
              Start Your Meal Delivery Today
            </h2>
            <p className="text-xl mb-10 opacity-95 max-w-2xl mx-auto">
              Join Ireland&apos;s growing community of food lovers enjoying convenient, healthy meals delivered fresh to their door.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-white text-orange-600 hover:bg-gray-100 font-bold rounded-full shadow-lg hover:shadow-xl transition-all text-lg px-8">
                <Link href="/auth/signup">Get Started Now</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-orange-500 font-bold rounded-full bg-transparent transition-all text-lg px-8">
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
