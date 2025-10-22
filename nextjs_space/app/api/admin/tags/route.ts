
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

// GET all tags
export async function GET() {
  try {
    const tags = await prisma.$queryRaw<Array<{
      id: string
      name: string
      slug: string
      description: string | null
      color: string
      icon: string | null
      displayOrder: number
      isActive: boolean
      productCount: bigint
    }>>`
      SELECT t.*, COUNT(DISTINCT pt."productId")::bigint as "productCount"
      FROM tags t
      LEFT JOIN product_tags pt ON pt."tagId" = t.id
      GROUP BY t.id
      ORDER BY t."displayOrder" ASC, t.name ASC
    `

    const tagsWithCount = tags.map(tag => ({
      ...tag,
      productCount: Number(tag.productCount)
    }))

    return NextResponse.json(tagsWithCount)
  } catch (error) {
    console.error('Error fetching tags:', error)
    return NextResponse.json({ error: 'Failed to fetch tags' }, { status: 500 })
  }
}

// POST create new tag
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || ((session.user as any).role !== 'SUPER_ADMIN' && (session.user as any).role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { name, slug, description, color, icon } = await request.json()

    if (!name || !slug) {
      return NextResponse.json({ error: 'Name and slug are required' }, { status: 400 })
    }

    // Check for duplicate slug
    const existing = await prisma.$queryRaw<Array<{ count: bigint }>>`
      SELECT COUNT(*)::bigint as count FROM tags WHERE slug = ${slug}
    `
    
    if (Number(existing[0].count) > 0) {
      return NextResponse.json({ error: 'Tag with this slug already exists' }, { status: 409 })
    }

    const tag = await prisma.$executeRaw`
      INSERT INTO tags (id, name, slug, description, color, icon, "createdAt", "updatedAt")
      VALUES (
        ${`tag_${Date.now()}`},
        ${name},
        ${slug},
        ${description || null},
        ${color || '#1c7430'},
        ${icon || null},
        NOW(),
        NOW()
      )
    `

    return NextResponse.json({ success: true, message: 'Tag created successfully' })
  } catch (error) {
    console.error('Error creating tag:', error)
    return NextResponse.json({ error: 'Failed to create tag' }, { status: 500 })
  }
}
