
import { Suspense } from 'react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { MealsCatalog } from '@/components/meals-catalog'

export default function MealsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Browse Our Meals</h1>
          <p className="text-lg text-gray-600">
            Choose from our selection of fresh and frozen ready-made meals, delivered to Cork.
          </p>
        </div>
        
        <Suspense fallback={<div>Loading meals...</div>}>
          <MealsCatalog />
        </Suspense>
      </div>
      
      <Footer />
    </div>
  )
}
