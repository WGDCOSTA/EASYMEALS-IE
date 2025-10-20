
'use client'

import { useState } from 'react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { ChevronDown } from 'lucide-react'

interface FAQItem {
  question: string
  answer: string
  category: string
}

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const faqs: FAQItem[] = [
    {
      category: 'Orders & Delivery',
      question: 'What areas do you deliver to?',
      answer: 'We currently deliver throughout Ireland and Northern Ireland. During checkout, you can enter your postcode to check if we deliver to your area.'
    },
    {
      category: 'Orders & Delivery',
      question: 'When will my order arrive?',
      answer: 'Delivery schedules vary by area. You can select your preferred delivery day during checkout. We deliver 4-6 days per week depending on your location.'
    },
    {
      category: 'Orders & Delivery',
      question: 'Do I need to be home for delivery?',
      answer: 'No! Our insulated packaging keeps meals fresh for up to 24 hours. We can leave your order in a safe place you specify.'
    },
    {
      category: 'Meals & Menu',
      question: 'What type of meals do you offer?',
      answer: 'We offer both frozen and fresh chilled meals. Our menu includes options for various dietary needs including vegetarian, halal, low-carb, and family-friendly meals.'
    },
    {
      category: 'Meals & Menu',
      question: 'How long do meals last?',
      answer: 'Frozen meals can be stored at ≤-18°C for up to 3 months. Fresh chilled meals should be consumed within 3-5 days when stored at 0-5°C.'
    },
    {
      category: 'Meals & Menu',
      question: 'Do you cater to dietary restrictions?',
      answer: 'Yes! We offer meals for various dietary needs. All our meals are clearly labelled with allergen information and nutritional details.'
    },
    {
      category: 'Account & Subscription',
      question: 'How do subscriptions work?',
      answer: 'Subscriptions automatically renew based on your chosen plan (weekly, bi-weekly, or monthly). You can pause, skip, or cancel anytime through your account.'
    },
    {
      category: 'Account & Subscription',
      question: 'Can I pause my subscription?',
      answer: 'Yes! You can pause your subscription for up to 8 weeks. Simply go to your account settings and select the pause option.'
    },
    {
      category: 'Account & Subscription',
      question: 'How do I cancel my subscription?',
      answer: 'You can cancel anytime through your account settings. There are no cancellation fees or penalties.'
    },
    {
      category: 'Payment & Pricing',
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit and debit cards including Visa, Mastercard, and American Express.'
    },
    {
      category: 'Payment & Pricing',
      question: 'Is delivery free?',
      answer: 'Delivery is free for most orders. Small fees may apply for Made Fresh plans with 5-6 meals.'
    },
    {
      category: 'Payment & Pricing',
      question: 'Do you offer gift cards?',
      answer: 'Yes! Gift cards are available in various amounts and never expire. They make perfect gifts for any occasion.'
    }
  ]

  const categories = Array.from(new Set(faqs.map(faq => faq.category)))

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="container mx-auto max-w-4xl px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h1>
          <p className="text-xl text-gray-600">
            Find answers to common questions about our service
          </p>
        </div>

        {categories.map((category) => (
          <div key={category} className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{category}</h2>
            <div className="space-y-4">
              {faqs
                .filter((faq) => faq.category === category)
                .map((faq, index) => {
                  const globalIndex = faqs.indexOf(faq)
                  const isOpen = openIndex === globalIndex

                  return (
                    <div
                      key={globalIndex}
                      className="border border-gray-200 rounded-xl overflow-hidden hover:border-easymeals-green transition-colors"
                    >
                      <button
                        onClick={() => setOpenIndex(isOpen ? null : globalIndex)}
                        className="w-full px-6 py-4 text-left flex justify-between items-center bg-white hover:bg-gray-50"
                      >
                        <span className="font-semibold text-gray-900 pr-8">{faq.question}</span>
                        <ChevronDown
                          className={`w-5 h-5 text-gray-500 flex-shrink-0 transition-transform ${
                            isOpen ? 'transform rotate-180' : ''
                          }`}
                        />
                      </button>
                      {isOpen && (
                        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                          <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                        </div>
                      )}
                    </div>
                  )
                })}
            </div>
          </div>
        ))}

        <div className="mt-16 bg-gradient-to-br from-green-50 to-green-100 rounded-3xl p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Still Have Questions?</h2>
          <p className="text-gray-600 mb-6">
            Can&apos;t find the answer you&apos;re looking for? Our customer support team is here to help!
          </p>
          <a
            href="/contact"
            className="inline-block bg-easymeals-green hover:bg-easymeals-green/90 text-white font-semibold px-8 py-3 rounded-full transition-colors"
          >
            Contact Us
          </a>
        </div>
      </div>

      <Footer />
    </div>
  )
}
