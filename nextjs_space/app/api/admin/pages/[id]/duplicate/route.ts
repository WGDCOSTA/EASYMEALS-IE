
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function POST(
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

    const originalPage = await prisma.pageContent.findUnique({
      where: { id }
    })

    if (!originalPage) {
      return NextResponse.json(
        { error: 'Page not found' },
        { status: 404 }
      )
    }

    const originalContent = originalPage.content as any
    const originalSlug = originalContent?.slug || originalPage.page
    const originalTitle = originalContent?.title || originalPage.page

    // Generate unique slug
    let newSlug = `${originalSlug}-copy`
    let counter = 1
    while (await prisma.pageContent.findUnique({ where: { page: newSlug } })) {
      newSlug = `${originalSlug}-copy-${counter}`
      counter++
    }

    const duplicatedPage = await prisma.pageContent.create({
      data: {
        page: newSlug,
        content: {
          ...originalContent,
          title: `${originalTitle} (Copy)`,
          slug: newSlug,
          status: 'draft'
        }
      }
    })

    return NextResponse.json({ 
      success: true,
      page: duplicatedPage
    })
  } catch (error) {
    console.error('Error duplicating page:', error)
    return NextResponse.json(
      { error: 'Failed to duplicate page' },
      { status: 500 }
    )
  }
}
