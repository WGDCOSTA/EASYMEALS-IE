
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = searchParams.get('page')

    if (!page) {
      return NextResponse.json(
        { error: 'Page parameter required' },
        { status: 400 }
      )
    }

    const pageContent = await prisma.pageContent.findUnique({
      where: { page }
    })

    if (!pageContent) {
      return NextResponse.json({ blocks: [] })
    }

    return NextResponse.json({ 
      blocks: pageContent.content 
    })
  } catch (error) {
    console.error('Error loading page:', error)
    return NextResponse.json(
      { error: 'Failed to load page' },
      { status: 500 }
    )
  }
}
