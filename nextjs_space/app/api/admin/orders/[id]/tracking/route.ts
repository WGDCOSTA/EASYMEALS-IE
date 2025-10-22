

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || ((session.user as any).role !== 'ADMIN' && (session.user as any).role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()
    const {
      trackingNumber,
      trackingUrl,
      courierName,
      estimatedDeliveryDate,
      actualDeliveryDate
    } = data

    const order = await prisma.order.update({
      where: { id: params.id },
      data: {
        trackingNumber,
        trackingUrl,
        courierName,
        estimatedDeliveryDate: estimatedDeliveryDate ? new Date(estimatedDeliveryDate) : null,
        actualDeliveryDate: actualDeliveryDate ? new Date(actualDeliveryDate) : null,
        updatedAt: new Date()
      }
    })

    // Create history entry
    await prisma.orderHistory.create({
      data: {
        orderId: params.id,
        status: order.status,
        notes: `Tracking information updated: ${courierName || 'Courier'} - ${trackingNumber || 'N/A'}`,
        createdBy: session.user.id
      }
    })

    return NextResponse.json(order)
  } catch (error) {
    console.error('Tracking update error:', error)
    return NextResponse.json(
      { error: 'Failed to update tracking information' },
      { status: 500 }
    )
  }
}
