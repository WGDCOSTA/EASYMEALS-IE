

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
export const maxDuration = 60

// Check if LLM APIs are configured
const isLLMConfigured = () => {
  return !!process.env.ABACUSAI_API_KEY
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || ((session.user as any).role !== 'ADMIN' && (session.user as any).role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!isLLMConfigured()) {
      return NextResponse.json({ 
        error: 'AI service not configured. Please configure LLM APIs first.' 
      }, { status: 503 })
    }

    const { description, ingredients, shortDescription, name } = await request.json()

    // Prepare the prompt for AI
    const prompt = `You are a nutrition expert. Based on the following meal/product information, extract and calculate the nutritional information per serving. Return ONLY a valid JSON object with the following structure, no additional text:

{
  "calories": number (kcal),
  "energyKj": number (kilojoules),
  "protein": number (grams),
  "carbs": number (grams),
  "sugars": number (grams),
  "fat": number (grams),
  "saturatedFat": number (grams),
  "fiber": number (grams),
  "salt": number (grams),
  "servingWeight": number (grams per serving)
}

Product Information:
Name: ${name || 'Not provided'}
Short Description: ${shortDescription || 'Not provided'}
Full Description: ${description || 'Not provided'}
Ingredients: ${ingredients || 'Not provided'}

Important:
- All values should be numeric (integers or decimals)
- Use null for any value you cannot determine
- Base calculations on standard serving sizes (typically 300-400g for meals)
- Ensure energyKj = calories * 4.184 (approximately)
- Return ONLY the JSON object, no markdown, no explanation`

    // Call Abacus AI API
    const response = await fetch('https://api.abacus.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.ABACUSAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 1000
      })
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error('AI API Error:', errorData)
      return NextResponse.json({ 
        error: 'Failed to generate nutrition data from AI service' 
      }, { status: 500 })
    }

    const aiResponse = await response.json()
    const aiContent = aiResponse.choices?.[0]?.message?.content

    if (!aiContent) {
      return NextResponse.json({ 
        error: 'No response from AI service' 
      }, { status: 500 })
    }

    // Parse the AI response
    let nutritionData
    try {
      // Remove any markdown code blocks if present
      const cleanedContent = aiContent.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
      nutritionData = JSON.parse(cleanedContent)
    } catch (parseError) {
      console.error('Failed to parse AI response:', aiContent)
      return NextResponse.json({ 
        error: 'Invalid response format from AI service',
        details: aiContent
      }, { status: 500 })
    }

    return NextResponse.json(nutritionData)
  } catch (error) {
    console.error('AI Nutrition API Error:', error)
    return NextResponse.json(
      { error: 'Failed to generate nutrition data' },
      { status: 500 }
    )
  }
}
