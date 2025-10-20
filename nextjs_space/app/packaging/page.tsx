
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Recycle, Leaf, Box } from 'lucide-react'

export default function PackagingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="container mx-auto max-w-4xl px-4 py-16">
        <h1 className="text-5xl font-bold text-gray-900 mb-8">Our Packaging</h1>
        
        <div className="prose prose-lg max-w-none">
          <p className="text-xl text-gray-600 leading-relaxed mb-12">
            At EasyMeals.ie, we&apos;re committed to protecting both your meals and the environment. 
            Our packaging is designed to keep your food fresh while minimizing environmental impact.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 not-prose">
            <div className="text-center p-6 bg-green-50 rounded-2xl">
              <Recycle className="w-12 h-12 text-easymeals-green mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">100% Recyclable</h3>
              <p className="text-gray-600">All our packaging materials can be recycled</p>
            </div>
            <div className="text-center p-6 bg-blue-50 rounded-2xl">
              <Leaf className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Sustainable</h3>
              <p className="text-gray-600">Made from renewable and recycled materials</p>
            </div>
            <div className="text-center p-6 bg-orange-50 rounded-2xl">
              <Box className="w-12 h-12 text-easymeals-orange mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Insulated</h3>
              <p className="text-gray-600">Keeps food fresh for up to 24 hours</p>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-4">What&apos;s in the Box?</h2>
          
          <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-3">Insulated Packaging</h3>
          <p className="text-gray-600 leading-relaxed mb-6">
            Our meals arrive in specially designed insulated boxes that maintain proper temperature 
            control. The insulation is made from recyclable wool-based material that keeps frozen 
            food at ≤-18°C and chilled food at 0-5°C for extended periods.
          </p>

          <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-3">Ice Packs</h3>
          <p className="text-gray-600 leading-relaxed mb-6">
            We use reusable ice packs that can be refrozen and reused at home. The gel inside is 
            non-toxic and the plastic casing is recyclable. You can also return them to us for 
            recycling if you prefer.
          </p>

          <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-3">Food Containers</h3>
          <p className="text-gray-600 leading-relaxed mb-6">
            Individual meals are packaged in recyclable plastic containers that are BPA-free and 
            food-safe. The labels are easy to peel off before recycling.
          </p>

          <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-3">Cardboard Boxes</h3>
          <p className="text-gray-600 leading-relaxed mb-6">
            The outer box is made from 100% recycled cardboard and can be easily broken down and 
            recycled with your household waste.
          </p>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-4">How to Recycle</h2>
          <ul className="space-y-3 mb-6">
            <li className="flex items-start">
              <span className="text-easymeals-green mr-2 text-xl">1.</span>
              <span className="text-gray-600">Remove any food residue from containers</span>
            </li>
            <li className="flex items-start">
              <span className="text-easymeals-green mr-2 text-xl">2.</span>
              <span className="text-gray-600">Peel off labels from plastic containers</span>
            </li>
            <li className="flex items-start">
              <span className="text-easymeals-green mr-2 text-xl">3.</span>
              <span className="text-gray-600">Break down cardboard boxes flat</span>
            </li>
            <li className="flex items-start">
              <span className="text-easymeals-green mr-2 text-xl">4.</span>
              <span className="text-gray-600">Place all materials in your recycling bin</span>
            </li>
            <li className="flex items-start">
              <span className="text-easymeals-green mr-2 text-xl">5.</span>
              <span className="text-gray-600">Keep ice packs for reuse or return to us</span>
            </li>
          </ul>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-8 mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Commitment to the Environment</h2>
            <p className="text-gray-600 mb-4">
              We&apos;re continuously working to reduce our environmental footprint. Our goal is to 
              achieve 100% compostable or recyclable packaging by 2026.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
