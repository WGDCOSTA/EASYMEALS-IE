
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'
export const revalidate = 3600 // Revalidate every hour

/**
 * LLMs.txt endpoint - Provides a structured list of important URLs for AI crawlers
 * This follows the llms.txt specification for LLM-optimized sitemaps
 */
export async function GET() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://easymeals.abacusai.app'
    
    // Fetch all active products
    const products = await prisma.product.findMany({
      where: { 
        isActive: true,
        noIndex: { not: true }
      },
      select: {
        id: true,
        name: true,
        seoSlug: true,
        updatedAt: true,
        metaDescription: true
      },
      orderBy: { updatedAt: 'desc' }
    })

    // Fetch all published pages
    const pages = await prisma.pageContent.findMany({
      where: {
        noIndex: { not: true }
      },
      select: {
        page: true,
        metaTitle: true,
        metaDescription: true,
        updatedAt: true
      }
    })

    // Fetch active categories
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      select: {
        slug: true,
        name: true,
        description: true
      }
    })

    // Build the llms.txt content
    let llmsTxt = `# EasyMeals.ie - LLM-Optimized Sitemap
# Generated: ${new Date().toISOString()}
# This file helps AI assistants discover and understand our content
# For more information, visit: https://llmstxt.org/

## Main Pages
${baseUrl}/
${baseUrl}/about
${baseUrl}/how-it-works
${baseUrl}/meals
${baseUrl}/contact
${baseUrl}/faq

## Product Categories
`

    for (const category of categories) {
      llmsTxt += `${baseUrl}/meals?category=${category.slug} # ${category.name}\n`
    }

    llmsTxt += `\n## Featured Products\n`
    
    for (const product of products.slice(0, 50)) { // Limit to top 50 products
      const slug = product.seoSlug || product.id
      const description = product.metaDescription || product.name
      llmsTxt += `${baseUrl}/meals/${slug} # ${product.name} - ${description.substring(0, 100)}\n`
    }

    llmsTxt += `\n## Dynamic Pages
`
    
    for (const page of pages) {
      const title = (page.metaTitle as string) || page.page
      const description = (page.metaDescription as string) || ''
      llmsTxt += `${baseUrl}/${page.page} # ${title}${description ? ' - ' + description.substring(0, 80) : ''}\n`
    }

    llmsTxt += `\n## Special Pages
${baseUrl}/combos-meals # Combo meal packages and family packs
${baseUrl}/kids-meals # Nutritious meals for children
${baseUrl}/halal-meals # Certified halal ready meals
${baseUrl}/student-life # Budget-friendly student meals
${baseUrl}/health-fitness # Healthy meals for fitness enthusiasts
${baseUrl}/busy-life # Quick meals for busy professionals

## API Documentation
# Public APIs available for integration
${baseUrl}/api/products # Product catalog API
${baseUrl}/api/categories # Categories API

## Important Notes
# - All products are fresh, ready-to-eat meals
# - Delivery available across Ireland
# - Nutritional information available for all products
# - Multiple dietary options: Halal, Vegetarian, Vegan, Gluten-Free
# - AI-powered meal planning and nutrition tracking available
`

    return new NextResponse(llmsTxt, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400'
      }
    })
  } catch (error) {
    console.error('Error generating llms.txt:', error)
    return new NextResponse('# Error generating llms.txt', {
      status: 500,
      headers: { 'Content-Type': 'text/plain' }
    })
  }
}
