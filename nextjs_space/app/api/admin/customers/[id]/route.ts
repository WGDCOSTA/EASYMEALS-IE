

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || ((session.user as any).role !== 'ADMIN' && (session.user as any).role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const customer = await prisma.user.findUnique({
      where: { id: params.id },
      include: {
        subscriptions: true
      }
    })

    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 })
    }

    // Fetch orders separately
    const orders = await prisma.order.findMany({
      where: { userId: params.id },
      include: {
        orderItems: {
          include: {
            product: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Calculate customer stats
    const totalOrders = orders.length
    const totalSpent = orders.reduce((sum: number, order: any) => sum + order.total, 0)
    const avgOrderValue = totalOrders > 0 ? totalSpent / totalOrders : 0
    
    const ordersByStatus = orders.reduce((acc: Record<string, number>, order: any) => {
      acc[order.status] = (acc[order.status] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // Get favorite products
    const productCounts = orders.flatMap((order: any) => order.orderItems)
      .reduce((acc: Record<string, number>, item: any) => {
        const productId = item.productId
        acc[productId] = (acc[productId] || 0) + item.quantity
        return acc
      }, {} as Record<string, number>)

    const favoriteProducts = Object.entries(productCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([productId, count]) => {
        const order = orders.find((o: any) => o.orderItems.some((i: any) => i.productId === productId))
        const item = order?.orderItems.find((i: any) => i.productId === productId)
        return {
          product: item?.product,
          orderCount: count
        }
      })
      .filter(item => item.product)

    return NextResponse.json({
      customer: {
        id: customer.id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        address: customer.address,
        firstName: customer.firstName,
        lastName: customer.lastName,
        role: customer.role,
        createdAt: customer.createdAt
      },
      stats: {
        totalOrders,
        totalSpent,
        avgOrderValue,
        ordersByStatus
      },
      recentOrders: orders.slice(0, 10),
      subscriptions: customer.subscriptions,
      favoriteProducts
    })
  } catch (error) {
    console.error('Error fetching customer details:', error)
    return NextResponse.json(
      { error: 'Failed to fetch customer details' },
      { status: 500 }
    )
  }
}
