
'use client'

import { useEffect, useState } from 'react'
import { AlertCircle, Clock, TrendingDown, Zap, Users } from 'lucide-react'

interface CountdownTimerProps {
  targetDate: Date | string
}

export function CountdownTimer({ targetDate }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<{
    hours: number
    minutes: number
    seconds: number
  } | null>(null)

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(targetDate).getTime() - new Date().getTime()
      if (difference > 0) {
        return {
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        }
      }
      return null
    }

    setTimeLeft(calculateTimeLeft())
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    return () => clearInterval(timer)
  }, [targetDate])

  if (!timeLeft) return null

  return (
    <div className="flex items-center gap-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
      <Clock className="w-4 h-4" />
      <span>
        {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
      </span>
    </div>
  )
}

interface StockAlertProps {
  stockQuantity: number
  stockAlert?: number | null
}

export function StockAlert({ stockQuantity, stockAlert }: StockAlertProps) {
  if (!stockAlert || stockQuantity > stockAlert) return null

  return (
    <div className="flex items-center gap-2 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
      <AlertCircle className="w-4 h-4" />
      <span>Only {stockQuantity} left in stock!</span>
    </div>
  )
}

interface DiscountBadgeProps {
  discount?: number | null
  originalPrice?: number | null
  currentPrice: number
}

export function DiscountBadge({ discount, originalPrice, currentPrice }: DiscountBadgeProps) {
  const calculatedDiscount = discount || 
    (originalPrice ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100) : 0)

  if (!calculatedDiscount || calculatedDiscount <= 0) return null

  return (
    <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold z-10">
      -{calculatedDiscount}%
    </div>
  )
}

export function BestOfferBadge() {
  return (
    <div className="absolute top-4 left-4 bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full text-sm font-bold z-10 flex items-center gap-1">
      <TrendingDown className="w-4 h-4" />
      <span>Best Offer</span>
    </div>
  )
}

export function TopSaverBadge() {
  return (
    <div className="absolute top-4 left-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1 rounded-full text-sm font-bold z-10 flex items-center gap-1">
      <Zap className="w-4 h-4" />
      <span>Top Saver</span>
    </div>
  )
}

interface SocialProofProps {
  count: number
}

export function SocialProof({ count }: SocialProofProps) {
  return (
    <div className="flex items-center gap-1 text-sm text-gray-600">
      <Users className="w-4 h-4" />
      <span>{count}+ people bought this today</span>
    </div>
  )
}
