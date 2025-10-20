
import { NextResponse } from 'next/server'
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

    // Get current month and last month dates
    const now = new Date()
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const firstDayOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)

    // Revenue stats
    const currentMonthOrders = await prisma.order.aggregate({
      where: {
        createdAt: { gte: firstDayOfMonth },
        status: { notIn: ['CANCELLED'] }
      },
      _sum: { total: true },
      _count: true
    })

    const lastMonthOrders = await prisma.order.aggregate({
      where: {
        createdAt: { 
          gte: firstDayOfLastMonth,
          lt: firstDayOfMonth
        },
        status: { notIn: ['CANCELLED'] }
      },
      _sum: { total: true },
      _count: true
    })

    const currentRevenue = currentMonthOrders._sum.total || 0
    const lastRevenue = lastMonthOrders._sum.total || 0
    const revenueChange = lastRevenue > 0 ? ((currentRevenue - lastRevenue) / lastRevenue * 100) : 0

    // Order stats
    const totalOrders = await prisma.order.count()
    const pendingOrders = await prisma.order.count({
      where: { status: 'PENDING' }
    })
    const currentOrderCount = currentMonthOrders._count
    const lastOrderCount = lastMonthOrders._count
    const orderChange = lastOrderCount > 0 ? ((currentOrderCount - lastOrderCount) / lastOrderCount * 100) : 0

    // Customer stats
    const totalCustomers = await prisma.user.count({
      where: { role: 'USER' }
    })
    const newCustomers = await prisma.user.count({
      where: {
        role: 'USER',
        createdAt: { gte: firstDayOfMonth }
      }
    })

    // Product stats
    const totalProducts = await prisma.product.count({
      where: { isActive: true }
    })
    const lowStockProducts = await prisma.product.count({
      where: {
        isActive: true,
        stockQuantity: { lt: 10 }
      }
    })

    // Recent orders
    const recentOrders = await prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { name: true, email: true }
        }
      }
    })

    // Top products
    const topProducts = await prisma.product.findMany({
      take: 5,
      where: { isActive: true },
      include: {
        _count: {
          select: { orderItems: true }
        }
      },
      orderBy: {
        orderItems: {
          _count: 'desc'
        }
      }
    })

    return NextResponse.json({
      revenue: {
        total: currentRevenue,
        change: Math.round(revenueChange)
      },
      orders: {
        total: totalOrders,
        pending: pendingOrders,
        change: Math.round(orderChange)
      },
      customers: {
        total: totalCustomers,
        new: newCustomers
      },
      products: {
        total: totalProducts,
        lowStock: lowStockProducts
      },
      recentOrders,
      topProducts
    })
  } catch (error) {
    console.error('Dashboard stats error:', error)
    return NextResponse.json(
      { error: 'Failed to load dashboard stats' },
      { status: 500 }
    )
  }
}
