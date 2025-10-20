
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || ((session.user as any).role !== 'ADMIN' && (session.user as any).role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()

    const zone = await prisma.deliveryZone.update({
      where: { id: params.id },
      data: {
        name: data.name,
        areas: data.areas,
        deliveryFee: data.deliveryFee,
        isActive: data.isActive
      }
    })

    return NextResponse.json(zone)
  } catch (error) {
    console.error('Delivery zone update error:', error)
    return NextResponse.json(
      { error: 'Failed to update delivery zone' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || ((session.user as any).role !== 'ADMIN' && (session.user as any).role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()

    const zone = await prisma.deliveryZone.update({
      where: { id: params.id },
      data
    })

    return NextResponse.json(zone)
  } catch (error) {
    console.error('Delivery zone patch error:', error)
    return NextResponse.json(
      { error: 'Failed to update delivery zone' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || ((session.user as any).role !== 'ADMIN' && (session.user as any).role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await prisma.deliveryZone.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delivery zone delete error:', error)
    return NextResponse.json(
      { error: 'Failed to delete delivery zone' },
      { status: 500 }
    )
  }
}
