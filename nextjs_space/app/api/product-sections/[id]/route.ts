
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const section = await prisma.productSection.findUnique({
      where: { id: params.id },
      include: {
        sectionProducts: {
          include: {
            product: true
          },
          orderBy: {
            displayOrder: 'asc'
          }
        }
      }
    })

    if (!section) {
      return NextResponse.json(
        { error: 'Section not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(section)
  } catch (error) {
    console.error('Error fetching product section:', error)
    return NextResponse.json(
      { error: 'Failed to fetch product section' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { name, title, description, isActive, displayOrder, maxProducts } = body

    const section = await prisma.productSection.update({
      where: { id: params.id },
      data: {
        name,
        title,
        description,
        isActive,
        displayOrder,
        maxProducts
      }
    })

    return NextResponse.json(section)
  } catch (error) {
    console.error('Error updating product section:', error)
    return NextResponse.json(
      { error: 'Failed to update product section' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.productSection.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting product section:', error)
    return NextResponse.json(
      { error: 'Failed to delete product section' },
      { status: 500 }
    )
  }
}
