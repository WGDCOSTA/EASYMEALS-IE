
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await context.params

    const pkg = await prisma.subscriptionPackage.findUnique({
      where: { id },
      include: {
        packageItems: {
          include: {
            product: true
          }
        }
      }
    })

    if (!pkg) {
      return NextResponse.json({ error: 'Package not found' }, { status: 404 })
    }

    return NextResponse.json({ package: pkg })
  } catch (error) {
    console.error('Error fetching subscription package:', error)
    return NextResponse.json({ error: 'Failed to fetch package' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await context.params
    const data = await request.json()

    const packageData: any = {
      name: data.name,
      description: data.description,
      frequency: data.frequency,
      price: parseFloat(data.price),
      discountPercentage: data.discountPercentage ? parseInt(data.discountPercentage) : null,
      imageUrl: data.imageUrl,
      isActive: data.isActive,
      isFeatured: data.isFeatured,
      mealsPerWeek: data.mealsPerWeek ? parseInt(data.mealsPerWeek) : null,
      servingsPerMeal: data.servingsPerMeal ? parseInt(data.servingsPerMeal) : null,
      customizable: data.customizable,
      features: data.features || []
    }

    // Update package items if provided
    if (data.packageItems) {
      // Delete existing items
      await prisma.subscriptionPackageItem.deleteMany({
        where: { packageId: id }
      })

      // Create new items
      if (data.packageItems.length > 0) {
        await prisma.subscriptionPackageItem.createMany({
          data: data.packageItems.map((item: any) => ({
            packageId: id,
            productId: item.productId,
            quantity: item.quantity || 1,
            isDefault: item.isDefault ?? true
          }))
        })
      }
    }

    const updatedPackage = await prisma.subscriptionPackage.update({
      where: { id },
      data: packageData,
      include: {
        packageItems: {
          include: {
            product: true
          }
        }
      }
    })

    return NextResponse.json({ package: updatedPackage })
  } catch (error) {
    console.error('Error updating subscription package:', error)
    return NextResponse.json({ error: 'Failed to update package' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await context.params

    await prisma.subscriptionPackage.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting subscription package:', error)
    return NextResponse.json({ error: 'Failed to delete package' }, { status: 500 })
  }
}
