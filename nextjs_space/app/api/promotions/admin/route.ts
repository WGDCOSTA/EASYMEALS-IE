

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || ((session.user as any).role !== 'ADMIN' && (session.user as any).role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const promotions = await prisma.promotion.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(promotions)
  } catch (error) {
    console.error('Error fetching promotions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch promotions' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || ((session.user as any).role !== 'ADMIN' && (session.user as any).role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()

    const promotion = await prisma.promotion.create({
      data: {
        title: data.title,
        description: data.description,
        code: data.code || null,
        discountType: data.discountType,
        discountValue: parseFloat(data.discountValue),
        minPurchase: data.minPurchase ? parseFloat(data.minPurchase) : null,
        maxDiscount: data.maxDiscount ? parseFloat(data.maxDiscount) : null,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        isActive: data.isActive !== undefined ? data.isActive : true,
        usageLimit: data.usageLimit ? parseInt(data.usageLimit) : null,
        targetAudience: data.targetAudience || 'all',
        applicableCategories: data.applicableCategories || [],
        imageUrl: data.imageUrl || null
      }
    })

    return NextResponse.json(promotion)
  } catch (error) {
    console.error('Error creating promotion:', error)
    return NextResponse.json(
      { error: 'Failed to create promotion' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || ((session.user as any).role !== 'ADMIN' && (session.user as any).role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()
    const { id, ...updateData } = data

    const promotion = await prisma.promotion.update({
      where: { id },
      data: {
        title: updateData.title,
        description: updateData.description,
        code: updateData.code || null,
        discountType: updateData.discountType,
        discountValue: parseFloat(updateData.discountValue),
        minPurchase: updateData.minPurchase ? parseFloat(updateData.minPurchase) : null,
        maxDiscount: updateData.maxDiscount ? parseFloat(updateData.maxDiscount) : null,
        startDate: new Date(updateData.startDate),
        endDate: new Date(updateData.endDate),
        isActive: updateData.isActive,
        usageLimit: updateData.usageLimit ? parseInt(updateData.usageLimit) : null,
        targetAudience: updateData.targetAudience,
        applicableCategories: updateData.applicableCategories,
        imageUrl: updateData.imageUrl || null
      }
    })

    return NextResponse.json(promotion)
  } catch (error) {
    console.error('Error updating promotion:', error)
    return NextResponse.json(
      { error: 'Failed to update promotion' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || ((session.user as any).role !== 'ADMIN' && (session.user as any).role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 })
    }

    await prisma.promotion.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting promotion:', error)
    return NextResponse.json(
      { error: 'Failed to delete promotion' },
      { status: 500 }
    )
  }
}
