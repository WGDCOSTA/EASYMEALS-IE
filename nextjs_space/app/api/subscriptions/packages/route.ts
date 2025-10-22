
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const packages = await prisma.subscriptionPackage.findMany({
      where: {
        isActive: true
      },
      include: {
        packageItems: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                imageUrl: true,
                price: true,
                salePrice: true
              }
            }
          }
        },
        _count: {
          select: {
            subscriptions: true
          }
        }
      },
      orderBy: [
        { isFeatured: 'desc' },
        { createdAt: 'desc' }
      ]
    })

    return NextResponse.json({ packages })
  } catch (error) {
    console.error('Error fetching subscription packages:', error)
    return NextResponse.json({ error: 'Failed to fetch packages' }, { status: 500 })
  }
}
