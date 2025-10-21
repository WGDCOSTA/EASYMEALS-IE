
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { nutritionProfile: true },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json(user.nutritionProfile)
  } catch (error) {
    console.error('Error fetching nutrition profile:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const data = await request.json()

    const profile = await prisma.nutritionProfile.upsert({
      where: { userId: user.id },
      update: {
        dailyCalories: data.dailyCalories,
        dailyProtein: data.dailyProtein,
        dailyCarbs: data.dailyCarbs,
        dailyFat: data.dailyFat,
        dietaryPreferences: data.dietaryPreferences || [],
        allergies: data.allergies || [],
        activityLevel: data.activityLevel,
        goal: data.goal,
        age: data.age,
        weight: data.weight,
        height: data.height,
        gender: data.gender,
        useAiSuggestions: data.useAiSuggestions,
      },
      create: {
        userId: user.id,
        dailyCalories: data.dailyCalories,
        dailyProtein: data.dailyProtein,
        dailyCarbs: data.dailyCarbs,
        dailyFat: data.dailyFat,
        dietaryPreferences: data.dietaryPreferences || [],
        allergies: data.allergies || [],
        activityLevel: data.activityLevel,
        goal: data.goal,
        age: data.age,
        weight: data.weight,
        height: data.height,
        gender: data.gender,
        useAiSuggestions: data.useAiSuggestions,
      },
    })

    return NextResponse.json(profile)
  } catch (error) {
    console.error('Error saving nutrition profile:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
