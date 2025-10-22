
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const packages = await prisma.subscriptionPackage.findMany({
      include: {
        packageItems: {
          include: {
            product: true
          }
        },
        _count: {
          select: {
            subscriptions: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({ packages })
  } catch (error) {
    console.error('Error fetching subscription packages:', error)
    return NextResponse.json({ error: 'Failed to fetch packages' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()
    
    const packageData: any = {
      name: data.name,
      description: data.description,
      frequency: data.frequency,
      price: parseFloat(data.price),
      discountPercentage: data.discountPercentage ? parseInt(data.discountPercentage) : null,
      imageUrl: data.imageUrl,
      isActive: data.isActive ?? true,
      isFeatured: data.isFeatured ?? false,
      mealsPerWeek: data.mealsPerWeek ? parseInt(data.mealsPerWeek) : null,
      servingsPerMeal: data.servingsPerMeal ? parseInt(data.servingsPerMeal) : null,
      customizable: data.customizable ?? true,
      features: data.features || []
    }

    const newPackage = await prisma.subscriptionPackage.create({
      data: packageData,
      include: {
        packageItems: {
          include: {
            product: true
          }
        }
      }
    })

    // Add package items if provided
    if (data.packageItems && data.packageItems.length > 0) {
      await prisma.subscriptionPackageItem.createMany({
        data: data.packageItems.map((item: any) => ({
          packageId: newPackage.id,
          productId: item.productId,
          quantity: item.quantity || 1,
          isDefault: item.isDefault ?? true
        }))
      })
    }

    return NextResponse.json({ package: newPackage })
  } catch (error) {
    console.error('Error creating subscription package:', error)
    return NextResponse.json({ error: 'Failed to create package' }, { status: 500 })
  }
}
