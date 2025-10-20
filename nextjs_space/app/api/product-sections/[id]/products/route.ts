
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { productId, displayOrder } = body

    const sectionProduct = await prisma.sectionProduct.create({
      data: {
        sectionId: params.id,
        productId,
        displayOrder: displayOrder || 0
      }
    })

    return NextResponse.json(sectionProduct)
  } catch (error) {
    console.error('Error adding product to section:', error)
    return NextResponse.json(
      { error: 'Failed to add product to section' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('productId')

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      )
    }

    await prisma.sectionProduct.deleteMany({
      where: {
        sectionId: params.id,
        productId
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error removing product from section:', error)
    return NextResponse.json(
      { error: 'Failed to remove product from section' },
      { status: 500 }
    )
  }
}
