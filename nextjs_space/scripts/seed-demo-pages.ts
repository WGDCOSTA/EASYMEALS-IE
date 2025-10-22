
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding demo pages...')

  // Demo pages with structured content
  const demoPages = [
    {
      page: 'homepage',
      content: {
        title: 'EasyMeals.ie - Fresh Ready Meals Delivered',
        slug: 'homepage',
        status: 'published',
        heroTitle: 'Delicious Ready Meals Delivered to Your Door',
        heroSubtitle: 'Fresh, nutritious meals ready in minutes. No cooking, no hassle.',
        ctaText: 'Browse Our Meals',
        ctaLink: '/meals',
        blocks: [
          {
            id: 'hero-1',
            type: 'hero',
            content: {
              title: 'Delicious Ready Meals Delivered to Your Door',
              subtitle: 'Fresh, nutritious meals ready in minutes. No cooking, no hassle.',
              image: '/images/hero-home.jpg',
              ctaText: 'Browse Our Meals',
              ctaLink: '/meals'
            }
          }
        ]
      },
      metaTitle: 'EasyMeals.ie - Fresh Ready Meals Delivered to Your Door',
      metaDescription: 'Order delicious, healthy ready meals online. Fresh ingredients, chef-prepared, delivered across Ireland. Perfect for busy families, students, and fitness enthusiasts.',
      metaKeywords: ['ready meals', 'meal delivery', 'fresh food', 'Ireland', 'healthy meals']
    },
    {
      page: 'about-us',
      content: {
        title: 'About EasyMeals.ie',
        slug: 'about-us',
        status: 'published',
        blocks: [
          {
            id: 'about-1',
            type: 'text',
            content: {
              heading: 'About EasyMeals.ie',
              text: 'We are passionate about making nutritious, delicious meals accessible to everyone in Ireland. Our chef-prepared meals are made with fresh, locally-sourced ingredients and delivered right to your door.'
            }
          },
          {
            id: 'about-2',
            type: 'features',
            content: {
              items: [
                { title: 'Fresh Ingredients', description: 'Locally sourced produce' },
                { title: 'Chef Prepared', description: 'Restaurant-quality meals' },
                { title: 'Fast Delivery', description: 'Across Ireland' }
              ]
            }
          }
        ]
      },
      metaTitle: 'About Us - EasyMeals.ie',
      metaDescription: 'Learn about EasyMeals.ie, Ireland\'s leading ready meal delivery service. Fresh ingredients, chef-prepared meals, and convenient home delivery.',
      metaKeywords: ['about easymeals', 'meal delivery ireland', 'food company']
    },
    {
      page: 'combos-meals',
      content: {
        title: 'Combo Meals - Value Packs',
        slug: 'combos-meals',
        status: 'published',
        description: 'Save more with our combo meal packages. Perfect for families or meal prep.',
        blocks: []
      },
      metaTitle: 'Combo Meals & Family Packs - EasyMeals.ie',
      metaDescription: 'Save with our combo meal packages. Perfect for families and meal planning. Fresh ready meals delivered across Ireland.',
      metaKeywords: ['combo meals', 'family meals', 'meal packs', 'value meals']
    },
    {
      page: 'kids-meals',
      content: {
        title: 'Kids Meals - Healthy & Tasty',
        slug: 'kids-meals',
        status: 'published',
        description: 'Nutritious meals your kids will love. Made with fresh ingredients.',
        blocks: []
      },
      metaTitle: 'Kids Meals - Healthy Food Children Love | EasyMeals.ie',
      metaDescription: 'Nutritious kids meals made with fresh ingredients. Balanced meals that children actually enjoy. Delivered fresh across Ireland.',
      metaKeywords: ['kids meals', 'children food', 'healthy kids meals', 'family meals']
    },
    {
      page: 'halal-meals',
      content: {
        title: 'Halal Meals - Certified Fresh',
        slug: 'halal-meals',
        status: 'published',
        description: 'Certified halal meals prepared with care and quality ingredients.',
        blocks: []
      },
      metaTitle: 'Halal Ready Meals - Certified & Fresh | EasyMeals.ie',
      metaDescription: 'Order certified halal ready meals online. Fresh, delicious, and delivered across Ireland. 100% halal ingredients and preparation.',
      metaKeywords: ['halal meals', 'halal food', 'islamic food', 'halal delivery ireland']
    }
  ]

  for (const pageData of demoPages) {
    await prisma.pageContent.upsert({
      where: { page: pageData.page },
      update: {
        content: pageData.content,
        metaTitle: pageData.metaTitle,
        metaDescription: pageData.metaDescription,
        metaKeywords: pageData.metaKeywords
      },
      create: {
        page: pageData.page,
        content: pageData.content,
        metaTitle: pageData.metaTitle,
        metaDescription: pageData.metaDescription,
        metaKeywords: pageData.metaKeywords
      }
    })
    console.log(`✓ Created/Updated page: ${pageData.page}`)
  }

  console.log('✅ Demo pages seeded successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding demo pages:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
