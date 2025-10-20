
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting sections seed...')

  // First, let's create some sample products with different categories and tags
  const products = []

  // Easy Meals Anytime products
  for (let i = 1; i <= 10; i++) {
    const product = await prisma.product.upsert({
      where: { id: `easy-meal-${i}` },
      update: {},
      create: {
        id: `easy-meal-${i}`,
        name: `Quick Meal ${i}`,
        description: `Delicious ready-to-eat meal ${i} - perfect for busy Cork people`,
        price: 8.99 + (i * 0.5),
        imageUrl: 'https://cdn.abacus.ai/images/89c41a16-b55b-4ced-b876-30b5b3a7e3db.png',
        category: 'COMFORT_FOOD',
        storageType: 'FRESH_CHILLED',
        stockQuantity: 50,
        allergens: ['gluten'],
        calories: 450,
        preparationTime: 5,
        servingSize: 1,
        tags: ['quick', 'easy'],
        isActive: true
      }
    })
    products.push(product)
  }

  // Halal Meals
  for (let i = 1; i <= 10; i++) {
    const product = await prisma.product.upsert({
      where: { id: `halal-meal-${i}` },
      update: {},
      create: {
        id: `halal-meal-${i}`,
        name: `Halal Meal ${i}`,
        description: `Certified halal meal ${i} - authentic flavors for Cork's Muslim community`,
        price: 9.99 + (i * 0.5),
        imageUrl: 'https://cdn.abacus.ai/images/89c41a16-b55b-4ced-b876-30b5b3a7e3db.png',
        category: 'INTERNATIONAL',
        storageType: 'FROZEN',
        stockQuantity: 45,
        allergens: [],
        calories: 500,
        preparationTime: 10,
        servingSize: 1,
        tags: ['halal', 'international'],
        isActive: true
      }
    })
    products.push(product)
  }

  // PASTA Meals
  for (let i = 1; i <= 10; i++) {
    const product = await prisma.product.upsert({
      where: { id: `pasta-meal-${i}` },
      update: {},
      create: {
        id: `pasta-meal-${i}`,
        name: `Pasta Meal ${i}`,
        description: `Delicious pasta dish ${i} - Italian favorite made in Cork`,
        price: 7.99 + (i * 0.5),
        imageUrl: 'https://cdn.abacus.ai/images/89c41a16-b55b-4ced-b876-30b5b3a7e3db.png',
        category: 'INTERNATIONAL',
        storageType: 'FRESH_CHILLED',
        stockQuantity: 60,
        allergens: ['gluten', 'dairy'],
        calories: 550,
        preparationTime: 8,
        servingSize: 1,
        tags: ['pasta', 'italian'],
        isActive: true
      }
    })
    products.push(product)
  }

  // Best Offers - Discounted products
  for (let i = 1; i <= 10; i++) {
    const product = await prisma.product.upsert({
      where: { id: `best-offer-${i}` },
      update: {},
      create: {
        id: `best-offer-${i}`,
        name: `Special Offer Meal ${i}`,
        description: `Amazing deal on meal ${i} - limited time Cork special!`,
        price: 6.99 + (i * 0.3),
        originalPrice: 9.99 + (i * 0.5),
        imageUrl: 'https://cdn.abacus.ai/images/89c41a16-b55b-4ced-b876-30b5b3a7e3db.png',
        category: 'TRADITIONAL_IRISH',
        storageType: 'FROZEN',
        stockQuantity: 40,
        allergens: ['gluten'],
        calories: 480,
        preparationTime: 12,
        servingSize: 1,
        tags: ['offer', 'deal'],
        isActive: true,
        isBestOffer: true,
        discount: 30
      }
    })
    products.push(product)
  }

  // Top Savers Today - Best value products
  for (let i = 1; i <= 10; i++) {
    const product = await prisma.product.upsert({
      where: { id: `top-saver-${i}` },
      update: {},
      create: {
        id: `top-saver-${i}`,
        name: `Value Meal ${i}`,
        description: `Best value meal ${i} - great taste, better price for Cork families`,
        price: 5.99 + (i * 0.3),
        originalPrice: 8.99 + (i * 0.5),
        imageUrl: 'https://cdn.abacus.ai/images/89c41a16-b55b-4ced-b876-30b5b3a7e3db.png',
        category: 'COMFORT_FOOD',
        storageType: 'FROZEN',
        stockQuantity: 70,
        allergens: [],
        calories: 420,
        preparationTime: 7,
        servingSize: 1,
        tags: ['value', 'budget'],
        isActive: true,
        isTopSaver: true,
        discount: 25
      }
    })
    products.push(product)
  }

  console.log(`Created ${products.length} products`)

  // Create Product Sections
  const sections = [
    {
      name: 'Easy Meals Anytime',
      slug: 'easy-meals-anytime',
      title: 'Easy Meals Anytime',
      description: 'Quick and delicious meals ready when you are',
      displayOrder: 1,
      maxProducts: 10
    },
    {
      name: 'Halal Meals',
      slug: 'halal-meals',
      title: 'Halal Meals',
      description: 'Certified halal meals for our Cork Muslim community',
      displayOrder: 2,
      maxProducts: 10
    },
    {
      name: 'PASTA Meals',
      slug: 'pasta-meals',
      title: 'PASTA Meals',
      description: 'Italian favorites made with love in Cork',
      displayOrder: 3,
      maxProducts: 10
    },
    {
      name: 'Best Offers View',
      slug: 'best-offers-view',
      title: 'Best Offers View',
      description: 'Limited time deals you don\'t want to miss',
      displayOrder: 4,
      maxProducts: 10
    },
    {
      name: 'Top Savers Today',
      slug: 'top-savers-today',
      title: 'Top Savers Today',
      description: 'Best value meals for budget-conscious Cork families',
      displayOrder: 5,
      maxProducts: 10
    }
  ]

  for (const sectionData of sections) {
    const section = await prisma.productSection.upsert({
      where: { slug: sectionData.slug },
      update: sectionData,
      create: sectionData
    })

    console.log(`Created section: ${section.name}`)

    // Clear existing products in this section
    await prisma.sectionProduct.deleteMany({
      where: { sectionId: section.id }
    })

    // Add products to sections based on their tags/type
    let productIds: string[] = []
    
    if (sectionData.slug === 'easy-meals-anytime') {
      productIds = products.filter(p => p.id.startsWith('easy-meal-')).map(p => p.id)
    } else if (sectionData.slug === 'halal-meals') {
      productIds = products.filter(p => p.id.startsWith('halal-meal-')).map(p => p.id)
    } else if (sectionData.slug === 'pasta-meals') {
      productIds = products.filter(p => p.id.startsWith('pasta-meal-')).map(p => p.id)
    } else if (sectionData.slug === 'best-offers-view') {
      productIds = products.filter(p => p.id.startsWith('best-offer-')).map(p => p.id)
    } else if (sectionData.slug === 'top-savers-today') {
      productIds = products.filter(p => p.id.startsWith('top-saver-')).map(p => p.id)
    }

    // Add products to section
    for (let i = 0; i < productIds.length && i < 10; i++) {
      await prisma.sectionProduct.create({
        data: {
          sectionId: section.id,
          productId: productIds[i],
          displayOrder: i
        }
      })
    }

    console.log(`Added ${productIds.length} products to ${section.name}`)
  }

  console.log('Sections seed completed!')
}

main()
  .catch((e) => {
    console.error('Error seeding sections:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
