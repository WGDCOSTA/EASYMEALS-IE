
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { ingredients, productName } = await request.json()

    if (!ingredients && !productName) {
      return NextResponse.json(
        { error: 'Please provide ingredients or product name' },
        { status: 400 }
      )
    }

    const prompt = `You are a professional nutritionist and food analyst. Analyze the following meal and provide accurate nutritional information per 100g based on standard nutritional databases and your expertise.

${productName ? `Product Name: ${productName}` : ''}
${ingredients ? `Ingredients: ${ingredients}` : ''}

Provide detailed nutritional information in the following JSON format:
{
  "calories": <number in kcal>,
  "energyKj": <number in kJ>,
  "protein": <number in grams>,
  "carbs": <number in grams>,
  "sugars": <number in grams>,
  "fat": <number in grams>,
  "saturatedFat": <number in grams>,
  "fiber": <number in grams>,
  "salt": <number in grams>,
  "servingWeight": <recommended serving size in grams>,
  "servingSize": <number of servings>,
  "preparationTime": <estimated preparation time in minutes>
}

Base your analysis on:
1. Standard nutritional databases (USDA, UK Food Standards)
2. Typical serving sizes for this type of meal
3. EU nutritional labeling standards
4. Realistic preparation times

Respond with raw JSON only. Do not include code blocks, markdown, or any other formatting.`

    const response = await fetch('https://apps.abacus.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.ABACUSAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4.1-mini',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        response_format: { type: "json_object" },
        stream: true,
        max_tokens: 1000,
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to get AI response')
    }

    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body?.getReader()
        if (!reader) {
          controller.close()
          return
        }

        const decoder = new TextDecoder()
        const encoder = new TextEncoder()
        let buffer = ''
        let partialRead = ''

        try {
          while (true) {
            const { done, value } = await reader.read()
            if (done) break

            partialRead += decoder.decode(value, { stream: true })
            let lines = partialRead.split('\n')
            partialRead = lines.pop() || ''

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const data = line.slice(6)
                if (data === '[DONE]') {
                  try {
                    const finalResult = JSON.parse(buffer)
                    const finalData = JSON.stringify({
                      status: 'completed',
                      result: finalResult
                    })
                    controller.enqueue(encoder.encode(`data: ${finalData}\n\n`))
                  } catch (e) {
                    console.error('Error parsing final JSON:', e)
                    const errorData = JSON.stringify({
                      status: 'error',
                      message: 'Failed to parse nutrition data'
                    })
                    controller.enqueue(encoder.encode(`data: ${errorData}\n\n`))
                  }
                  controller.close()
                  return
                }
                try {
                  const parsed = JSON.parse(data)
                  const content = parsed.choices?.[0]?.delta?.content || ''
                  buffer += content
                  
                  const progressData = JSON.stringify({
                    status: 'processing',
                    message: 'Analyzing nutritional content...'
                  })
                  controller.enqueue(encoder.encode(`data: ${progressData}\n\n`))
                } catch (e) {
                  // Skip invalid JSON
                }
              }
            }
          }
        } catch (error) {
          console.error('Stream error:', error)
          const errorData = JSON.stringify({
            status: 'error',
            message: 'Stream processing failed'
          })
          controller.enqueue(encoder.encode(`data: ${errorData}\n\n`))
          controller.close()
        }
      },
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })

  } catch (error) {
    console.error('Error in nutrition AI:', error)
    return NextResponse.json(
      { error: 'Failed to analyze nutrition data' },
      { status: 500 }
    )
  }
}
