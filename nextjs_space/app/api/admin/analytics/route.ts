
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

    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const weekAgo = new Date(today)
    weekAgo.setDate(weekAgo.getDate() - 7)
    const monthAgo = new Date(today)
    monthAgo.setDate(monthAgo.getDate() - 30)
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0)

    // Revenue stats
    const todayRevenue = await prisma.order.aggregate({
      where: {
        createdAt: { gte: today },
        status: { notIn: ['CANCELLED'] }
      },
      _sum: { total: true }
    })

    const weekRevenue = await prisma.order.aggregate({
      where: {
        createdAt: { gte: weekAgo },
        status: { notIn: ['CANCELLED'] }
      },
      _sum: { total: true }
    })

    const monthRevenue = await prisma.order.aggregate({
      where: {
        createdAt: { gte: monthAgo },
        status: { notIn: ['CANCELLED'] }
      },
      _sum: { total: true }
    })

    const lastMonthRevenue = await prisma.order.aggregate({
      where: {
        createdAt: { 
          gte: lastMonthStart,
          lte: lastMonthEnd
        },
        status: { notIn: ['CANCELLED'] }
      },
      _sum: { total: true }
    })

    // Sales by day (last 30 days)
    const salesByDay = await prisma.$queryRaw`
      SELECT 
        DATE(created_at) as date,
        SUM(total)::float as total
      FROM orders
      WHERE created_at >= ${monthAgo}
        AND status != 'CANCELLED'
      GROUP BY DATE(created_at)
      ORDER BY date DESC
    ` as { date: Date; total: number }[]

    // Sales by category
    const salesByCategory = await prisma.$queryRaw`
      SELECT 
        p.category,
        SUM(oi.price * oi.quantity)::float as total,
        COUNT(DISTINCT o.id)::int as count
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      JOIN orders o ON oi.order_id = o.id
      WHERE o.status != 'CANCELLED'
      GROUP BY p.category
      ORDER BY total DESC
    ` as { category: string; total: number; count: number }[]

    // Top customers
    const topCustomers = await prisma.user.findMany({
      where: {
        role: 'USER',
        orders: {
          some: {
            status: { notIn: ['CANCELLED'] }
          }
        }
      },
      select: {
        name: true,
        email: true,
        orders: {
          where: {
            status: { notIn: ['CANCELLED'] }
          },
          select: {
            total: true
          }
        }
      },
      take: 10
    })

    const topCustomersFormatted = topCustomers
      .map(customer => ({
        name: customer.name || 'Guest',
        email: customer.email,
        total: customer.orders.reduce((sum, order) => sum + order.total, 0),
        orderCount: customer.orders.length
      }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 5)

    return NextResponse.json({
      revenueStats: {
        today: todayRevenue._sum.total || 0,
        thisWeek: weekRevenue._sum.total || 0,
        thisMonth: monthRevenue._sum.total || 0,
        lastMonth: lastMonthRevenue._sum.total || 0
      },
      salesByDay: salesByDay.map(d => ({
        date: d.date.toISOString(),
        total: d.total
      })),
      salesByCategory,
      topCustomers: topCustomersFormatted
    })
  } catch (error) {
    console.error('Analytics fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    )
  }
}
