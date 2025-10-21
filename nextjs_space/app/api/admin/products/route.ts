
import { NextRequest, NextResponse } from 'next/server'
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

    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(products)
  } catch (error) {
    console.error('Products fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
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

    const product = await prisma.product.create({
      data: {
        name: data.name,
        description: data.description,
        shortDescription: data.shortDescription || null,
        price: data.price,
        imageUrl: data.imageUrl,
        category: data.category,
        storageType: data.storageType,
        stockQuantity: data.stockQuantity,
        isActive: data.isActive,
        allergens: data.allergens || [],
        calories: data.calories,
        protein: data.protein,
        carbs: data.carbs,
        fat: data.fat,
        preparationTime: data.preparationTime,
        servingSize: data.servingSize,
        ingredients: data.ingredients,
        sku: data.sku || null,
        weight: data.weight || null,
        dimensions: data.dimensions || null
      }
    })

    // Handle categories if provided
    if (data.categories && Array.isArray(data.categories)) {
      for (const categoryData of data.categories) {
        await prisma.productCategoryRelation.create({
          data: {
            productId: product.id,
            categoryId: categoryData.categoryId,
            isPrimary: categoryData.isPrimary || false
          }
        })
      }
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error('Product creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    )
  }
}
