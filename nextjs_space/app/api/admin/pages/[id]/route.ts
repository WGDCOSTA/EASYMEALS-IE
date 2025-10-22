
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

// GET single page
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || ((session.user as any).role !== 'SUPER_ADMIN' && (session.user as any).role !== 'ADMIN')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params

    const page = await prisma.pageContent.findUnique({
      where: { id }
    })

    if (!page) {
      return NextResponse.json(
        { error: 'Page not found' },
        { status: 404 }
      )
    }

    const content = page.content as any

    return NextResponse.json({ 
      page: {
        id: page.id,
        page: page.page,
        title: content?.title || page.page,
        slug: content?.slug || page.page,
        status: content?.status || 'published',
        content: content || { blocks: [] }
      }
    })
  } catch (error) {
    console.error('Error loading page:', error)
    return NextResponse.json(
      { error: 'Failed to load page' },
      { status: 500 }
    )
  }
}

// PUT update page
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || ((session.user as any).role !== 'SUPER_ADMIN' && (session.user as any).role !== 'ADMIN')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params
    const { title, slug, status, content } = await request.json()

    const page = await prisma.pageContent.findUnique({
      where: { id }
    })

    if (!page) {
      return NextResponse.json(
        { error: 'Page not found' },
        { status: 404 }
      )
    }

    // If slug is changing, check if new slug already exists
    if (slug && slug !== page.page) {
      const existing = await prisma.pageContent.findUnique({
        where: { page: slug }
      })

      if (existing) {
        return NextResponse.json(
          { error: 'A page with this slug already exists' },
          { status: 409 }
        )
      }
    }

    const updatedPage = await prisma.pageContent.update({
      where: { id },
      data: {
        page: slug || page.page,
        content: {
          title: title || (page.content as any)?.title,
          slug: slug || page.page,
          status: status || (page.content as any)?.status,
          blocks: content?.blocks || (page.content as any)?.blocks || []
        }
      }
    })

    return NextResponse.json({ 
      success: true,
      page: updatedPage
    })
  } catch (error) {
    console.error('Error updating page:', error)
    return NextResponse.json(
      { error: 'Failed to update page' },
      { status: 500 }
    )
  }
}

// DELETE page
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || ((session.user as any).role !== 'SUPER_ADMIN' && (session.user as any).role !== 'ADMIN')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params

    await prisma.pageContent.delete({
      where: { id }
    })

    return NextResponse.json({ 
      success: true
    })
  } catch (error) {
    console.error('Error deleting page:', error)
    return NextResponse.json(
      { error: 'Failed to delete page' },
      { status: 500 }
    )
  }
}
