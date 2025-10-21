
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

    // Get all user orders
    const orders = await prisma.order.findMany({
      where: {
        userId: user.id,
        status: {
          in: ['DELIVERED', 'OUT_FOR_DELIVERY', 'PREPARING', 'CONFIRMED'],
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
                price: true,
                calories: true,
                protein: true,
                carbs: true,
                fat: true,
                category: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    // Calculate total orders and spending
    const totalOrders = orders.length
    const totalSpent = orders.reduce((sum, order) => sum + order.total, 0)
    const avgOrderValue = totalOrders > 0 ? totalSpent / totalOrders : 0

    // Find favorite products (most purchased)
    const productPurchaseCount: Record<
      string,
      { product: any; purchaseCount: number; totalQuantity: number }
    > = {}

    orders.forEach((order) => {
      order.orderItems.forEach((item) => {
        if (!productPurchaseCount[item.productId]) {
          productPurchaseCount[item.productId] = {
            product: item.product,
            purchaseCount: 0,
            totalQuantity: 0,
          }
        }
        productPurchaseCount[item.productId].purchaseCount++
        productPurchaseCount[item.productId].totalQuantity += item.quantity
      })
    })

    const favoriteProducts = Object.values(productPurchaseCount)
      .sort((a, b) => b.purchaseCount - a.purchaseCount)
      .slice(0, 5)

    // Calculate nutrition trends
    let totalCalories = 0
    let totalProtein = 0
    let categoryCounts: Record<string, number> = {}

    orders.forEach((order) => {
      order.orderItems.forEach((item) => {
        totalCalories += (item.product.calories || 0) * item.quantity
        totalProtein += (item.product.protein || 0) * item.quantity
        
        const category = item.product.category || 'OTHER'
        categoryCounts[category] = (categoryCounts[category] || 0) + 1
      })
    })

    const avgCaloriesPerOrder = totalOrders > 0 ? totalCalories / totalOrders : 0
    const avgProteinPerOrder = totalOrders > 0 ? totalProtein / totalOrders : 0
    const mostOrderedCategory =
      Object.entries(categoryCounts).sort(([, a], [, b]) => b - a)[0]?.[0] || 'HEALTHY'

    // Format recent orders
    const recentOrders = orders.slice(0, 5).map((order) => ({
      id: order.id,
      orderNumber: order.orderNumber,
      date: order.createdAt.toISOString(),
      total: order.total,
      itemCount: order.orderItems.reduce((sum, item) => sum + item.quantity, 0),
    }))

    const stats = {
      totalOrders,
      totalSpent,
      avgOrderValue,
      favoriteProducts,
      nutritionTrends: {
        avgCaloriesPerOrder: Math.round(avgCaloriesPerOrder),
        avgProteinPerOrder: Math.round(avgProteinPerOrder),
        mostOrderedCategory,
      },
      recentOrders,
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching order stats:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
