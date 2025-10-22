
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || ((session.user as any).role !== 'SUPER_ADMIN' && (session.user as any).role !== 'ADMIN')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { page, blocks } = await request.json()

    if (!page || !blocks) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Save or update page content
    const pageContent = await prisma.pageContent.upsert({
      where: { page },
      update: { 
        content: blocks 
      },
      create: {
        page,
        content: blocks
      }
    })

    return NextResponse.json({ 
      success: true,
      pageContent 
    })
  } catch (error) {
    console.error('Error saving page:', error)
    return NextResponse.json(
      { error: 'Failed to save page' },
      { status: 500 }
    )
  }
}
