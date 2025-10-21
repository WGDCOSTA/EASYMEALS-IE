
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
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const { searchParams } = new URL(request.url)
    const date = searchParams.get('date') || new Date().toISOString().split('T')[0]

    const mealPlan = await prisma.mealPlan.findFirst({
      where: {
        userId: user.id,
        date: {
          gte: new Date(date),
          lt: new Date(new Date(date).getTime() + 24 * 60 * 60 * 1000),
        },
      },
      include: {
        meals: {
          include: {
            product: true,
          },
        },
      },
    })

    return NextResponse.json(mealPlan)
  } catch (error) {
    console.error('Error fetching meal plan:', error)
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

    // Create or update meal plan
    const mealPlan = await prisma.mealPlan.create({
      data: {
        userId: user.id,
        name: data.name || 'My Meal Plan',
        date: new Date(data.date || new Date()),
        isAiGenerated: data.isAiGenerated || false,
        meals: {
          create: data.meals.map((meal: any) => ({
            productId: meal.productId,
            mealType: meal.mealType,
            servings: meal.servings || 1,
            scheduledTime: meal.scheduledTime,
            calories: meal.calories,
            protein: meal.protein,
            carbs: meal.carbs,
            fat: meal.fat,
          })),
        },
      },
      include: {
        meals: {
          include: {
            product: true,
          },
        },
      },
    })

    // Update daily intake
    const totalCalories = data.meals.reduce((sum: number, meal: any) => sum + (meal.calories || 0), 0)
    const totalProtein = data.meals.reduce((sum: number, meal: any) => sum + (meal.protein || 0), 0)
    const totalCarbs = data.meals.reduce((sum: number, meal: any) => sum + (meal.carbs || 0), 0)
    const totalFat = data.meals.reduce((sum: number, meal: any) => sum + (meal.fat || 0), 0)

    await prisma.dailyIntake.upsert({
      where: {
        userId_date: {
          userId: user.id,
          date: new Date(data.date || new Date()),
        },
      },
      update: {
        totalCalories,
        totalProtein,
        totalCarbs,
        totalFat,
      },
      create: {
        userId: user.id,
        date: new Date(data.date || new Date()),
        totalCalories,
        totalProtein,
        totalCarbs,
        totalFat,
      },
    })

    return NextResponse.json(mealPlan)
  } catch (error) {
    console.error('Error creating meal plan:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
