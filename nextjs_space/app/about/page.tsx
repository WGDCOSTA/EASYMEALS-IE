
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import Image from 'next/image'
import { getPageContent } from '@/lib/page-content'

export default async function AboutPage() {
  const pageContent = await getPageContent('about')
  
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="container mx-auto max-w-4xl px-4 py-16">
        <h1 className="text-5xl font-bold text-gray-900 mb-8">{pageContent.title || 'About Us'}</h1>
        
        <div className="prose prose-lg max-w-none">
          <p className="text-xl text-gray-600 leading-relaxed mb-6">
            {pageContent.content || "Welcome to EasyMeals.ie, Ireland's premier meal delivery service bringing fresh, delicious, and nutritious meals straight to your door."}
          </p>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-4">Our Story</h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            Founded with a passion for good food and healthy living, EasyMeals.ie was created to solve 
            a simple problem: how do busy people maintain a healthy diet without spending hours in the 
            kitchen? We believe that everyone deserves access to fresh, high-quality meals that are both 
            convenient and affordable.
          </p>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-4">Our Mission</h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            Our mission is to make healthy eating easy and accessible for everyone across Ireland and 
            Northern Ireland. We work with local suppliers to source the finest ingredients and prepare 
            meals that are nutritious, delicious, and ready when you need them.
          </p>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-4">What Sets Us Apart</h2>
          <ul className="space-y-3 mb-6">
            <li className="flex items-start">
              <span className="text-easymeals-green mr-2">•</span>
              <span className="text-gray-600"><strong>Fresh & Local:</strong> We source our ingredients from trusted Irish suppliers</span>
            </li>
            <li className="flex items-start">
              <span className="text-easymeals-green mr-2">•</span>
              <span className="text-gray-600"><strong>Flexible Options:</strong> Choose from frozen or fresh chilled meals to suit your lifestyle</span>
            </li>
            <li className="flex items-start">
              <span className="text-easymeals-green mr-2">•</span>
              <span className="text-gray-600"><strong>Variety:</strong> Over 20 new recipes each week to keep things exciting</span>
            </li>
            <li className="flex items-start">
              <span className="text-easymeals-green mr-2">•</span>
              <span className="text-gray-600"><strong>Quality Guaranteed:</strong> Every meal is prepared with care and attention to detail</span>
            </li>
          </ul>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-4">Our Commitment</h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            We&apos;re committed to sustainability, supporting local businesses, and providing exceptional 
            customer service. Our packaging is designed to be recyclable, and we&apos;re constantly working 
            to reduce our environmental impact.
          </p>

          <p className="text-xl text-gray-900 font-semibold mt-12">
            Thank you for choosing EasyMeals.ie. We&apos;re excited to be part of your healthy eating journey!
          </p>
        </div>
      </div>

      <Footer />
    </div>
  )
}
