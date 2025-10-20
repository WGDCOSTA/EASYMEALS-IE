
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const affiliate = await prisma.affiliate.findUnique({
      where: { id: params.id },
      include: {
        referrals: {
          orderBy: {
            createdAt: 'desc'
          }
        },
        payouts: {
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    })

    if (!affiliate) {
      return NextResponse.json(
        { error: 'Affiliate not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(affiliate)
  } catch (error) {
    console.error('Error fetching affiliate:', error)
    return NextResponse.json(
      { error: 'Failed to fetch affiliate' },
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
    const { status, commissionRate, paypalEmail, bankDetails } = body

    const affiliate = await prisma.affiliate.update({
      where: { id: params.id },
      data: {
        status,
        commissionRate,
        paypalEmail,
        bankDetails
      }
    })

    return NextResponse.json(affiliate)
  } catch (error) {
    console.error('Error updating affiliate:', error)
    return NextResponse.json(
      { error: 'Failed to update affiliate' },
      { status: 500 }
    )
  }
}
