
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function RecipesPage() {
  const recipeCategories = [
    { name: 'Quick & Easy', count: '15+ recipes', color: 'from-orange-400 to-orange-500' },
    { name: 'Healthy & Fit', count: '20+ recipes', color: 'from-green-400 to-green-500' },
    { name: 'Family Favorites', count: '18+ recipes', color: 'from-blue-400 to-blue-500' },
    { name: 'Vegetarian', count: '12+ recipes', color: 'from-purple-400 to-purple-500' },
    { name: 'Low Carb', count: '10+ recipes', color: 'from-red-400 to-red-500' },
    { name: 'International', count: '25+ recipes', color: 'from-yellow-400 to-yellow-500' },
  ]

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="container mx-auto max-w-7xl px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Discover Recipes</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Explore our extensive collection of delicious, chef-curated recipes. 
            From quick weeknight dinners to impressive weekend feasts, we have something for everyone.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {recipeCategories.map((category) => (
            <Link key={category.name} href="/meals">
              <div className="group cursor-pointer">
                <div className={`bg-gradient-to-br ${category.color} rounded-3xl p-8 text-white transform group-hover:scale-105 transition-transform duration-300 shadow-lg`}>
                  <h3 className="text-2xl font-bold mb-2">{category.name}</h3>
                  <p className="text-white/90 mb-4">{category.count}</p>
                  <Button variant="secondary" className="bg-white text-gray-900 hover:bg-gray-100 rounded-full">
                    Explore Recipes
                  </Button>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-3xl p-12 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            New Recipes Added Weekly
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            We&apos;re constantly updating our menu with fresh, seasonal recipes to keep things exciting. 
            Subscribe to get access to all our recipes!
          </p>
          <Button asChild size="lg" className="bg-easymeals-green hover:bg-easymeals-green/90 text-white rounded-full font-semibold">
            <Link href="/meals">View All Meals</Link>
          </Button>
        </div>
      </div>

      <Footer />
    </div>
  )
}
