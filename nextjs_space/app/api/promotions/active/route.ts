
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const currentDate = new Date()
    
    const promotions = await prisma.promotion.findMany({
      where: {
        isActive: true,
        startDate: {
          lte: currentDate
        },
        endDate: {
          gte: currentDate
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(promotions)
  } catch (error) {
    console.error('Error fetching active promotions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch promotions' },
      { status: 500 }
    )
  }
}
