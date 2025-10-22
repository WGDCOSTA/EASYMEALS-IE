
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

// GET all pages
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || ((session.user as any).role !== 'SUPER_ADMIN' && (session.user as any).role !== 'ADMIN')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const pages = await prisma.pageContent.findMany({
      orderBy: { updatedAt: 'desc' }
    })

    return NextResponse.json({ 
      pages: pages.map(p => ({
        id: p.id,
        page: p.page,
        title: (p.content as any)?.title || p.page,
        slug: (p.content as any)?.slug || p.page,
        status: (p.content as any)?.status || 'published',
        createdAt: p.createdAt.toISOString(),
        updatedAt: p.updatedAt.toISOString()
      }))
    })
  } catch (error) {
    console.error('Error loading pages:', error)
    return NextResponse.json(
      { error: 'Failed to load pages' },
      { status: 500 }
    )
  }
}

// POST create new page
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || ((session.user as any).role !== 'SUPER_ADMIN' && (session.user as any).role !== 'ADMIN')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { title, slug, status } = await request.json()

    if (!title || !slug) {
      return NextResponse.json(
        { error: 'Title and slug are required' },
        { status: 400 }
      )
    }

    // Check if slug already exists
    const existing = await prisma.pageContent.findUnique({
      where: { page: slug }
    })

    if (existing) {
      return NextResponse.json(
        { error: 'A page with this slug already exists' },
        { status: 409 }
      )
    }

    const page = await prisma.pageContent.create({
      data: {
        page: slug,
        content: {
          title,
          slug,
          status: status || 'draft',
          blocks: []
        }
      }
    })

    return NextResponse.json({ 
      success: true,
      page: {
        id: page.id,
        page: page.page,
        title,
        slug,
        status: status || 'draft'
      }
    })
  } catch (error) {
    console.error('Error creating page:', error)
    return NextResponse.json(
      { error: 'Failed to create page' },
      { status: 500 }
    )
  }
}
