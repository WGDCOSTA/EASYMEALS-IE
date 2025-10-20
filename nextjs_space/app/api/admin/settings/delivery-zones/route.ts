
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || ((session.user as any).role !== 'ADMIN' && (session.user as any).role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const zones = await prisma.deliveryZone.findMany({
      orderBy: { name: 'asc' }
    })

    return NextResponse.json(zones)
  } catch (error) {
    console.error('Delivery zones fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch delivery zones' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || ((session.user as any).role !== 'ADMIN' && (session.user as any).role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()

    const zone = await prisma.deliveryZone.create({
      data: {
        name: data.name,
        areas: data.areas,
        deliveryFee: data.deliveryFee,
        isActive: data.isActive
      }
    })

    return NextResponse.json(zone)
  } catch (error) {
    console.error('Delivery zone creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create delivery zone' },
      { status: 500 }
    )
  }
}
