
import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-yellow-400 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">EM</span>
              </div>
              <span className="text-xl font-bold">EasyMeals.ie</span>
            </div>
            <p className="text-gray-400 mb-4">
              Fresh and frozen ready-made meals delivered to your door in Cork, Ireland. 
              Healthy, delicious, and convenient meal solutions for busy lifestyles.
            </p>
            <p className="text-sm text-gray-500">
              Delivery currently available in Cork City and surrounding areas.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/meals" className="text-gray-400 hover:text-white transition-colors">
                  Browse Meals
                </Link>
              </li>
              <li>
                <Link href="/subscriptions" className="text-gray-400 hover:text-white transition-colors">
                  Subscriptions
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li className="text-gray-400">Cork, Ireland</li>
              <li className="text-gray-400">Delivery: 4-6 days/week</li>
              <li className="text-gray-400">Fresh & Frozen Options</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-4 text-center text-sm text-gray-500">
          <p>&copy; 2025 EasyMeals.ie - Ready-made meals delivered fresh to Cork</p>
        </div>
      </div>
    </footer>
  )
}
