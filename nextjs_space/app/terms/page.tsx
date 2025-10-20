
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="container mx-auto max-w-4xl px-4 py-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Terms of Service</h1>
        
        <div className="prose prose-lg max-w-none">
          <p className="text-sm text-gray-500 mb-8">Last updated: January 2025</p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">1. Acceptance of Terms</h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            By accessing and using EasyMeals.ie, you accept and agree to be bound by the terms and provisions 
            of this agreement. If you do not agree to these terms, please do not use our service.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. Service Description</h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            EasyMeals.ie provides meal delivery services throughout Ireland and Northern Ireland. We offer 
            both fresh chilled and frozen meal options that are prepared in our commercial kitchen and 
            delivered to your specified address.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. Orders and Payments</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            • All orders are subject to availability and acceptance by EasyMeals.ie
          </p>
          <p className="text-gray-600 leading-relaxed mb-4">
            • Prices are in Euros (€) and include VAT where applicable
          </p>
          <p className="text-gray-600 leading-relaxed mb-6">
            • Payment must be made at the time of ordering through our secure payment system
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">4. Delivery</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            • Delivery times are estimates and not guaranteed
          </p>
          <p className="text-gray-600 leading-relaxed mb-4">
            • You must provide accurate delivery information
          </p>
          <p className="text-gray-600 leading-relaxed mb-6">
            • Someone must be available to receive the delivery or meals will be left in a safe location
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">5. Subscriptions</h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            Subscription services renew automatically unless cancelled. You may cancel, pause, or modify 
            your subscription at any time through your account settings or by contacting customer service.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">6. Cancellations and Refunds</h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            Orders may be cancelled up to 48 hours before scheduled delivery for a full refund. After this 
            time, orders cannot be cancelled as ingredients have been purchased and meals prepared.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">7. Food Safety</h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            All meals must be stored according to instructions provided. Frozen meals must be stored at 
            ≤-18°C and chilled meals at 0-5°C. We are not responsible for meals that have not been stored correctly.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">8. Allergens</h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            While we provide allergen information, meals may contain traces of allergens due to shared 
            kitchen facilities. If you have severe allergies, please contact us before ordering.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">9. Limitation of Liability</h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            EasyMeals.ie shall not be liable for any indirect, incidental, special, or consequential damages 
            arising out of or in connection with our service.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">10. Changes to Terms</h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            We reserve the right to modify these terms at any time. Changes will be effective immediately 
            upon posting to the website.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">11. Contact Information</h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            If you have any questions about these Terms of Service, please contact us through our Contact page.
          </p>
        </div>
      </div>

      <Footer />
    </div>
  )
}
