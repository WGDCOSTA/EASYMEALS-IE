
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="container mx-auto max-w-4xl px-4 py-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
        
        <div className="prose prose-lg max-w-none">
          <p className="text-sm text-gray-500 mb-8">Last updated: January 2025</p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">1. Introduction</h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            At EasyMeals.ie, we take your privacy seriously. This Privacy Policy explains how we collect, 
            use, disclose, and safeguard your information when you use our service.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. Information We Collect</h2>
          <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">Personal Information</h3>
          <p className="text-gray-600 leading-relaxed mb-4">
            We collect information that you provide directly to us, including:
          </p>
          <ul className="list-disc pl-6 space-y-2 mb-6">
            <li className="text-gray-600">Name and contact information</li>
            <li className="text-gray-600">Delivery address</li>
            <li className="text-gray-600">Payment information</li>
            <li className="text-gray-600">Dietary preferences and allergen information</li>
            <li className="text-gray-600">Order history</li>
          </ul>

          <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">Automatically Collected Information</h3>
          <p className="text-gray-600 leading-relaxed mb-6">
            We automatically collect certain information when you visit our website, including IP address, 
            browser type, device information, and usage data.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. How We Use Your Information</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            We use the information we collect to:
          </p>
          <ul className="list-disc pl-6 space-y-2 mb-6">
            <li className="text-gray-600">Process and deliver your orders</li>
            <li className="text-gray-600">Communicate with you about your orders</li>
            <li className="text-gray-600">Provide customer support</li>
            <li className="text-gray-600">Send marketing communications (with your consent)</li>
            <li className="text-gray-600">Improve our service and website</li>
            <li className="text-gray-600">Prevent fraud and enhance security</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">4. Sharing Your Information</h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            We do not sell your personal information. We may share your information with:
          </p>
          <ul className="list-disc pl-6 space-y-2 mb-6">
            <li className="text-gray-600">Delivery partners to fulfill your orders</li>
            <li className="text-gray-600">Payment processors to handle transactions</li>
            <li className="text-gray-600">Service providers who assist with our operations</li>
            <li className="text-gray-600">Law enforcement when required by law</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">5. Data Security</h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            We implement appropriate technical and organizational measures to protect your personal 
            information. However, no method of transmission over the internet is 100% secure.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">6. Your Rights (GDPR)</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            Under GDPR, you have the right to:
          </p>
          <ul className="list-disc pl-6 space-y-2 mb-6">
            <li className="text-gray-600">Access your personal data</li>
            <li className="text-gray-600">Correct inaccurate data</li>
            <li className="text-gray-600">Request deletion of your data</li>
            <li className="text-gray-600">Object to processing of your data</li>
            <li className="text-gray-600">Data portability</li>
            <li className="text-gray-600">Withdraw consent</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">7. Cookies</h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            We use cookies and similar tracking technologies to enhance your experience on our website. 
            You can control cookie settings through your browser preferences.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">8. Children&apos;s Privacy</h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            Our service is not directed to children under 16. We do not knowingly collect personal 
            information from children under 16.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">9. Changes to Privacy Policy</h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            We may update this Privacy Policy from time to time. We will notify you of any changes by 
            posting the new Privacy Policy on this page.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">10. Contact Us</h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            If you have questions about this Privacy Policy or wish to exercise your rights, please 
            contact us through our Contact page.
          </p>
        </div>
      </div>

      <Footer />
    </div>
  )
}
