
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()
    const { packageId, deliveryAddress, deliveryZoneId, customItems } = data

    // Get package details
    const pkg = await prisma.subscriptionPackage.findUnique({
      where: { id: packageId },
      include: {
        packageItems: true
      }
    })

    if (!pkg) {
      return NextResponse.json({ error: 'Package not found' }, { status: 404 })
    }

    // Calculate next delivery date (7 or 14 days from now based on frequency)
    const daysToAdd = pkg.frequency === 'WEEKLY' ? 7 : 14
    const nextDeliveryDate = new Date()
    nextDeliveryDate.setDate(nextDeliveryDate.getDate() + daysToAdd)

    // Create subscription
    const subscription = await prisma.subscription.create({
      data: {
        userId: (session.user as any).id,
        packageId: packageId,
        frequency: pkg.frequency,
        status: 'ACTIVE',
        nextDeliveryDate,
        deliveryAddress: deliveryAddress || '',
        deliveryZoneId: deliveryZoneId || null,
        isActive: true
      }
    })

    // Add subscription items
    const items = customItems && customItems.length > 0 
      ? customItems 
      : pkg.packageItems.map(item => ({
          productId: item.productId,
          quantity: item.quantity
        }))

    await prisma.subscriptionItem.createMany({
      data: items.map((item: { productId: string; quantity: number }) => ({
        subscriptionId: subscription.id,
        productId: item.productId,
        quantity: item.quantity || 1
      }))
    })

    // Fetch the complete subscription with items
    const completeSubscription = await prisma.subscription.findUnique({
      where: { id: subscription.id },
      include: {
        package: true,
        subscriptionItems: {
          include: {
            product: true
          }
        }
      }
    })

    return NextResponse.json({ subscription: completeSubscription })
  } catch (error) {
    console.error('Error creating subscription:', error)
    return NextResponse.json({ error: 'Failed to create subscription' }, { status: 500 })
  }
}
