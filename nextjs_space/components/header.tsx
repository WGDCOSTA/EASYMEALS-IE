
'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useSession, signOut } from 'next-auth/react'
import { ShoppingCart, Menu, X, User, LogOut, Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useCartStore } from '@/lib/store'

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userDropdownOpen, setUserDropdownOpen] = useState(false)
  const { data: session, status } = useSession() || {}
  const { items } = useCartStore()
  
  const itemCount = items?.reduce((total, item) => total + (item?.quantity || 0), 0) || 0

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/logo.png"
              alt="EasyMeals"
              width={160}
              height={80}
              className="h-16 w-auto"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            <Link href="/meals" className="px-4 py-2 text-gray-700 hover:text-easymeals-green transition-colors font-medium">
              Meals Plan
            </Link>
            <Link href="/how-it-works" className="px-4 py-2 text-gray-700 hover:text-easymeals-green transition-colors font-medium">
              How It Works
            </Link>
            <Link href="/recipes" className="px-4 py-2 text-gray-700 hover:text-easymeals-green transition-colors font-medium">
              Recipes
            </Link>
            <Link href="/contact" className="px-4 py-2 text-gray-700 hover:text-easymeals-green transition-colors font-medium">
              Help Center
            </Link>
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-2">
            {/* Wishlist */}
            <Link href="/profile">
              <Button variant="ghost" size="icon" className="relative hidden sm:inline-flex">
                <Heart className="h-5 w-5" />
              </Button>
            </Link>

            {/* Cart */}
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-easymeals-red text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
                    {itemCount}
                  </span>
                )}
              </Button>
            </Link>

            {/* Auth/User Menu */}
            {status === 'loading' ? (
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
              </div>
            ) : session?.user ? (
              <div className="relative">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="flex items-center space-x-2 hover:bg-gray-100"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  type="button"
                >
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">
                    {session.user?.firstName || session.user?.name?.split(' ')[0] || session.user?.email?.split('@')[0] || 'User'}
                  </span>
                </Button>
                
                {userDropdownOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-10" 
                      onClick={() => setUserDropdownOpen(false)}
                    ></div>
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg border border-gray-200 z-20">
                      <div className="py-1">
                        <Link 
                          href="/profile" 
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setUserDropdownOpen(false)}
                        >
                          Profile
                        </Link>
                        <Link 
                          href="/orders" 
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setUserDropdownOpen(false)}
                        >
                          Order History
                        </Link>
                        <Link 
                          href="/subscriptions" 
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setUserDropdownOpen(false)}
                        >
                          My Subscriptions
                        </Link>
                        {(session.user?.role === 'ADMIN' || session.user?.role === 'SUPER_ADMIN') && (
                          <Link 
                            href="/admin" 
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => setUserDropdownOpen(false)}
                          >
                            Admin Dashboard
                          </Link>
                        )}
                        <button
                          onClick={() => {
                            setUserDropdownOpen(false)
                            signOut({ callbackUrl: '/' })
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center"
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Button asChild size="sm" className="bg-easymeals-green hover:bg-easymeals-green/90 text-white rounded-full px-6">
                <Link href="/auth/signin">
                  <User className="h-4 w-4 mr-2" />
                  Sign In / Register
                </Link>
              </Button>
            )}

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t">
            <nav className="flex flex-col space-y-2">
              <Link
                href="/meals"
                className="px-2 py-2 text-gray-700 hover:text-easymeals-green hover:bg-gray-50 rounded-md transition-colors font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Meals Plan
              </Link>
              <Link
                href="/how-it-works"
                className="px-2 py-2 text-gray-700 hover:text-easymeals-green hover:bg-gray-50 rounded-md transition-colors font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                How It Works
              </Link>
              <Link
                href="/recipes"
                className="px-2 py-2 text-gray-700 hover:text-easymeals-green hover:bg-gray-50 rounded-md transition-colors font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Recipes
              </Link>
              <Link
                href="/contact"
                className="px-2 py-2 text-gray-700 hover:text-easymeals-green hover:bg-gray-50 rounded-md transition-colors font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Help Center
              </Link>
            </nav>
          </div>
        )}
      </div>

      {/* Category Navigation Bar */}
      <div className="bg-easymeals-charcoal text-white">
        <div className="container mx-auto max-w-7xl px-4">
          <nav className="flex items-center space-x-8 h-12 overflow-x-auto scrollbar-hide">
            <Link href="/meals?category=combos" className="whitespace-nowrap hover:text-easymeals-green transition-colors">
              Combos Meals
            </Link>
            <Link href="/meals?category=kids" className="whitespace-nowrap hover:text-easymeals-green transition-colors">
              Kids Meals
            </Link>
            <Link href="/meals?category=halal" className="whitespace-nowrap hover:text-easymeals-green transition-colors">
              Halal Meals
            </Link>
            <Link href="/meals?category=student" className="whitespace-nowrap hover:text-easymeals-green transition-colors">
              Student Life
            </Link>
            <Link href="/meals?category=fitness" className="whitespace-nowrap hover:text-easymeals-green transition-colors">
              Health, Fitness
            </Link>
            <Link href="/meals?category=busy" className="whitespace-nowrap hover:text-easymeals-green transition-colors">
              Busy Life & Easy Food
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}
