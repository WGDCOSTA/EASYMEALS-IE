
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

    // Get delivered orders from the last 7 days
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const deliveredOrders = await prisma.order.findMany({
      where: {
        userId: user.id,
        status: 'DELIVERED',
        updatedAt: {
          gte: sevenDaysAgo,
        },
      },
      include: {
        orderItems: {
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
              },
            },
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    })

    // Get meal plans for the last 7 days to check which orders are already tracked
    const mealPlans = await prisma.mealPlan.findMany({
      where: {
        userId: user.id,
        date: {
          gte: sevenDaysAgo,
        },
      },
      include: {
        meals: {
          select: {
            productId: true,
          },
        },
      },
    })

    // Get all product IDs that are already in meal plans
    const trackedProductIds = new Set(
      mealPlans.flatMap((plan) => plan.meals.map((meal) => meal.productId))
    )

    // Filter orders that have items not yet in meal plans
    const untrackedOrders = deliveredOrders.filter((order) => {
      return order.orderItems.some((item) => !trackedProductIds.has(item.productId))
    })

    // Format response
    const formattedOrders = untrackedOrders.map((order) => ({
      id: order.id,
      orderNumber: order.orderNumber,
      deliveredAt: order.updatedAt.toISOString(),
      items: order.orderItems.map((item) => ({
        id: item.id,
        productId: item.productId,
        quantity: item.quantity,
        product: item.product,
      })),
    }))

    return NextResponse.json(formattedOrders)
  } catch (error) {
    console.error('Error fetching delivered untracked orders:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
