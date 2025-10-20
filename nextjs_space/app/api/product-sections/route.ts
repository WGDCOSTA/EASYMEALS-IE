
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const sections = await prisma.productSection.findMany({
      where: { isActive: true },
      include: {
        sectionProducts: {
          include: {
            product: true
          },
          orderBy: {
            displayOrder: 'asc'
          }
        }
      },
      orderBy: {
        displayOrder: 'asc'
      }
    })

    return NextResponse.json(sections)
  } catch (error) {
    console.error('Error fetching product sections:', error)
    return NextResponse.json(
      { error: 'Failed to fetch product sections' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, slug, title, description, maxProducts } = body

    const section = await prisma.productSection.create({
      data: {
        name,
        slug,
        title,
        description,
        maxProducts: maxProducts || 10
      }
    })

    return NextResponse.json(section)
  } catch (error) {
    console.error('Error creating product section:', error)
    return NextResponse.json(
      { error: 'Failed to create product section' },
      { status: 500 }
    )
  }
}
