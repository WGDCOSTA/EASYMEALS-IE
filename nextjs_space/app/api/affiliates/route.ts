
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

function generateReferralCode(name: string): string {
  const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase()
  const namePrefix = name.replace(/[^a-zA-Z]/g, '').substring(0, 4).toUpperCase()
  return `${namePrefix}${randomStr}`
}

export async function GET() {
  try {
    const affiliates = await prisma.affiliate.findMany({
      include: {
        referrals: true,
        payouts: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(affiliates)
  } catch (error) {
    console.error('Error fetching affiliates:', error)
    return NextResponse.json(
      { error: 'Failed to fetch affiliates' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, phone, company, commissionRate } = body

    // Check if email already exists
    const existingAffiliate = await prisma.affiliate.findUnique({
      where: { email }
    })

    if (existingAffiliate) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      )
    }

    const referralCode = generateReferralCode(name)

    const affiliate = await prisma.affiliate.create({
      data: {
        name,
        email,
        phone,
        company,
        referralCode,
        commissionRate: commissionRate || 20.0,
        status: 'PENDING'
      }
    })

    return NextResponse.json(affiliate)
  } catch (error) {
    console.error('Error creating affiliate:', error)
    return NextResponse.json(
      { error: 'Failed to create affiliate' },
      { status: 500 }
    )
  }
}
