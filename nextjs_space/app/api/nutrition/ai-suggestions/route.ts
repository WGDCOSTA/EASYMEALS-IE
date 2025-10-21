
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
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

    const profile = user.nutritionProfile
    if (!profile) {
      return NextResponse.json({ error: 'Nutrition profile not found' }, { status: 404 })
    }

    // Fetch all available products with nutrition data
    const products = await prisma.product.findMany({
      where: {
        isActive: true,
        calories: { not: null },
      },
      select: {
        id: true,
        name: true,
        calories: true,
        protein: true,
        carbs: true,
        fat: true,
        category: true,
        tags: true,
        price: true,
        imageUrl: true,
      },
    })

    const { mealType, servingsNeeded } = await request.json()

    const prompt = `You are a professional nutritionist creating personalized meal suggestions for a user with the following profile:

Daily Goals:
- Calories: ${profile.dailyCalories} kcal
- Protein: ${profile.dailyProtein}g
- Carbohydrates: ${profile.dailyCarbs}g
- Fat: ${profile.dailyFat}g

User Info:
- Goal: ${profile.goal}
- Activity Level: ${profile.activityLevel}
${profile.age ? `- Age: ${profile.age}` : ''}
${profile.weight ? `- Weight: ${profile.weight}kg` : ''}
${profile.height ? `- Height: ${profile.height}cm` : ''}
${profile.dietaryPreferences.length > 0 ? `- Dietary Preferences: ${profile.dietaryPreferences.join(', ')}` : ''}
${profile.allergies.length > 0 ? `- Allergies: ${profile.allergies.join(', ')}` : ''}

Meal Type: ${mealType || 'BREAKFAST'}

Available Products:
${products.map(p => `- ${p.name} (${p.calories}kcal, ${p.protein}g protein, ${p.carbs}g carbs, ${p.fat}g fat) [ID: ${p.id}]`).join('\n')}

Based on this information, suggest ${servingsNeeded || 3} suitable meals for ${mealType || 'BREAKFAST'} that:
1. Align with the user's nutrition goals
2. Consider their dietary preferences and allergies
3. Provide balanced nutrition
4. Are appropriate for the meal type
5. Stay within a reasonable portion of their daily calorie budget

For each suggestion, provide:
- The product ID from the available products
- Recommended serving size (as a multiplier, e.g., 1.0, 0.5, 1.5)
- Brief explanation of why this meal is recommended

Respond with raw JSON only in this format:
{
  "suggestions": [
    {
      "productId": "product_id_here",
      "servings": 1.0,
      "reason": "Brief explanation"
    }
  ],
  "nutritionalSummary": "Brief summary of how these meals support the user's goals"
}

Do not include code blocks, markdown, or any other formatting.`

    const response = await fetch('https://apps.abacus.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.ABACUSAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4.1-mini',
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        response_format: { type: "json_object" },
        max_tokens: 1500,
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to get AI response')
    }

    const aiResponse = await response.json()
    const content = aiResponse.choices?.[0]?.message?.content

    if (!content) {
      throw new Error('No content in AI response')
    }

    const suggestions = JSON.parse(content)

    // Enrich suggestions with product details
    const enrichedSuggestions = await Promise.all(
      suggestions.suggestions.map(async (suggestion: any) => {
        const product = await prisma.product.findUnique({
          where: { id: suggestion.productId },
        })

        return {
          ...suggestion,
          product,
        }
      })
    )

    return NextResponse.json({
      suggestions: enrichedSuggestions,
      nutritionalSummary: suggestions.nutritionalSummary,
    })
  } catch (error) {
    console.error('Error generating AI suggestions:', error)
    return NextResponse.json(
      { error: 'Failed to generate meal suggestions' },
      { status: 500 }
    )
  }
}
