
import { prisma } from '@/lib/db'

export interface PageContentData {
  [key: string]: any
}

/**
 * Fetches page content from the database
 * Returns default content if page doesn't exist in database
 */
export async function getPageContent(pageName: string): Promise<PageContentData> {
  try {
    const pageContent = await prisma.pageContent.findUnique({
      where: { page: pageName }
    })

    if (pageContent && pageContent.content) {
      return pageContent.content as PageContentData
    }

    // Return default content if not found
    return getDefaultContent(pageName)
  } catch (error) {
    console.error(`Error fetching page content for ${pageName}:`, error)
    return getDefaultContent(pageName)
  }
}

/**
 * Returns default content for pages that don't have database entries yet
 */
function getDefaultContent(pageName: string): PageContentData {
  const defaults: { [key: string]: PageContentData } = {
    'homepage': {
      heroTitle: 'Delicious Meals Delivered Fresh to Your Door',
      heroSubtitle: 'Freshly prepared meals from local Irish suppliers. Frozen or fresh chilled options. Order today, delivered tomorrow across Ireland and Northern Ireland.',
      ctaText: 'Browse Our Meals',
      ctaLink: '/meals'
    },
    'about': {
      title: 'About Us',
      content: "Welcome to EasyMeals.ie, Ireland's premier meal delivery service bringing fresh, delicious, and nutritious meals straight to your door."
    },
    'combos-meals': {
      title: 'Combo Meals for Cork Families',
      description: 'Perfect portion sizes for the whole family. Mix and match your favourites and save big on every order. Delivered fresh across Cork city and county.',
      imageUrl: 'https://cdn.abacus.ai/images/2642f787-d06a-4823-b9bf-10d7af831d03.png'
    },
    'kids-meals': {
      title: 'Kids Meals',
      description: 'Nutritious and delicious meals designed specifically for children',
      imageUrl: '/placeholder-image.jpg'
    },
    'halal-meals': {
      title: 'Halal Meals',
      description: 'Certified halal meals prepared with care',
      imageUrl: '/placeholder-image.jpg'
    },
    'student-life': {
      title: 'Student Meals',
      description: 'Affordable and nutritious meals perfect for students',
      imageUrl: '/placeholder-image.jpg'
    },
    'health-fitness': {
      title: 'Health & Fitness Meals',
      description: 'Balanced meals to support your fitness goals',
      imageUrl: '/placeholder-image.jpg'
    },
    'busy-life': {
      title: 'Meals for Busy Lifestyles',
      description: 'Quick and convenient meals for people on the go',
      imageUrl: '/placeholder-image.jpg'
    },
    'how-it-works': {
      title: 'How It Works',
      subtitle: 'Getting delicious, healthy meals delivered to your door is easier than ever'
    }
  }

  return defaults[pageName] || {}
}
