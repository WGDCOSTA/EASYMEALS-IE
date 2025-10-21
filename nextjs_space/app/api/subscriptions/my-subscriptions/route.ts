
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Get active subscriptions with items and product details
    const subscriptions = await prisma.subscription.findMany({
      where: {
        userId: user.id,
        status: 'ACTIVE',
        isActive: true,
      },
      include: {
        subscriptionItems: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                imageUrl: true,
                calories: true,
                protein: true,
                carbs: true,
                fat: true,
                price: true,
              },
            },
          },
        },
      },
      orderBy: {
        nextDeliveryDate: 'asc',
      },
    })

    const formattedSubscriptions = subscriptions.map((sub) => ({
      id: sub.id,
      frequency: sub.frequency,
      nextDeliveryDate: sub.nextDeliveryDate.toISOString(),
      deliveryAddress: sub.deliveryAddress,
      subscriptionItems: sub.subscriptionItems.map((item) => ({
        product: item.product,
        quantity: item.quantity,
      })),
    }))

    return NextResponse.json(formattedSubscriptions)
  } catch (error) {
    console.error('Error fetching subscriptions:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
