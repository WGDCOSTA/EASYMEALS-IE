
import Link from 'next/link'
import Image from 'next/image'

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto max-w-7xl px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block mb-4">
              <Image
                src="/logo.png"
                alt="EasyMeals"
                width={120}
                height={60}
                className="h-12 w-auto brightness-0 invert"
              />
            </Link>
            <p className="text-gray-400 mb-4 leading-relaxed">
              Fresh and frozen ready-made meals delivered to your door throughout Ireland and Northern Ireland. 
              Healthy, delicious, and convenient meal solutions for busy lifestyles.
            </p>
          </div>

          {/* About & Info */}
          <div>
            <h3 className="font-bold text-lg mb-4">Company</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="text-gray-400 hover:text-easymeals-green transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/recipes" className="text-gray-400 hover:text-easymeals-green transition-colors">
                  Discover Recipes
                </Link>
              </li>
              <li>
                <Link href="/suppliers" className="text-gray-400 hover:text-easymeals-green transition-colors">
                  Our Suppliers
                </Link>
              </li>
              <li>
                <Link href="/packaging" className="text-gray-400 hover:text-easymeals-green transition-colors">
                  Packaging
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="text-gray-400 hover:text-easymeals-green transition-colors">
                  How It Works
                </Link>
              </li>
            </ul>
          </div>

          {/* Shop */}
          <div>
            <h3 className="font-bold text-lg mb-4">Shop</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/meals" className="text-gray-400 hover:text-easymeals-green transition-colors">
                  Meal Kit Delivery
                </Link>
              </li>
              <li>
                <Link href="/meals?type=fresh" className="text-gray-400 hover:text-easymeals-green transition-colors">
                  Made Fresh
                </Link>
              </li>
              <li>
                <Link href="/meals?type=frozen" className="text-gray-400 hover:text-easymeals-green transition-colors">
                  Frozen Meals
                </Link>
              </li>
              <li>
                <Link href="/subscriptions" className="text-gray-400 hover:text-easymeals-green transition-colors">
                  Subscribe Online
                </Link>
              </li>
              <li>
                <Link href="/gift-cards" className="text-gray-400 hover:text-easymeals-green transition-colors">
                  Gift Cards
                </Link>
              </li>
              <li>
                <Link href="/gift-cards/redeem" className="text-gray-400 hover:text-easymeals-green transition-colors">
                  Redeem Gift Card
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-bold text-lg mb-4">Support</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-easymeals-green transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-400 hover:text-easymeals-green transition-colors">
                  FAQs
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-easymeals-green transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-400 hover:text-easymeals-green transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-400 hover:text-easymeals-green transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-500 mb-4 md:mb-0">
              &copy; 2025 EasyMeals.ie - Ready-made meals delivered fresh throughout Ireland
            </p>
            <div className="flex space-x-6">
              <Link href="/terms" className="text-sm text-gray-500 hover:text-easymeals-green transition-colors">
                Terms
              </Link>
              <Link href="/privacy" className="text-sm text-gray-500 hover:text-easymeals-green transition-colors">
                Privacy
              </Link>
              <Link href="/faq" className="text-sm text-gray-500 hover:text-easymeals-green transition-colors">
                FAQs
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
