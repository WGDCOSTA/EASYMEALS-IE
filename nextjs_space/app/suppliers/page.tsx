
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { MapPin, Award, Heart } from 'lucide-react'

export default function SuppliersPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="container mx-auto max-w-4xl px-4 py-16">
        <h1 className="text-5xl font-bold text-gray-900 mb-8">Our Suppliers</h1>
        
        <div className="prose prose-lg max-w-none">
          <p className="text-xl text-gray-600 leading-relaxed mb-12">
            At EasyMeals.ie, we believe in supporting local Irish businesses and sourcing the finest 
            ingredients from trusted suppliers who share our commitment to quality and sustainability.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 not-prose">
            <div className="text-center p-6 bg-green-50 rounded-2xl">
              <MapPin className="w-12 h-12 text-easymeals-green mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Local Sourcing</h3>
              <p className="text-gray-600">90% of our ingredients come from Irish suppliers</p>
            </div>
            <div className="text-center p-6 bg-orange-50 rounded-2xl">
              <Award className="w-12 h-12 text-easymeals-orange mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Quality First</h3>
              <p className="text-gray-600">Every supplier meets our strict quality standards</p>
            </div>
            <div className="text-center p-6 bg-red-50 rounded-2xl">
              <Heart className="w-12 h-12 text-easymeals-red mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Ethical Practices</h3>
              <p className="text-gray-600">We partner only with ethical, sustainable suppliers</p>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-4">Our Supplier Partners</h2>
          
          <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-3">Fresh Produce</h3>
          <p className="text-gray-600 leading-relaxed mb-6">
            We work with family-run farms across Ireland to source the freshest vegetables, fruits, and herbs. 
            Our produce is picked at peak ripeness and delivered to our kitchen within 24 hours.
          </p>

          <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-3">Premium Meats</h3>
          <p className="text-gray-600 leading-relaxed mb-6">
            Our meat suppliers are carefully selected Irish butchers who provide grass-fed beef, free-range 
            chicken, and sustainably sourced pork. All meat is traceable to the farm of origin.
          </p>

          <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-3">Sustainable Seafood</h3>
          <p className="text-gray-600 leading-relaxed mb-6">
            We source fresh seafood from Irish coastal suppliers who follow sustainable fishing practices. 
            Our seafood is MSC certified where possible and always responsibly sourced.
          </p>

          <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-3">Artisan Products</h3>
          <p className="text-gray-600 leading-relaxed mb-6">
            From farmhouse cheeses to artisan breads, we partner with local producers who create 
            exceptional products using traditional methods and quality ingredients.
          </p>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-8 mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Interested in Becoming a Supplier?</h2>
            <p className="text-gray-600 mb-4">
              We&apos;re always looking to work with new suppliers who share our values of quality, 
              sustainability, and local sourcing.
            </p>
            <a href="/contact" className="text-easymeals-green font-semibold hover:underline">
              Get in touch with us →
            </a>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
