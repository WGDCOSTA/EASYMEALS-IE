
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  // Create delivery zones
  const corkZone = await prisma.deliveryZone.upsert({
    where: { id: 'cork-city' },
    update: {},
    create: {
      id: 'cork-city',
      name: 'Cork City',
      areas: ['Cork City Centre', 'Blackpool', 'Sunday\'s Well', 'Shandon', 'St. Luke\'s', 'Tivoli', 'Douglas', 'Ballincollig', 'Wilton'],
      deliveryFee: 4.99,
      isActive: true
    }
  })

  // Create admin user
  const hashedPassword = await bcrypt.hash('010203', 12)
  const adminUser = await prisma.user.upsert({
    where: { email: 'wgdc2011@gmail.com' },
    update: {},
    create: {
      email: 'wgdc2011@gmail.com',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'SUPER_ADMIN',
      name: 'Admin User'
    }
  })

  // Create test user (john@doe.com with password johndoe123)
  const testHashedPassword = await bcrypt.hash('johndoe123', 12)
  const testUser = await prisma.user.upsert({
    where: { email: 'john@doe.com' },
    update: {},
    create: {
      email: 'john@doe.com',
      password: testHashedPassword,
      firstName: 'John',
      lastName: 'Doe',
      name: 'John Doe',
      phone: '0876543210',
      address: '123 Patrick Street, Cork, Ireland',
      role: 'USER'
    }
  })

  // Create products with the generated images
  const products = [
    {
      id: 'beef-stew',
      name: 'Traditional Irish Beef Stew',
      description: 'Hearty traditional Irish stew with tender beef chunks, carrots, potatoes, and onions slow-cooked in a rich, savory broth. Made with locally sourced ingredients and traditional Irish recipes.',
      price: 12.99,
      imageUrl: 'https://cdn.abacus.ai/images/89c41a16-b55b-4ced-b876-30b5b3a7e3db.png',
      category: 'TRADITIONAL_IRISH' as const,
      storageType: 'FRESH_CHILLED' as const,
      stockQuantity: 50,
      allergens: ['gluten', 'celery'],
      calories: 380,
      protein: 28.5,
      carbs: 32.0,
      fat: 15.2,
      preparationTime: 8,
      servingSize: 1,
      ingredients: 'Irish beef, potatoes, carrots, onions, celery, beef stock, fresh herbs, flour, salt, pepper'
    },
    {
      id: 'chicken-mushroom-pie',
      name: 'Chicken & Mushroom Pie',
      description: 'Golden flaky pastry pie filled with tender chicken breast and fresh mushrooms in a creamy white sauce. Perfect comfort food that can be heated from frozen.',
      price: 10.99,
      imageUrl: 'https://cdn.abacus.ai/images/231e9e58-adbc-4b65-9b1d-6f80a05369ae.png',
      category: 'COMFORT_FOOD' as const,
      storageType: 'FROZEN' as const,
      stockQuantity: 40,
      allergens: ['gluten', 'milk', 'eggs'],
      calories: 450,
      protein: 25.0,
      carbs: 35.0,
      fat: 22.0,
      preparationTime: 45,
      servingSize: 1,
      ingredients: 'Chicken breast, mushrooms, puff pastry, cream, flour, butter, onions, chicken stock, thyme'
    },
    {
      id: 'shepherds-pie',
      name: 'Shepherd\'s Pie',
      description: 'Classic shepherd\'s pie with succulent minced lamb in rich gravy topped with creamy mashed potatoes. A traditional Irish favorite that\'s hearty and satisfying.',
      price: 11.49,
      imageUrl: 'https://cdn.abacus.ai/images/97a684c9-d237-4e5c-8ab8-4cb488f90050.png',
      category: 'TRADITIONAL_IRISH' as const,
      storageType: 'FROZEN' as const,
      stockQuantity: 35,
      allergens: ['milk'],
      calories: 420,
      protein: 22.0,
      carbs: 38.0,
      fat: 18.5,
      preparationTime: 35,
      servingSize: 1,
      ingredients: 'Minced lamb, potatoes, carrots, peas, onions, tomato paste, Worcestershire sauce, milk, butter'
    },
    {
      id: 'teriyaki-salmon',
      name: 'Teriyaki Salmon with Rice',
      description: 'Fresh Atlantic salmon fillet glazed with homemade teriyaki sauce, served with steamed jasmine rice and mixed vegetables. A healthy, protein-rich meal.',
      price: 15.99,
      imageUrl: 'https://assets.bonappetit.com/photos/57c59b946a6acdf3485df90f/16:9/w_2560%2Cc_limit/salmon-teriyaki-rice-dinner-bowl.jpg',
      category: 'SEAFOOD' as const,
      storageType: 'FRESH_CHILLED' as const,
      stockQuantity: 25,
      allergens: ['fish', 'soy', 'sesame'],
      calories: 520,
      protein: 35.0,
      carbs: 45.0,
      fat: 20.0,
      preparationTime: 15,
      servingSize: 1,
      ingredients: 'Atlantic salmon, jasmine rice, broccoli, carrots, soy sauce, mirin, sugar, ginger, garlic, sesame oil'
    },
    {
      id: 'mediterranean-chicken',
      name: 'Mediterranean Chicken Bowl',
      description: 'Grilled chicken breast with quinoa, roasted Mediterranean vegetables, feta cheese, and herb dressing. A nutritious and flavorful healthy option.',
      price: 13.49,
      imageUrl: 'https://sofreshnsogreen.com/wp-content/uploads/2020/07/DSC_5315-scaled.jpg',
      category: 'HEALTHY' as const,
      storageType: 'FRESH_CHILLED' as const,
      stockQuantity: 30,
      allergens: ['milk'],
      calories: 480,
      protein: 38.0,
      carbs: 35.0,
      fat: 20.0,
      preparationTime: 5,
      servingSize: 1,
      ingredients: 'Chicken breast, quinoa, cherry tomatoes, cucumber, red onion, feta cheese, olives, olive oil, lemon, herbs'
    },
    {
      id: 'thai-green-curry',
      name: 'Thai Green Curry',
      description: 'Authentic Thai green curry with tender chicken, vegetables, and aromatic spices in coconut milk, served with fragrant jasmine rice.',
      price: 12.49,
      imageUrl: 'https://www.zojirushi.com/user/images/recipe/266.1.jpg',
      category: 'INTERNATIONAL' as const,
      storageType: 'FROZEN' as const,
      stockQuantity: 45,
      allergens: [],
      calories: 450,
      protein: 28.0,
      carbs: 42.0,
      fat: 18.0,
      preparationTime: 12,
      servingSize: 1,
      ingredients: 'Chicken thigh, coconut milk, green curry paste, jasmine rice, Thai basil, bamboo shoots, Thai eggplant'
    },
    {
      id: 'lasagna-bolognese',
      name: 'Lasagna Bolognese',
      description: 'Traditional Italian lasagna with layers of pasta, rich Bolognese sauce, béchamel, and melted cheese. A family favorite that serves generously.',
      price: 14.99,
      imageUrl: 'https://i0.wp.com/smittenkitchen.com/wp-content/uploads/2012/02/lasagna-bolognese-4-scaled.jpg',
      category: 'INTERNATIONAL' as const,
      storageType: 'FROZEN' as const,
      stockQuantity: 20,
      allergens: ['gluten', 'milk', 'eggs'],
      calories: 550,
      protein: 30.0,
      carbs: 40.0,
      fat: 28.0,
      preparationTime: 50,
      servingSize: 1,
      ingredients: 'Minced beef, lasagna sheets, tomatoes, onions, carrots, celery, milk, flour, butter, parmesan, mozzarella'
    },
    {
      id: 'caesar-chicken-salad',
      name: 'Caesar Chicken Salad',
      description: 'Fresh romaine lettuce with grilled chicken breast, parmesan shavings, croutons, and creamy Caesar dressing. A light yet satisfying meal.',
      price: 9.99,
      imageUrl: 'https://i0.wp.com/smittenkitchen.com/wp-content/uploads/2008/01/chicken-caesar-salad-1-scaled.jpg',
      category: 'HEALTHY' as const,
      storageType: 'FRESH_CHILLED' as const,
      stockQuantity: 35,
      allergens: ['gluten', 'milk', 'eggs', 'fish'],
      calories: 320,
      protein: 32.0,
      carbs: 15.0,
      fat: 16.0,
      preparationTime: 2,
      servingSize: 1,
      ingredients: 'Chicken breast, romaine lettuce, parmesan cheese, croutons, Caesar dressing, anchovies, lemon'
    },
    {
      id: 'fish-chips',
      name: 'Fish & Chips',
      description: 'Beer-battered fresh cod with thick-cut chips and mushy peas. A British classic made with sustainable Irish fish and locally sourced potatoes.',
      price: 13.99,
      imageUrl: 'https://hips.hearstapps.com/hmg-prod/images/190208-beer-battered-fish-384-1550379136.jpg',
      category: 'SEAFOOD' as const,
      storageType: 'FROZEN' as const,
      stockQuantity: 30,
      allergens: ['fish', 'gluten'],
      calories: 580,
      protein: 32.0,
      carbs: 55.0,
      fat: 24.0,
      preparationTime: 25,
      servingSize: 1,
      ingredients: 'Fresh cod, potatoes, flour, beer, peas, mint, malt vinegar, sunflower oil'
    },
    {
      id: 'vegetable-stir-fry',
      name: 'Vegetable Stir Fry with Tofu',
      description: 'Colorful mixed vegetables with marinated tofu and rice noodles in a savory Asian-style sauce. A healthy vegetarian option packed with nutrients.',
      price: 11.99,
      imageUrl: 'https://img.taste.com.au/ODsk7EWK/taste/2016/11/tofu-vegetable-rice-noodle-stir-fry-74993-1.jpeg',
      category: 'VEGETARIAN' as const,
      storageType: 'FRESH_CHILLED' as const,
      stockQuantity: 40,
      allergens: ['soy', 'sesame'],
      calories: 390,
      protein: 18.0,
      carbs: 48.0,
      fat: 14.0,
      preparationTime: 8,
      servingSize: 1,
      ingredients: 'Tofu, rice noodles, broccoli, bell peppers, carrots, snow peas, soy sauce, sesame oil, ginger, garlic'
    }
  ]

  for (const product of products) {
    await prisma.product.upsert({
      where: { id: product.id },
      update: {},
      create: product
    })
  }

  console.log('✅ Database seeded successfully!')
  console.log(`👤 Admin user: wgdc2011@gmail.com / 010203`)
  console.log(`🚚 Delivery zone: ${corkZone.name}`)
  console.log(`🍽️ Created ${products.length} products`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
