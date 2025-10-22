
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

// GET single tag
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const tag = await prisma.$queryRaw<Array<any>>`
      SELECT * FROM tags WHERE id = ${params.id}
    `

    if (!tag || tag.length === 0) {
      return NextResponse.json({ error: 'Tag not found' }, { status: 404 })
    }

    return NextResponse.json(tag[0])
  } catch (error) {
    console.error('Error fetching tag:', error)
    return NextResponse.json({ error: 'Failed to fetch tag' }, { status: 500 })
  }
}

// PUT update tag
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || ((session.user as any).role !== 'SUPER_ADMIN' && (session.user as any).role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { name, slug, description, color, icon, isActive, displayOrder } = await request.json()

    await prisma.$executeRaw`
      UPDATE tags
      SET 
        name = ${name},
        slug = ${slug},
        description = ${description || null},
        color = ${color || '#1c7430'},
        icon = ${icon || null},
        "isActive" = ${isActive !== undefined ? isActive : true},
        "displayOrder" = ${displayOrder || 0},
        "updatedAt" = NOW()
      WHERE id = ${params.id}
    `

    return NextResponse.json({ success: true, message: 'Tag updated successfully' })
  } catch (error) {
    console.error('Error updating tag:', error)
    return NextResponse.json({ error: 'Failed to update tag' }, { status: 500 })
  }
}

// DELETE tag
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || ((session.user as any).role !== 'SUPER_ADMIN' && (session.user as any).role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Delete all product-tag relationships first
    await prisma.$executeRaw`
      DELETE FROM product_tags WHERE "tagId" = ${params.id}
    `

    // Delete the tag
    await prisma.$executeRaw`
      DELETE FROM tags WHERE id = ${params.id}
    `

    return NextResponse.json({ success: true, message: 'Tag deleted successfully' })
  } catch (error) {
    console.error('Error deleting tag:', error)
    return NextResponse.json({ error: 'Failed to delete tag' }, { status: 500 })
  }
}
